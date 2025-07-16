from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import uuid
import csv
import io
import logging
import requests
import json
from requests.exceptions import RequestException

from . import models, schemas
from ..orders.models import Order
from ...clients.tracking import SeventeenTrackClient, AftershipClient, ShippoClient, EasypostClient

logger = logging.getLogger(__name__)

# Initialize tracking clients
seventeen_track_client = SeventeenTrackClient()
aftership_client = AftershipClient()
shippo_client = ShippoClient()
easypost_client = EasypostClient()

def get_trackings(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    status: Optional[str] = None,
    order_id: Optional[str] = None
) -> List[models.Tracking]:
    """
    Get trackings for a user
    """
    query = db.query(models.Tracking).filter(models.Tracking.user_id == user_id)
    
    if status:
        query = query.filter(models.Tracking.status == status)
    
    if order_id:
        query = query.filter(models.Tracking.order_id == order_id)
    
    query = query.order_by(models.Tracking.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_tracking(db: Session, tracking_id: str, user_id: str) -> Optional[models.Tracking]:
    """
    Get a tracking by ID
    """
    return db.query(models.Tracking).filter(
        models.Tracking.id == tracking_id,
        models.Tracking.user_id == user_id
    ).first()

def get_tracking_by_number(db: Session, tracking_number: str, user_id: str) -> Optional[models.Tracking]:
    """
    Get a tracking by tracking number
    """
    return db.query(models.Tracking).filter(
        models.Tracking.tracking_number == tracking_number,
        models.Tracking.user_id == user_id
    ).first()

def create_tracking(db: Session, tracking: schemas.TrackingCreate, user_id: str) -> models.Tracking:
    """
    Create a new tracking
    """
    # Check if tracking already exists
    existing_tracking = get_tracking_by_number(db, tracking.tracking_number, user_id)
    if existing_tracking:
        return existing_tracking
    
    # Get carrier code if not provided
    carrier_code = None
    if tracking.carrier:
        # Look up carrier code
        carrier_info = db.query(models.CarrierInfo).filter(models.CarrierInfo.name == tracking.carrier).first()
        if carrier_info:
            carrier_code = carrier_info.code
    
    # Create tracking
    db_tracking = models.Tracking(
        id=str(uuid.uuid4()),
        user_id=user_id,
        order_id=tracking.order_id,
        tracking_number=tracking.tracking_number,
        carrier=tracking.carrier,
        carrier_code=carrier_code or tracking.carrier_code,
        provider=tracking.provider,
        status=models.TrackingStatus.pending
    )
    
    db.add(db_tracking)
    db.commit()
    db.refresh(db_tracking)
    
    # If order ID is provided, update order with tracking info
    if tracking.order_id:
        order = db.query(Order).filter(Order.id == tracking.order_id).first()
        if order:
            order.tracking_number = tracking.tracking_number
            order.carrier = tracking.carrier
            db.commit()
    
    return db_tracking

def update_tracking(db: Session, tracking_id: str, tracking: schemas.TrackingUpdate) -> models.Tracking:
    """
    Update a tracking
    """
    db_tracking = db.query(models.Tracking).filter(models.Tracking.id == tracking_id).first()
    if not db_tracking:
        raise ValueError(f"Tracking not found: {tracking_id}")
    
    # Update fields if provided
    if tracking.carrier is not None:
        db_tracking.carrier = tracking.carrier
    
    if tracking.carrier_code is not None:
        db_tracking.carrier_code = tracking.carrier_code
    
    if tracking.status is not None:
        db_tracking.status = tracking.status
    
    if tracking.status_description is not None:
        db_tracking.status_description = tracking.status_description
    
    if tracking.origin_country is not None:
        db_tracking.origin_country = tracking.origin_country
    
    if tracking.destination_country is not None:
        db_tracking.destination_country = tracking.destination_country
    
    if tracking.estimated_delivery is not None:
        db_tracking.estimated_delivery = tracking.estimated_delivery
    
    if tracking.shipped_at is not None:
        db_tracking.shipped_at = tracking.shipped_at
    
    if tracking.delivered_at is not None:
        db_tracking.delivered_at = tracking.delivered_at
    
    if tracking.provider is not None:
        db_tracking.provider = tracking.provider
    
    if tracking.metadata is not None:
        db_tracking.metadata = tracking.metadata
    
    db_tracking.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_tracking)
    
    return db_tracking

