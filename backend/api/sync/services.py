from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, timedelta
import uuid
import logging
import json
import requests
from requests.exceptions import RequestException

from . import models, schemas
from ..products.models import Product
from ..orders.models import Order
from ...clients.shopify import ShopifyClient
from ...clients.woocommerce import WooCommerceClient
from ...clients.prestashop import PrestashopClient
from ...clients.magento import MagentoClient
from ...clients.etsy import EtsyClient
from ...clients.ebay import EbayClient
from ...clients.amazon import AmazonClient
from ...clients.bigcommerce import BigCommerceClient

logger = logging.getLogger(__name__)

def get_store_connections(db: Session, user_id: str) -> List[models.StoreConnection]:
    """
    Get all store connections for a user
    """
    return db.query(models.StoreConnection).filter(models.StoreConnection.user_id == user_id).all()

def get_store_connection(db: Session, connection_id: str, user_id: str) -> Optional[models.StoreConnection]:
    """
    Get a store connection by ID
    """
    return db.query(models.StoreConnection).filter(
        models.StoreConnection.id == connection_id,
        models.StoreConnection.user_id == user_id
    ).first()

def create_store_connection(db: Session, connection: schemas.StoreConnectionCreate, user_id: str) -> models.StoreConnection:
    """
    Create a new store connection
    """
    # Create connection
    db_connection = models.StoreConnection(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=connection.name,
        platform=connection.platform,
        store_url=str(connection.store_url),
        api_key=connection.api_key,
        api_secret=connection.api_secret,
        api_version=connection.api_version,
        is_active=connection.is_active,
        settings=connection.settings
    )
    
    db.add(db_connection)
    db.commit()
    db.refresh(db_connection)
    
    return db_connection

def update_store_connection(db: Session, connection_id: str, connection: schemas.StoreConnectionUpdate) -> models.StoreConnection:
    """
    Update a store connection
    """
    db_connection = db.query(models.StoreConnection).filter(models.StoreConnection.id == connection_id).first()
    if not db_connection:
        raise ValueError(f"Store connection not found: {connection_id}")
    
    # Update fields if provided
    if connection.name is not None:
        db_connection.name = connection.name
    
    if connection.api_key is not None:
        db_connection.api_key = connection.api_key
    
    if connection.api_secret is not None:
        db_connection.api_secret = connection.api_secret
    
    if connection.api_version is not None:
        db_connection.api_version = connection.api_version
    
    if connection.is_active is not None:
        db_connection.is_active = connection.is_active
    
    if connection.settings is not None:
        db_connection.settings = connection.settings
    
    db_connection.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_connection)
    
    return db_connection

def delete_store_connection(db: Session, connection_id: str) -> None:
    """
    Delete a store connection
    """
    db_connection = db.query(models.StoreConnection).filter(models.StoreConnection.id == connection_id).first()
    if db_connection:
        db.delete(db_connection)
        db.commit()

def test_store_connection(db: Session, connection: models.StoreConnection) -> Dict[str, Any]:
    """
    Test a store connection
    """
    try:
        # Get platform client
        client = get_platform_client(connection)
        
        # Test connection
        result = client.test_connection()
        
        return {
            "success": True,
            "message": "Connection successful",
            "details": result
        }
    except Exception as e:
        logger.error(f"Error testing store connection: {e}")
        return {
            "success": False,
            "message": f"Connection failed: {str(e)}",
            "details": None
        }

