from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.get("/", response_model=List[schemas.TrackingResponse])
async def get_trackings(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    order_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get trackings for the current user
    """
    return services.get_trackings(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        status=status,
        order_id=order_id
    )

@router.post("/", response_model=schemas.TrackingResponse)
async def create_tracking(
    tracking: schemas.TrackingCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new tracking
    """
    db_tracking = services.create_tracking(db, tracking=tracking, user_id=current_user.id)
    
    # Check tracking status in background
    background_tasks.add_task(
        services.check_tracking_status,
        db=db,
        tracking_id=db_tracking.id
    )
    
    return db_tracking

@router.get("/{tracking_id}", response_model=schemas.TrackingDetailResponse)
async def get_tracking(
    tracking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tracking details
    """
    tracking = services.get_tracking(db, tracking_id=tracking_id, user_id=current_user.id)
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    
    return tracking

@router.post("/{tracking_id}/refresh", response_model=schemas.TrackingDetailResponse)
async def refresh_tracking(
    tracking_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Refresh tracking status
    """
    tracking = services.get_tracking(db, tracking_id=tracking_id, user_id=current_user.id)
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    
    # Check tracking status in background
    background_tasks.add_task(
        services.check_tracking_status,
        db=db,
        tracking_id=tracking.id
    )
    
    # Return current tracking data
    return tracking

@router.post("/{tracking_id}/notify", response_model=schemas.TrackingNotificationResponse)
async def send_tracking_notification(
    tracking_id: str,
    notification: schemas.NotificationCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a tracking notification
    """
    tracking = services.get_tracking(db, tracking_id=tracking_id, user_id=current_user.id)
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    
    # Create notification
    db_notification = services.create_tracking_notification(
        db, 
        tracking_id=tracking_id,
        notification_type=notification.type,
        recipient=notification.recipient,
        trigger_event="manual"
    )
    
    # Send notification in background
    background_tasks.add_task(
        services.send_tracking_notification,
        db=db,
        notification_id=db_notification.id
    )
    
    return db_notification

@router.delete("/{tracking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tracking(
    tracking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a tracking
    """
    tracking = services.get_tracking(db, tracking_id=tracking_id, user_id=current_user.id)
    if not tracking:
        raise HTTPException(status_code=404, detail="Tracking not found")
    
    services.delete_tracking(db, tracking_id=tracking_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.get("/number/{tracking_number}", response_model=schemas.TrackingDetailResponse)
async def get_tracking_by_number(
    tracking_number: str,
    carrier: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tracking by tracking number
    """
    tracking = services.get_tracking_by_number(db, tracking_number=tracking_number, user_id=current_user.id)
    if not tracking:
        # If tracking doesn't exist, create it
        tracking_data = schemas.TrackingCreate(
            tracking_number=tracking_number,
            carrier=carrier,
            order_id=None
        )
        tracking = services.create_tracking(db, tracking=tracking_data, user_id=current_user.id)
        
        # Check tracking status
        services.check_tracking_status(db, tracking_id=tracking.id)
    
    return tracking

@router.post("/batch", response_model=List[schemas.TrackingResponse])
async def create_batch_trackings(
    trackings: List[schemas.TrackingCreate],
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create multiple trackings
    """
    db_trackings = []
    
    for tracking_data in trackings:
        db_tracking = services.create_tracking(db, tracking=tracking_data, user_id=current_user.id)
        db_trackings.append(db_tracking)
        
        # Check tracking status in background
        background_tasks.add_task(
            services.check_tracking_status,
            db=db,
            tracking_id=db_tracking.id
        )
    
    return db_trackings

@router.post("/from-csv", response_model=schemas.BatchImportResponse)
async def import_trackings_from_csv(
    file: bytes = Form(...),
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Import trackings from CSV file
    """
    result = services.import_trackings_from_csv(db, file_content=file, user_id=current_user.id)
    
    # Check tracking statuses in background
    for tracking_id in result["tracking_ids"]:
        background_tasks.add_task(
            services.check_tracking_status,
            db=db,
            tracking_id=tracking_id
        )
    
    return result

@router.get("/settings", response_model=schemas.TrackingSettingsResponse)
async def get_tracking_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tracking settings for the current user
    """
    settings = services.get_tracking_settings(db, user_id=current_user.id)
    if not settings:
        # Create default settings if they don't exist
        settings = services.create_tracking_settings(db, user_id=current_user.id)
    
    return settings

@router.put("/settings", response_model=schemas.TrackingSettingsResponse)
async def update_tracking_settings(
    settings: schemas.TrackingSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update tracking settings
    """
    db_settings = services.get_tracking_settings(db, user_id=current_user.id)
    if not db_settings:
        # Create settings if they don't exist
        db_settings = services.create_tracking_settings(db, user_id=current_user.id)
    
    # Update settings
    return services.update_tracking_settings(db, settings_id=db_settings.id, settings=settings)

@router.get("/carriers", response_model=List[schemas.CarrierInfoResponse])
async def get_carriers(
    country: Optional[str] = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Get carrier information
    """
    return services.get_carriers(db, country=country, active_only=active_only)

@router.get("/stats", response_model=schemas.TrackingStatsResponse)
async def get_tracking_stats(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get tracking statistics
    """
    return services.get_tracking_stats(db, user_id=current_user.id, start_date=start_date, end_date=end_date)