def delete_tracking(db: Session, tracking_id: str) -> None:
    """
    Delete a tracking
    """
    db_tracking = db.query(models.Tracking).filter(models.Tracking.id == tracking_id).first()
    if db_tracking:
        db.delete(db_tracking)
        db.commit()

def check_tracking_status(db: Session, tracking_id: str) -> models.Tracking:
    """
    Check tracking status with the appropriate provider
    """
    tracking = db.query(models.Tracking).filter(models.Tracking.id == tracking_id).first()
    if not tracking:
        logger.error(f"Tracking not found: {tracking_id}")
        return None
    
    try:
        # Update last checked timestamp
        tracking.last_checked = datetime.utcnow()
        db.commit()
        
        # Get tracking data from provider
        tracking_data = None
        
        if tracking.provider == models.TrackingProvider.seventeen_track:
            tracking_data = seventeen_track_client.get_tracking(
                tracking_number=tracking.tracking_number,
                carrier_code=tracking.carrier_code
            )
        elif tracking.provider == models.TrackingProvider.aftership:
            tracking_data = aftership_client.get_tracking(
                tracking_number=tracking.tracking_number,
                carrier_code=tracking.carrier_code
            )
        elif tracking.provider == models.TrackingProvider.shippo:
            tracking_data = shippo_client.get_tracking(
                tracking_number=tracking.tracking_number,
                carrier_code=tracking.carrier_code
            )
        elif tracking.provider == models.TrackingProvider.easypost:
            tracking_data = easypost_client.get_tracking(
                tracking_number=tracking.tracking_number,
                carrier_code=tracking.carrier_code
            )
        else:
            # For other providers, use a mock implementation
            tracking_data = get_mock_tracking_data(tracking.tracking_number, tracking.carrier)
        
        if not tracking_data:
            logger.warning(f"No tracking data returned for {tracking.tracking_number}")
            return tracking
        
        # Update tracking with new data
        update_tracking_from_data(db, tracking, tracking_data)
        
        # Check if we need to send notifications
        check_and_send_notifications(db, tracking)
        
        return tracking
        
    except Exception as e:
        logger.error(f"Error checking tracking status: {e}")
        return tracking

def update_tracking_from_data(db: Session, tracking: models.Tracking, tracking_data: Dict[str, Any]) -> None:
    """
    Update tracking with data from provider
    """
    # Update tracking fields
    tracking.status = tracking_data.get("status", tracking.status)
    tracking.status_description = tracking_data.get("status_description", tracking.status_description)
    tracking.origin_country = tracking_data.get("origin_country", tracking.origin_country)
    tracking.destination_country = tracking_data.get("destination_country", tracking.destination_country)
    tracking.estimated_delivery = tracking_data.get("estimated_delivery", tracking.estimated_delivery)
    tracking.shipped_at = tracking_data.get("shipped_at", tracking.shipped_at)
    tracking.delivered_at = tracking_data.get("delivered_at", tracking.delivered_at)
    tracking.last_update = datetime.utcnow()
    
    # If carrier is not set, use the one from tracking data
    if not tracking.carrier and tracking_data.get("carrier"):
        tracking.carrier = tracking_data.get("carrier")
    
    # If carrier code is not set, use the one from tracking data
    if not tracking.carrier_code and tracking_data.get("carrier_code"):
        tracking.carrier_code = tracking_data.get("carrier_code")
    
    # Save external ID if provided
    if tracking_data.get("external_id"):
        tracking.external_id = tracking_data.get("external_id")
    
    # Save metadata if provided
    if tracking_data.get("metadata"):
        tracking.metadata = tracking_data.get("metadata")
    
    # Process events
    if tracking_data.get("events"):
        process_tracking_events(db, tracking, tracking_data.get("events"))
    
    db.commit()
    db.refresh(tracking)