def get_platform_client(connection: models.StoreConnection) -> Any:
    """
    Get the appropriate client for a platform
    """
    if connection.platform == models.PlatformType.shopify:
        return ShopifyClient(
            shop_url=connection.store_url,
            api_key=connection.api_key,
            api_secret=connection.api_secret,
            api_version=connection.api_version,
            access_token=connection.access_token
        )
    elif connection.platform == models.PlatformType.woocommerce:
        return WooCommerceClient(
            store_url=connection.store_url,
            consumer_key=connection.api_key,
            consumer_secret=connection.api_secret
        )
    elif connection.platform == models.PlatformType.prestashop:
        return PrestashopClient(
            store_url=connection.store_url,
            api_key=connection.api_key
        )
    elif connection.platform == models.PlatformType.magento:
        return MagentoClient(
            store_url=connection.store_url,
            access_token=connection.access_token
        )
    elif connection.platform == models.PlatformType.etsy:
        return EtsyClient(
            api_key=connection.api_key,
            access_token=connection.access_token,
            refresh_token=connection.refresh_token
        )
    elif connection.platform == models.PlatformType.ebay:
        return EbayClient(
            api_key=connection.api_key,
            access_token=connection.access_token,
            refresh_token=connection.refresh_token
        )
    elif connection.platform == models.PlatformType.amazon:
        return AmazonClient(
            api_key=connection.api_key,
            api_secret=connection.api_secret,
            marketplace_id=connection.settings.get("marketplace_id") if connection.settings else None
        )
    elif connection.platform == models.PlatformType.bigcommerce:
        return BigCommerceClient(
            store_url=connection.store_url,
            access_token=connection.access_token
        )
    else:
        raise ValueError(f"Unsupported platform: {connection.platform}")

def create_sync_job(db: Session, job: schemas.SyncJobCreate, user_id: str) -> models.SyncJob:
    """
    Create a new sync job
    """
    # Create job
    db_job = models.SyncJob(
        id=str(uuid.uuid4()),
        user_id=user_id,
        store_connection_id=job.store_connection_id,
        direction=job.direction,
        entity_type=job.entity_type,
        status=models.SyncStatus.pending,
        settings=job.settings
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    return db_job

def get_sync_jobs(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    status: Optional[str] = None,
    connection_id: Optional[str] = None,
    entity_type: Optional[str] = None
) -> List[models.SyncJob]:
    """
    Get sync jobs for a user
    """
    query = db.query(models.SyncJob).filter(models.SyncJob.user_id == user_id)
    
    if status:
        query = query.filter(models.SyncJob.status == status)
    
    if connection_id:
        query = query.filter(models.SyncJob.store_connection_id == connection_id)
    
    if entity_type:
        query = query.filter(models.SyncJob.entity_type == entity_type)
    
    query = query.order_by(models.SyncJob.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_sync_job(db: Session, job_id: str, user_id: str) -> Optional[models.SyncJob]:
    """
    Get a sync job by ID
    """
    return db.query(models.SyncJob).filter(
        models.SyncJob.id == job_id,
        models.SyncJob.user_id == user_id
    ).first()

def cancel_sync_job(db: Session, job_id: str) -> models.SyncJob:
    """
    Cancel a sync job
    """
    job = db.query(models.SyncJob).filter(models.SyncJob.id == job_id).first()
    if not job:
        raise ValueError(f"Sync job not found: {job_id}")
    
    # Update job status
    job.status = models.SyncStatus.failed
    job.error_message = "Job canceled by user"
    job.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(job)
    
    return job

def process_sync_job(db: Session, job_id: str) -> None:
    """
    Process a sync job
    """
    job = db.query(models.SyncJob).filter(models.SyncJob.id == job_id).first()
    if not job:
        logger.error(f"Sync job not found: {job_id}")
        return
    
    # Get store connection
    connection = db.query(models.StoreConnection).filter(models.StoreConnection.id == job.store_connection_id).first()
    if not connection:
        logger.error(f"Store connection not found: {job.store_connection_id}")
        update_job_status(db, job_id, models.SyncStatus.failed, "Store connection not found")
        return
    
    # Update job status
    job.status = models.SyncStatus.in_progress
    job.started_at = datetime.utcnow()
    db.commit()
    
    start_time = datetime.utcnow()
    
    try:
        # Get platform client
        client = get_platform_client(connection)
        
        # Process based on direction and entity type
        if job.direction == models.SyncDirection.import_to_dropflow:
            if job.entity_type == models.SyncEntityType.product:
                import_products(db, job, client)
            elif job.entity_type == models.SyncEntityType.order:
                import_orders(db, job, client)
            elif job.entity_type == models.SyncEntityType.customer:
                import_customers(db, job, client)
            elif job.entity_type == models.SyncEntityType.inventory:
                import_inventory(db, job, client)
            elif job.entity_type == models.SyncEntityType.all:
                import_all(db, job, client)
            else:
                raise ValueError(f"Unsupported entity type: {job.entity_type}")
        
        elif job.direction == models.SyncDirection.export_from_dropflow:
            if job.entity_type == models.SyncEntityType.product:
                export_products(db, job, client)
            elif job.entity_type == models.SyncEntityType.order:
                export_orders(db, job, client)
            elif job.entity_type == models.SyncEntityType.customer:
                export_customers(db, job, client)
            elif job.entity_type == models.SyncEntityType.inventory:
                export_inventory(db, job, client)
            elif job.entity_type == models.SyncEntityType.all:
                export_all(db, job, client)
            else:
                raise ValueError(f"Unsupported entity type: {job.entity_type}")
        
        elif job.direction == models.SyncDirection.bidirectional:
            if job.entity_type == models.SyncEntityType.product:
                sync_products_bidirectional(db, job, client)
            elif job.entity_type == models.SyncEntityType.order:
                sync_orders_bidirectional(db, job, client)
            elif job.entity_type == models.SyncEntityType.customer:
                sync_customers_bidirectional(db, job, client)
            elif job.entity_type == models.SyncEntityType.inventory:
                sync_inventory_bidirectional(db, job, client)
            elif job.entity_type == models.SyncEntityType.all:
                sync_all_bidirectional(db, job, client)
            else:
                raise ValueError(f"Unsupported entity type: {job.entity_type}")
        
        else:
            raise ValueError(f"Unsupported sync direction: {job.direction}")
        
        # Update job status based on results
        if job.failed_items == 0:
            job.status = models.SyncStatus.completed
        elif job.successful_items == 0:
            job.status = models.SyncStatus.failed
        else:
            job.status = models.SyncStatus.partial
        
    except Exception as e:
        logger.error(f"Error processing sync job {job_id}: {e}")
        
        # Update job status
        job.status = models.SyncStatus.failed
        job.error_message = str(e)
    
    # Calculate duration
    end_time = datetime.utcnow()
    duration_seconds = int((end_time - start_time).total_seconds())
    
    # Update job completion time
    job.completed_at = end_time
    db.commit()
    
    # Create sync log
    create_sync_log(
        db,
        user_id=job.user_id,
        store_connection_id=job.store_connection_id,
        sync_job_id=job.id,
        direction=job.direction,
        entity_type=job.entity_type,
        status=job.status,
        total_items=job.total_items,
        successful_items=job.successful_items,
        failed_items=job.failed_items,
        error_message=job.error_message,
        duration_seconds=duration_seconds
    )
    
    # Update store connection last sync time
    connection.last_sync_at = end_time
    db.commit()

def update_job_status(db: Session, job_id: str, status: models.SyncStatus, error_message: Optional[str] = None) -> None:
    """
    Update a sync job's status
    """
    job = db.query(models.SyncJob).filter(models.SyncJob.id == job_id).first()
    if job:
        job.status = status
        if error_message:
            job.error_message = error_message
        if status in [models.SyncStatus.completed, models.SyncStatus.failed, models.SyncStatus.partial]:
            job.completed_at = datetime.utcnow()
        db.commit()

def create_sync_log(
    db: Session,
    user_id: str,
    store_connection_id: str,
    sync_job_id: str,
    direction: models.SyncDirection,
    entity_type: models.SyncEntityType,
    status: models.SyncStatus,
    total_items: int,
    successful_items: int,
    failed_items: int,
    error_message: Optional[str] = None,
    duration_seconds: Optional[int] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> models.SyncLog:
    """
    Create a sync log entry
    """
    log = models.SyncLog(
        id=str(uuid.uuid4()),
        user_id=user_id,
        store_connection_id=store_connection_id,
        sync_job_id=sync_job_id,
        direction=direction,
        entity_type=entity_type,
        status=status,
        total_items=total_items,
        successful_items=successful_items,
        failed_items=failed_items,
        error_message=error_message,
        duration_seconds=duration_seconds,
        metadata=metadata
    )
    
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return log

def get_sync_logs(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    connection_id: Optional[str] = None,
    entity_type: Optional[str] = None,
    status: Optional[str] = None
) -> List[models.SyncLog]:
    """
    Get sync logs for a user
    """
    query = db.query(models.SyncLog).filter(models.SyncLog.user_id == user_id)
    
    if connection_id:
        query = query.filter(models.SyncLog.store_connection_id == connection_id)
    
    if entity_type:
        query = query.filter(models.SyncLog.entity_type == entity_type)
    
    if status:
        query = query.filter(models.SyncLog.status == status)
    
    query = query.order_by(models.SyncLog.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_sync_schedules(db: Session, user_id: str, connection_id: Optional[str] = None) -> List[models.SyncSchedule]:
    """
    Get sync schedules for a user
    """
    query = db.query(models.SyncSchedule).filter(models.SyncSchedule.user_id == user_id)
    
    if connection_id:
        query = query.filter(models.SyncSchedule.store_connection_id == connection_id)
    
    return query.all()

def get_sync_schedule(db: Session, schedule_id: str, user_id: str) -> Optional[models.SyncSchedule]:
    """
    Get a sync schedule by ID
    """
    return db.query(models.SyncSchedule).filter(
        models.SyncSchedule.id == schedule_id,
        models.SyncSchedule.user_id == user_id
    ).first()

def create_sync_schedule(db: Session, schedule: schemas.SyncScheduleCreate, user_id: str) -> models.SyncSchedule:
    """
    Create a new sync schedule
    """
    # Calculate next run time
    next_run = calculate_next_run(schedule.frequency)
    
    db_schedule = models.SyncSchedule(
        id=str(uuid.uuid4()),
        user_id=user_id,
        store_connection_id=schedule.store_connection_id,
        name=schedule.name,
        direction=schedule.direction,
        entity_type=schedule.entity_type,
        frequency=schedule.frequency,
        is_active=schedule.is_active,
        settings=schedule.settings,
        next_run_at=next_run
    )
    
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def update_sync_schedule(db: Session, schedule_id: str, schedule: schemas.SyncScheduleUpdate) -> models.SyncSchedule:
    """
    Update a sync schedule
    """
    db_schedule = db.query(models.SyncSchedule).filter(models.SyncSchedule.id == schedule_id).first()
    if not db_schedule:
        raise ValueError(f"Sync schedule not found: {schedule_id}")
    
    # Update fields if provided
    if schedule.name is not None:
        db_schedule.name = schedule.name
    
    if schedule.store_connection_id is not None:
        db_schedule.store_connection_id = schedule.store_connection_id
    
    if schedule.direction is not None:
        db_schedule.direction = schedule.direction
    
    if schedule.entity_type is not None:
        db_schedule.entity_type = schedule.entity_type
    
    if schedule.frequency is not None:
        db_schedule.frequency = schedule.frequency
        # Recalculate next run time if frequency changed
        db_schedule.next_run_at = calculate_next_run(schedule.frequency)
    
    if schedule.is_active is not None:
        db_schedule.is_active = schedule.is_active
    
    if schedule.settings is not None:
        db_schedule.settings = schedule.settings
    
    db_schedule.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def delete_sync_schedule(db: Session, schedule_id: str) -> None:
    """
    Delete a sync schedule
    """
    db_schedule = db.query(models.SyncSchedule).filter(models.SyncSchedule.id == schedule_id).first()
    if db_schedule:
        db.delete(db_schedule)
        db.commit()

def calculate_next_run(frequency: models.SyncFrequency) -> datetime:
    """
    Calculate the next run time based on frequency
    """
    now = datetime.utcnow()
    
    if frequency == models.SyncFrequency.hourly:
        # Next hour
        return now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    
    elif frequency == models.SyncFrequency.daily:
        # Next day at midnight UTC
        return (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    
    elif frequency == models.SyncFrequency.weekly:
        # Next Monday at midnight UTC
        days_ahead = 0 - now.weekday()
        if days_ahead <= 0:  # Target day already happened this week
            days_ahead += 7
        return (now + timedelta(days=days_ahead)).replace(hour=0, minute=0, second=0, microsecond=0)
    
    else:  # manual
        # No automatic next run
        return None

def get_sync_conflicts(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    connection_id: Optional[str] = None,
    entity_type: Optional[str] = None,
    resolved: Optional[bool] = None
) -> List[models.SyncConflict]:
    """
    Get sync conflicts for a user
    """
    query = db.query(models.SyncConflict).filter(models.SyncConflict.user_id == user_id)
    
    if connection_id:
        query = query.filter(models.SyncConflict.store_connection_id == connection_id)
    
    if entity_type:
        query = query.filter(models.SyncConflict.entity_type == entity_type)
    
    if resolved is not None:
        if resolved:
            query = query.filter(models.SyncConflict.resolved_at.isnot(None))
        else:
            query = query.filter(models.SyncConflict.resolved_at.is_(None))
    
    query = query.order_by(models.SyncConflict.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_sync_conflict(db: Session, conflict_id: str, user_id: str) -> Optional[models.SyncConflict]:
    """
    Get a sync conflict by ID
    """
    return db.query(models.SyncConflict).filter(
        models.SyncConflict.id == conflict_id,
        models.SyncConflict.user_id == user_id
    ).first()

def resolve_sync_conflict(db: Session, conflict_id: str, resolution: str) -> models.SyncConflict:
    """
    Resolve a sync conflict
    """
    conflict = db.query(models.SyncConflict).filter(models.SyncConflict.id == conflict_id).first()
    if not conflict:
        raise ValueError(f"Sync conflict not found: {conflict_id}")
    
    # Update conflict
    conflict.resolution = resolution
    conflict.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(conflict)
    
    # Apply resolution
    if resolution != "skip":
        apply_conflict_resolution(db, conflict)
    
    return conflict

def apply_conflict_resolution(db: Session, conflict: models.SyncConflict) -> None:
    """
    Apply a conflict resolution
    """
    # This would implement the logic to apply the resolution
    # For example, updating the product in DropFlow or in the external platform
    # For brevity, we'll just log the action
    logger.info(f"Applying conflict resolution: {conflict.resolution} for conflict {conflict.id}")

def process_platform_webhook(db: Session, platform: str, payload: Dict[str, Any]) -> None:
    """
    Process a webhook from an external platform
    """
    logger.info(f"Processing {platform} webhook: {json.dumps(payload)[:100]}...")
    
    try:
        # Handle based on platform
        if platform == "shopify":
            process_shopify_webhook(db, payload)
        elif platform == "woocommerce":
            process_woocommerce_webhook(db, payload)
        # Add other platforms as needed
        else:
            logger.warning(f"Unsupported platform for webhook: {platform}")
    
    except Exception as e:
        logger.error(f"Error processing {platform} webhook: {e}")

def process_shopify_webhook(db: Session, payload: Dict[str, Any]) -> None:
    """
    Process a Shopify webhook
    """
    # Extract topic from headers or payload
    topic = payload.get("topic", "")
    
    if "product" in topic:
        # Product webhook
        process_shopify_product_webhook(db, payload)
    elif "order" in topic:
        # Order webhook
        process_shopify_order_webhook(db, payload)
    elif "customer" in topic:
        # Customer webhook
        process_shopify_customer_webhook(db, payload)
    elif "inventory" in topic:
        # Inventory webhook
        process_shopify_inventory_webhook(db, payload)
    else:
        logger.warning(f"Unsupported Shopify webhook topic: {topic}")

def process_shopify_product_webhook(db: Session, payload: Dict[str, Any]) -> None:
    """
    Process a Shopify product webhook
    """
    # Extract product data
    product_data = payload.get("product", {})
    if not product_data:
        logger.warning("No product data in Shopify webhook")
        return
    
    # Find the store connection
    shop_domain = payload.get("shop_domain", "")
    if not shop_domain:
        logger.warning("No shop domain in Shopify webhook")
        return
    
    connection = db.query(models.StoreConnection).filter(
        models.StoreConnection.platform == models.PlatformType.shopify,
        models.StoreConnection.store_url.like(f"%{shop_domain}%")
    ).first()
    
    if not connection:
        logger.warning(f"No store connection found for Shopify domain: {shop_domain}")
        return
    
    # Find if we have this product in our system
    external_id = str(product_data.get("id", ""))
    product = db.query(Product).filter(
        Product.user_id == connection.user_id,
        Product.external_id == external_id,
        Product.source == "shopify"
    ).first()
    
    # Handle based on webhook action
    action = payload.get("action", "")
    
    if action == "create" or action == "update":
        if product:
            # Update existing product
            logger.info(f"Updating product {product.id} from Shopify webhook")
            # In a real implementation, update the product
        else:
            # Create new product
            logger.info(f"Creating product from Shopify webhook")
            # In a real implementation, create the product
    
    elif action == "delete":
        if product:
            # Delete product
            logger.info(f"Deleting product {product.id} from Shopify webhook")
            # In a real implementation, delete or mark as deleted
    
    else:
        logger.warning(f"Unsupported Shopify webhook action: {action}")

def process_shopify_order_webhook(db: Session, payload: Dict[str, Any]) -> None:
    """
    Process a Shopify order webhook
    """
    # Similar implementation to product webhook
    logger.info("Processing Shopify order webhook")

def process_shopify_customer_webhook(db: Session, payload: Dict[str, Any]) -> None:
    """
    Process a Shopify customer webhook
    """
    # Similar implementation to product webhook
    logger.info("Processing Shopify customer webhook")

def process_shopify_inventory_webhook(db: Session, payload: Dict[str, Any]) -> None:
    """
    Process a Shopify inventory webhook
    """
    # Similar implementation to product webhook
    logger.info("Processing Shopify inventory webhook")

def process_woocommerce_webhook(db: Session, payload: Dict[str, Any]) -> None:
    """
    Process a WooCommerce webhook
    """
    # Similar implementation to Shopify webhook
    logger.info("Processing WooCommerce webhook")

# Import/Export functions

def import_products(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Import products from external platform
    """
    try:
        # Get products from platform
        products = client.get_products()
        
        # Update job with total items
        job.total_items = len(products)
        db.commit()
        
        # Process each product
        for product_data in products:
            try:
                # Create sync item
                item = models.SyncItem(
                    id=str(uuid.uuid4()),
                    sync_job_id=job.id,
                    entity_id=str(product_data["id"]),
                    entity_type=models.SyncEntityType.product,
                    status=models.SyncStatus.pending
                )
                db.add(item)
                db.commit()
                
                # Update item status
                item.status = models.SyncStatus.in_progress
                db.commit()
                
                # Check if product already exists
                existing_product = db.query(Product).filter(
                    Product.user_id == job.user_id,
                    Product.external_id == str(product_data["id"]),
                    Product.source == job.store_connection.platform.value
                ).first()
                
                if existing_product:
                    # Update existing product
                    # In a real implementation, update the product
                    logger.info(f"Updating existing product: {existing_product.id}")
                    
                    # Set target ID
                    item.target_id = existing_product.id
                else:
                    # Create new product
                    # In a real implementation, create the product
                    logger.info(f"Creating new product from {job.store_connection.platform.value}")
                    
                    # Set target ID (mock)
                    item.target_id = str(uuid.uuid4())
                
                # Update item status
                item.status = models.SyncStatus.completed
                
                # Update job counters
                job.processed_items += 1
                job.successful_items += 1
                db.commit()
                
            except Exception as e:
                logger.error(f"Error importing product {product_data.get('id')}: {e}")
                
                # Update item status
                if 'item' in locals():
                    item.status = models.SyncStatus.failed
                    item.error_message = str(e)
                    db.commit()
                
                # Update job counters
                job.processed_items += 1
                job.failed_items += 1
                db.commit()
    
    except Exception as e:
        logger.error(f"Error importing products: {e}")
        raise

def import_orders(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Import orders from external platform
    """
    # Similar implementation to import_products
    logger.info(f"Importing orders from {job.store_connection.platform.value}")

def import_customers(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Import customers from external platform
    """
    # Similar implementation to import_products
    logger.info(f"Importing customers from {job.store_connection.platform.value}")

def import_inventory(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Import inventory from external platform
    """
    # Similar implementation to import_products
    logger.info(f"Importing inventory from {job.store_connection.platform.value}")

def import_all(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Import all entities from external platform
    """
    # Import products
    import_products(db, job, client)
    
    # Import orders
    import_orders(db, job, client)
    
    # Import customers
    import_customers(db, job, client)
    
    # Import inventory
    import_inventory(db, job, client)

def export_products(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Export products to external platform
    """
    try:
        # Get products to export
        products = db.query(Product).filter(Product.user_id == job.user_id).all()
        
        # Update job with total items
        job.total_items = len(products)
        db.commit()
        
        # Process each product
        for product in products:
            try:
                # Create sync item
                item = models.SyncItem(
                    id=str(uuid.uuid4()),
                    sync_job_id=job.id,
                    entity_id=product.id,
                    entity_type=models.SyncEntityType.product,
                    status=models.SyncStatus.pending
                )
                db.add(item)
                db.commit()
                
                # Update item status
                item.status = models.SyncStatus.in_progress
                db.commit()
                
                # Check if product already exists in platform
                external_id = None
                if product.external_id and product.source == job.store_connection.platform.value:
                    external_id = product.external_id
                
                if external_id:
                    # Update existing product in platform
                    # In a real implementation, update the product
                    logger.info(f"Updating product in {job.store_connection.platform.value}: {external_id}")
                    
                    # Set target ID
                    item.target_id = external_id
                else:
                    # Create new product in platform
                    # In a real implementation, create the product
                    logger.info(f"Creating product in {job.store_connection.platform.value}")
                    
                    # Set target ID (mock)
                    item.target_id = f"ext_{uuid.uuid4()}"
                
                # Update item status
                item.status = models.SyncStatus.completed
                
                # Update job counters
                job.processed_items += 1
                job.successful_items += 1
                db.commit()
                
            except Exception as e:
                logger.error(f"Error exporting product {product.id}: {e}")
                
                # Update item status
                if 'item' in locals():
                    item.status = models.SyncStatus.failed
                    item.error_message = str(e)
                    db.commit()
                
                # Update job counters
                job.processed_items += 1
                job.failed_items += 1
                db.commit()
    
    except Exception as e:
        logger.error(f"Error exporting products: {e}")
        raise

def export_orders(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Export orders to external platform
    """
    # Similar implementation to export_products
    logger.info(f"Exporting orders to {job.store_connection.platform.value}")

def export_customers(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Export customers to external platform
    """
    # Similar implementation to export_products
    logger.info(f"Exporting customers to {job.store_connection.platform.value}")

def export_inventory(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Export inventory to external platform
    """
    # Similar implementation to export_products
    logger.info(f"Exporting inventory to {job.store_connection.platform.value}")

def export_all(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Export all entities to external platform
    """
    # Export products
    export_products(db, job, client)
    
    # Export orders
    export_orders(db, job, client)
    
    # Export customers
    export_customers(db, job, client)
    
    # Export inventory
    export_inventory(db, job, client)

def sync_products_bidirectional(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Sync products bidirectionally
    """
    # This would implement bidirectional sync logic
    # For brevity, we'll just call both import and export
    import_products(db, job, client)
    export_products(db, job, client)

def sync_orders_bidirectional(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Sync orders bidirectionally
    """
    # Similar implementation to sync_products_bidirectional
    import_orders(db, job, client)
    export_orders(db, job, client)

def sync_customers_bidirectional(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Sync customers bidirectionally
    """
    # Similar implementation to sync_products_bidirectional
    import_customers(db, job, client)
    export_customers(db, job, client)

def sync_inventory_bidirectional(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Sync inventory bidirectionally
    """
    # Similar implementation to sync_products_bidirectional
    import_inventory(db, job, client)
    export_inventory(db, job, client)

def sync_all_bidirectional(db: Session, job: models.SyncJob, client: Any) -> None:
    """
    Sync all entities bidirectionally
    """
    # Sync products
    sync_products_bidirectional(db, job, client)
    
    # Sync orders
    sync_orders_bidirectional(db, job, client)
    
    # Sync customers
    sync_customers_bidirectional(db, job, client)
    
    # Sync inventory
    sync_inventory_bidirectional(db, job, client)