def process_tracking_events(db: Session, tracking: models.Tracking, events: List[Dict[str, Any]]) -> None:
    """
    Process tracking events
    """
    # Get existing events
    existing_events = {
        (event.status, event.timestamp.isoformat()): event
        for event in tracking.events
    }
    
    # Process new events
    for event_data in events:
        # Create a unique key for this event
        event_key = (event_data.get("status"), event_data.get("timestamp").isoformat())
        
        # Skip if event already exists
        if event_key in existing_events:
            continue
        
        # Create new event
        event = models.TrackingEvent(
            id=str(uuid.uuid4()),
            tracking_id=tracking.id,
            status=event_data.get("status"),
            status_description=event_data.get("status_description"),
            location=event_data.get("location"),
            timestamp=event_data.get("timestamp"),
            message=event_data.get("message"),
            metadata=event_data.get("metadata")
        )
        
        db.add(event)
    
    db.commit()

def check_and_send_notifications(db: Session, tracking: models.Tracking) -> None:
    """
    Check if notifications should be sent and send them
    """
    # Get user's tracking settings
    settings = get_tracking_settings(db, user_id=tracking.user_id)
    if not settings or not settings.notify_customer:
        return
    
    # Get order if available
    order = None
    if tracking.order_id:
        order = db.query(Order).filter(Order.id == tracking.order_id).first()
    
    # Check for status changes that trigger notifications
    if tracking.status == models.TrackingStatus.delivered:
        # Delivery notification
        if "email" in settings.notification_types and order and order.customer_email:
            create_and_send_notification(
                db,
                tracking_id=tracking.id,
                notification_type="email",
                recipient=order.customer_email,
                trigger_event="delivery"
            )
    
    elif tracking.status == models.TrackingStatus.exception:
        # Exception notification
        if "email" in settings.notification_types and order and order.customer_email:
            create_and_send_notification(
                db,
                tracking_id=tracking.id,
                notification_type="email",
                recipient=order.customer_email,
                trigger_event="exception"
            )
    
    # Always send webhook if configured
    if settings.webhook_url:
        create_and_send_notification(
            db,
            tracking_id=tracking.id,
            notification_type="webhook",
            recipient=settings.webhook_url,
            trigger_event="status_update"
        )

def create_and_send_notification(
    db: Session,
    tracking_id: str,
    notification_type: str,
    recipient: str,
    trigger_event: str
) -> models.TrackingNotification:
    """
    Create and send a tracking notification
    """
    # Create notification
    notification = models.TrackingNotification(
        id=str(uuid.uuid4()),
        tracking_id=tracking_id,
        type=notification_type,
        recipient=recipient,
        status="pending",
        trigger_event=trigger_event
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    # Send notification
    send_tracking_notification(db, notification_id=notification.id)
    
    return notification

def send_tracking_notification(db: Session, notification_id: str) -> None:
    """
    Send a tracking notification
    """
    notification = db.query(models.TrackingNotification).filter(models.TrackingNotification.id == notification_id).first()
    if not notification:
        logger.error(f"Notification not found: {notification_id}")
        return
    
    try:
        # Get tracking
        tracking = db.query(models.Tracking).filter(models.Tracking.id == notification.tracking_id).first()
        if not tracking:
            raise ValueError(f"Tracking not found: {notification.tracking_id}")
        
        # Get order if available
        order = None
        if tracking.order_id:
            order = db.query(Order).filter(Order.id == tracking.order_id).first()
        
        # Prepare notification content
        if notification.type == "email":
            content = prepare_email_notification(tracking, order, notification.trigger_event)
            send_email_notification(notification.recipient, content)
        
        elif notification.type == "sms":
            content = prepare_sms_notification(tracking, order, notification.trigger_event)
            send_sms_notification(notification.recipient, content)
        
        elif notification.type == "push":
            content = prepare_push_notification(tracking, order, notification.trigger_event)
            send_push_notification(notification.recipient, content)
        
        elif notification.type == "webhook":
            content = prepare_webhook_notification(tracking, order, notification.trigger_event)
            send_webhook_notification(notification.recipient, content)
        
        else:
            raise ValueError(f"Unsupported notification type: {notification.type}")
        
        # Update notification
        notification.status = "sent"
        notification.content = content
        notification.sent_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error sending notification: {e}")
        
        # Update notification with error
        notification.status = "failed"
        notification.error_message = str(e)
        db.commit()

def prepare_email_notification(tracking: models.Tracking, order: Optional[Order], trigger_event: str) -> str:
    """
    Prepare email notification content
    """
    # In a real implementation, this would generate HTML email content
    # For brevity, we'll return a simple text template
    
    if trigger_event == "delivery":
        return f"Votre commande a été livrée! Numéro de suivi: {tracking.tracking_number}"
    
    elif trigger_event == "exception":
        return f"Il y a un problème avec votre livraison. Numéro de suivi: {tracking.tracking_number}"
    
    else:  # status_update
        return f"Mise à jour de votre livraison: {tracking.status_description}. Numéro de suivi: {tracking.tracking_number}"

def prepare_sms_notification(tracking: models.Tracking, order: Optional[Order], trigger_event: str) -> str:
    """
    Prepare SMS notification content
    """
    # Similar to email but shorter
    if trigger_event == "delivery":
        return f"Livré! Commande {order.id if order else ''} - Suivi: {tracking.tracking_number}"
    
    elif trigger_event == "exception":
        return f"Problème livraison! Commande {order.id if order else ''} - Suivi: {tracking.tracking_number}"
    
    else:  # status_update
        return f"Mise à jour: {tracking.status_description} - Suivi: {tracking.tracking_number}"

def prepare_push_notification(tracking: models.Tracking, order: Optional[Order], trigger_event: str) -> Dict[str, Any]:
    """
    Prepare push notification content
    """
    # Return a structured object for push notifications
    if trigger_event == "delivery":
        return {
            "title": "Commande livrée!",
            "body": f"Votre commande {order.id if order else ''} a été livrée.",
            "data": {
                "tracking_id": tracking.id,
                "tracking_number": tracking.tracking_number,
                "order_id": order.id if order else None
            }
        }
    
    elif trigger_event == "exception":
        return {
            "title": "Problème de livraison",
            "body": f"Il y a un problème avec votre commande {order.id if order else ''}.",
            "data": {
                "tracking_id": tracking.id,
                "tracking_number": tracking.tracking_number,
                "order_id": order.id if order else None
            }
        }
    
    else:  # status_update
        return {
            "title": "Mise à jour de livraison",
            "body": tracking.status_description or f"Statut: {tracking.status}",
            "data": {
                "tracking_id": tracking.id,
                "tracking_number": tracking.tracking_number,
                "order_id": order.id if order else None
            }
        }

def prepare_webhook_notification(tracking: models.Tracking, order: Optional[Order], trigger_event: str) -> Dict[str, Any]:
    """
    Prepare webhook notification content
    """
    # Return a structured object for webhook
    return {
        "event": trigger_event,
        "tracking": {
            "id": tracking.id,
            "tracking_number": tracking.tracking_number,
            "carrier": tracking.carrier,
            "status": tracking.status,
            "status_description": tracking.status_description,
            "last_update": tracking.last_update.isoformat() if tracking.last_update else None
        },
        "order": {
            "id": order.id,
            "customer_name": order.customer_name,
            "customer_email": order.customer_email
        } if order else None,
        "timestamp": datetime.utcnow().isoformat()
    }

def send_email_notification(recipient: str, content: str) -> None:
    """
    Send email notification
    """
    # In a real implementation, this would send an actual email
    # For now, just log it
    logger.info(f"Sending email to {recipient}: {content[:50]}...")

def send_sms_notification(recipient: str, content: str) -> None:
    """
    Send SMS notification
    """
    # In a real implementation, this would send an actual SMS
    # For now, just log it
    logger.info(f"Sending SMS to {recipient}: {content}")

def send_push_notification(recipient: str, content: Dict[str, Any]) -> None:
    """
    Send push notification
    """
    # In a real implementation, this would send an actual push notification
    # For now, just log it
    logger.info(f"Sending push notification to {recipient}: {content['title']}")

def send_webhook_notification(webhook_url: str, content: Dict[str, Any]) -> None:
    """
    Send webhook notification
    """
    try:
        response = requests.post(
            webhook_url,
            json=content,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if not response.ok:
            raise ValueError(f"Webhook request failed: {response.status_code} {response.text}")
        
    except RequestException as e:
        raise ValueError(f"Webhook request error: {e}")

def get_tracking_settings(db: Session, user_id: str) -> Optional[models.TrackingSettings]:
    """
    Get tracking settings for a user
    """
    return db.query(models.TrackingSettings).filter(models.TrackingSettings.user_id == user_id).first()

def create_tracking_settings(db: Session, user_id: str) -> models.TrackingSettings:
    """
    Create default tracking settings for a user
    """
    settings = models.TrackingSettings(
        id=str(uuid.uuid4()),
        user_id=user_id,
        default_provider=models.TrackingProvider.seventeen_track,
        auto_track_orders=True,
        notify_customer=True,
        notification_types=["email"]
    )
    
    db.add(settings)
    db.commit()
    db.refresh(settings)
    
    return settings

def update_tracking_settings(db: Session, settings_id: str, settings: schemas.TrackingSettingsUpdate) -> models.TrackingSettings:
    """
    Update tracking settings
    """
    db_settings = db.query(models.TrackingSettings).filter(models.TrackingSettings.id == settings_id).first()
    if not db_settings:
        raise ValueError(f"Tracking settings not found: {settings_id}")
    
    # Update fields if provided
    if settings.default_provider is not None:
        db_settings.default_provider = settings.default_provider
    
    if settings.auto_track_orders is not None:
        db_settings.auto_track_orders = settings.auto_track_orders
    
    if settings.notify_customer is not None:
        db_settings.notify_customer = settings.notify_customer
    
    if settings.notification_types is not None:
        db_settings.notification_types = settings.notification_types
    
    if settings.api_keys is not None:
        db_settings.api_keys = settings.api_keys
    
    if settings.webhook_url is not None:
        db_settings.webhook_url = settings.webhook_url
    
    db_settings.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_settings)
    
    return db_settings

def get_carriers(db: Session, country: Optional[str] = None, active_only: bool = True) -> List[models.CarrierInfo]:
    """
    Get carrier information
    """
    query = db.query(models.CarrierInfo)
    
    if active_only:
        query = query.filter(models.CarrierInfo.is_active == True)
    
    if country:
        # Filter carriers that support the specified country
        query = query.filter(models.CarrierInfo.countries.contains([country]))
    
    return query.all()

def get_tracking_stats(
    db: Session, 
    user_id: str, 
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> Dict[str, Any]:
    """
    Get tracking statistics
    """
    # Set default date range if not provided
    if not end_date:
        end_date = datetime.utcnow()
    
    if not start_date:
        start_date = end_date - timedelta(days=30)
    
    # Get total trackings
    total_trackings = db.query(models.Tracking).filter(
        models.Tracking.user_id == user_id,
        models.Tracking.created_at >= start_date,
        models.Tracking.created_at <= end_date
    ).count()
    
    # Get status counts
    status_counts = []
    for status in models.TrackingStatus:
        count = db.query(models.Tracking).filter(
            models.Tracking.user_id == user_id,
            models.Tracking.status == status,
            models.Tracking.created_at >= start_date,
            models.Tracking.created_at <= end_date
        ).count()
        
        status_counts.append({
            "status": status,
            "count": count
        })
    
    # Calculate average delivery days
    delivered_trackings = db.query(models.Tracking).filter(
        models.Tracking.user_id == user_id,
        models.Tracking.status == models.TrackingStatus.delivered,
        models.Tracking.shipped_at.isnot(None),
        models.Tracking.delivered_at.isnot(None),
        models.Tracking.created_at >= start_date,
        models.Tracking.created_at <= end_date
    ).all()
    
    total_delivery_days = 0
    for tracking in delivered_trackings:
        delivery_days = (tracking.delivered_at - tracking.shipped_at).days
        total_delivery_days += delivery_days
    
    average_delivery_days = total_delivery_days / len(delivered_trackings) if delivered_trackings else None
    
    # Calculate on-time delivery rate
    on_time_deliveries = 0
    for tracking in delivered_trackings:
        if tracking.estimated_delivery and tracking.delivered_at <= tracking.estimated_delivery:
            on_time_deliveries += 1
    
    on_time_delivery_rate = (on_time_deliveries / len(delivered_trackings) * 100) if delivered_trackings else None
    
    # Calculate exception rate
    exception_count = db.query(models.Tracking).filter(
        models.Tracking.user_id == user_id,
        models.Tracking.status == models.TrackingStatus.exception,
        models.Tracking.created_at >= start_date,
        models.Tracking.created_at <= end_date
    ).count()
    
    exception_rate = (exception_count / total_trackings * 100) if total_trackings > 0 else 0
    
    # Get carrier stats
    carrier_stats = {}
    carriers = db.query(models.Tracking.carrier, func.count(models.Tracking.id).label('count')).filter(
        models.Tracking.user_id == user_id,
        models.Tracking.created_at >= start_date,
        models.Tracking.created_at <= end_date
    ).group_by(models.Tracking.carrier).all()
    
    for carrier, count in carriers:
        if carrier:
            carrier_stats[carrier] = {
                "count": count,
                "percentage": (count / total_trackings * 100) if total_trackings > 0 else 0
            }
    
    # Get country stats
    country_stats = {}
    countries = db.query(models.Tracking.destination_country, func.count(models.Tracking.id).label('count')).filter(
        models.Tracking.user_id == user_id,
        models.Tracking.destination_country.isnot(None),
        models.Tracking.created_at >= start_date,
        models.Tracking.created_at <= end_date
    ).group_by(models.Tracking.destination_country).all()
    
    for country, count in countries:
        if country:
            country_stats[country] = {
                "count": count,
                "percentage": (count / total_trackings * 100) if total_trackings > 0 else 0
            }
    
    return {
        "total_trackings": total_trackings,
        "status_counts": status_counts,
        "average_delivery_days": average_delivery_days,
        "on_time_delivery_rate": on_time_delivery_rate,
        "exception_rate": exception_rate,
        "carrier_stats": carrier_stats,
        "country_stats": country_stats
    }

def create_tracking_notification(
    db: Session,
    tracking_id: str,
    notification_type: str,
    recipient: str,
    trigger_event: str
) -> models.TrackingNotification:
    """
    Create a tracking notification
    """
    notification = models.TrackingNotification(
        id=str(uuid.uuid4()),
        tracking_id=tracking_id,
        type=notification_type,
        recipient=recipient,
        status="pending",
        trigger_event=trigger_event
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return notification

def import_trackings_from_csv(db: Session, file_content: bytes, user_id: str) -> Dict[str, Any]:
    """
    Import trackings from CSV file
    """
    try:
        # Parse CSV
        csv_content = file_content.decode('utf-8')
        reader = csv.DictReader(io.StringIO(csv_content))
        rows = list(reader)
        
        # Process each row
        imported = 0
        failed = 0
        tracking_ids = []
        errors = []
        
        for row in rows:
            try:
                # Extract tracking data
                tracking_number = row.get('tracking_number')
                if not tracking_number:
                    raise ValueError("Tracking number is required")
                
                # Create tracking
                tracking_data = schemas.TrackingCreate(
                    tracking_number=tracking_number,
                    carrier=row.get('carrier'),
                    carrier_code=row.get('carrier_code'),
                    order_id=row.get('order_id'),
                    provider=row.get('provider', 'seventeen_track')
                )
                
                tracking = create_tracking(db, tracking=tracking_data, user_id=user_id)
                tracking_ids.append(tracking.id)
                imported += 1
                
            except Exception as e:
                failed += 1
                errors.append({
                    "row": row,
                    "error": str(e)
                })
        
        return {
            "success": True,
            "total": len(rows),
            "imported": imported,
            "failed": failed,
            "tracking_ids": tracking_ids,
            "errors": errors
        }
        
    except Exception as e:
        logger.error(f"Error importing trackings from CSV: {e}")
        return {
            "success": False,
            "total": 0,
            "imported": 0,
            "failed": 0,
            "tracking_ids": [],
            "errors": [{"error": str(e)}]
        }

def get_mock_tracking_data(tracking_number: str, carrier: Optional[str] = None) -> Dict[str, Any]:
    """
    Get mock tracking data for testing
    """
    # Generate consistent mock data based on tracking number
    status_options = list(models.TrackingStatus)
    status_index = sum(ord(c) for c in tracking_number) % len(status_options)
    status = status_options[status_index]
    
    # Generate events based on status
    events = []
    
    # Always add info received event
    info_received_date = datetime.utcnow() - timedelta(days=5)
    events.append({
        "status": models.TrackingStatus.info_received,
        "status_description": "Shipping information received",
        "location": "Origin Facility",
        "timestamp": info_received_date,
        "message": "Shipping label created"
    })
    
    # Add in_transit events
    if status in [models.TrackingStatus.in_transit, models.TrackingStatus.out_for_delivery, models.TrackingStatus.delivered, models.TrackingStatus.exception]:
        transit_date = info_received_date + timedelta(days=1)
        events.append({
            "status": models.TrackingStatus.in_transit,
            "status_description": "Package in transit",
            "location": "Origin Sorting Center",
            "timestamp": transit_date,
            "message": "Package has left the origin facility"
        })
        
        transit_date2 = transit_date + timedelta(days=2)
        events.append({
            "status": models.TrackingStatus.in_transit,
            "status_description": "Package in transit",
            "location": "International Hub",
            "timestamp": transit_date2,
            "message": "Package processed at international hub"
        })
    
    # Add out_for_delivery event
    if status in [models.TrackingStatus.out_for_delivery, models.TrackingStatus.delivered, models.TrackingStatus.exception]:
        delivery_date = datetime.utcnow() - timedelta(days=1)
        events.append({
            "status": models.TrackingStatus.out_for_delivery,
            "status_description": "Out for delivery",
            "location": "Local Delivery Facility",
            "timestamp": delivery_date,
            "message": "Package is out for delivery"
        })
    
    # Add final event based on status
    if status == models.TrackingStatus.delivered:
        delivered_date = datetime.utcnow() - timedelta(hours=4)
        events.append({
            "status": models.TrackingStatus.delivered,
            "status_description": "Delivered",
            "location": "Destination",
            "timestamp": delivered_date,
            "message": "Package has been delivered"
        })
    elif status == models.TrackingStatus.exception:
        exception_date = datetime.utcnow() - timedelta(hours=12)
        events.append({
            "status": models.TrackingStatus.exception,
            "status_description": "Delivery exception",
            "location": "Local Delivery Facility",
            "timestamp": exception_date,
            "message": "Delivery attempt failed: recipient not available"
        })
    
    # Sort events by timestamp
    events.sort(key=lambda e: e["timestamp"], reverse=True)
    
    # Determine shipped_at and delivered_at
    shipped_at = next((e["timestamp"] for e in reversed(events) if e["status"] == models.TrackingStatus.in_transit), None)
    delivered_at = next((e["timestamp"] for e in events if e["status"] == models.TrackingStatus.delivered), None)
    
    # Calculate estimated delivery
    estimated_delivery = None
    if shipped_at and not delivered_at:
        estimated_delivery = shipped_at + timedelta(days=7)
    
    return {
        "status": status,
        "status_description": events[0]["status_description"] if events else None,
        "origin_country": "China",
        "destination_country": "France",
        "estimated_delivery": estimated_delivery,
        "shipped_at": shipped_at,
        "delivered_at": delivered_at,
        "carrier": carrier or "Mock Carrier",
        "carrier_code": "mock",
        "events": events,
        "metadata": {
            "mock_data": True,
            "tracking_number": tracking_number
        }
    }