from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.get("/connections", response_model=List[schemas.StoreConnectionResponse])
async def get_store_connections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all store connections for the current user
    """
    return services.get_store_connections(db, user_id=current_user.id)

@router.post("/connections", response_model=schemas.StoreConnectionResponse)
async def create_store_connection(
    connection: schemas.StoreConnectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new store connection
    """
    return services.create_store_connection(db, connection=connection, user_id=current_user.id)

@router.get("/connections/{connection_id}", response_model=schemas.StoreConnectionResponse)
async def get_store_connection(
    connection_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a store connection by ID
    """
    connection = services.get_store_connection(db, connection_id=connection_id, user_id=current_user.id)
    if not connection:
        raise HTTPException(status_code=404, detail="Store connection not found")
    
    return connection

@router.put("/connections/{connection_id}", response_model=schemas.StoreConnectionResponse)
async def update_store_connection(
    connection_id: str,
    connection: schemas.StoreConnectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a store connection
    """
    db_connection = services.get_store_connection(db, connection_id=connection_id, user_id=current_user.id)
    if not db_connection:
        raise HTTPException(status_code=404, detail="Store connection not found")
    
    return services.update_store_connection(db, connection_id=connection_id, connection=connection)

@router.delete("/connections/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_store_connection(
    connection_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a store connection
    """
    db_connection = services.get_store_connection(db, connection_id=connection_id, user_id=current_user.id)
    if not db_connection:
        raise HTTPException(status_code=404, detail="Store connection not found")
    
    services.delete_store_connection(db, connection_id=connection_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.post("/connections/{connection_id}/test", response_model=schemas.ConnectionTestResponse)
async def test_store_connection(
    connection_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Test a store connection
    """
    connection = services.get_store_connection(db, connection_id=connection_id, user_id=current_user.id)
    if not connection:
        raise HTTPException(status_code=404, detail="Store connection not found")
    
    result = services.test_store_connection(db, connection=connection)
    return result

@router.post("/jobs", response_model=schemas.SyncJobResponse)
async def create_sync_job(
    job: schemas.SyncJobCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new sync job
    """
    # Verify store connection exists and belongs to user
    connection = services.get_store_connection(db, connection_id=job.store_connection_id, user_id=current_user.id)
    if not connection:
        raise HTTPException(status_code=404, detail="Store connection not found")
    
    # Create sync job
    sync_job = services.create_sync_job(db, job=job, user_id=current_user.id)
    
    # Process sync job in background
    background_tasks.add_task(
        services.process_sync_job,
        db=db,
        job_id=sync_job.id
    )
    
    return sync_job

@router.get("/jobs", response_model=List[schemas.SyncJobResponse])
async def get_sync_jobs(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    connection_id: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sync jobs for the current user
    """
    return services.get_sync_jobs(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        status=status,
        connection_id=connection_id,
        entity_type=entity_type
    )

@router.get("/jobs/{job_id}", response_model=schemas.SyncJobDetailResponse)
async def get_sync_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sync job details
    """
    job = services.get_sync_job(db, job_id=job_id, user_id=current_user.id)
    if not job:
        raise HTTPException(status_code=404, detail="Sync job not found")
    
    return job

@router.post("/jobs/{job_id}/cancel", response_model=schemas.SyncJobResponse)
async def cancel_sync_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a sync job
    """
    job = services.get_sync_job(db, job_id=job_id, user_id=current_user.id)
    if not job:
        raise HTTPException(status_code=404, detail="Sync job not found")
    
    if job.status not in ["pending", "in_progress"]:
        raise HTTPException(status_code=400, detail="Only pending or in-progress jobs can be canceled")
    
    return services.cancel_sync_job(db, job_id=job_id)

@router.get("/logs", response_model=List[schemas.SyncLogResponse])
async def get_sync_logs(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    connection_id: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sync logs for the current user
    """
    return services.get_sync_logs(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        connection_id=connection_id,
        entity_type=entity_type,
        status=status
    )

@router.get("/schedules", response_model=List[schemas.SyncScheduleResponse])
async def get_sync_schedules(
    connection_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sync schedules for the current user
    """
    return services.get_sync_schedules(db, user_id=current_user.id, connection_id=connection_id)

@router.post("/schedules", response_model=schemas.SyncScheduleResponse)
async def create_sync_schedule(
    schedule: schemas.SyncScheduleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new sync schedule
    """
    # Verify store connection exists and belongs to user
    connection = services.get_store_connection(db, connection_id=schedule.store_connection_id, user_id=current_user.id)
    if not connection:
        raise HTTPException(status_code=404, detail="Store connection not found")
    
    return services.create_sync_schedule(db, schedule=schedule, user_id=current_user.id)

@router.put("/schedules/{schedule_id}", response_model=schemas.SyncScheduleResponse)
async def update_sync_schedule(
    schedule_id: str,
    schedule: schemas.SyncScheduleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a sync schedule
    """
    db_schedule = services.get_sync_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Sync schedule not found")
    
    # If store connection ID is being updated, verify it exists and belongs to user
    if schedule.store_connection_id:
        connection = services.get_store_connection(
            db, 
            connection_id=schedule.store_connection_id, 
            user_id=current_user.id
        )
        if not connection:
            raise HTTPException(status_code=404, detail="Store connection not found")
    
    return services.update_sync_schedule(db, schedule_id=schedule_id, schedule=schedule)

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sync_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a sync schedule
    """
    db_schedule = services.get_sync_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Sync schedule not found")
    
    services.delete_sync_schedule(db, schedule_id=schedule_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.get("/conflicts", response_model=List[schemas.SyncConflictResponse])
async def get_sync_conflicts(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    connection_id: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    resolved: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sync conflicts for the current user
    """
    return services.get_sync_conflicts(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        connection_id=connection_id,
        entity_type=entity_type,
        resolved=resolved
    )

@router.post("/conflicts/{conflict_id}/resolve", response_model=schemas.SyncConflictResponse)
async def resolve_sync_conflict(
    conflict_id: str,
    resolution: schemas.ConflictResolution,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Resolve a sync conflict
    """
    conflict = services.get_sync_conflict(db, conflict_id=conflict_id, user_id=current_user.id)
    if not conflict:
        raise HTTPException(status_code=404, detail="Sync conflict not found")
    
    return services.resolve_sync_conflict(db, conflict_id=conflict_id, resolution=resolution.resolution)

@router.post("/webhooks/{platform}", status_code=status.HTTP_200_OK)
async def handle_platform_webhook(
    platform: str,
    background_tasks: BackgroundTasks,
    payload: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """
    Handle webhooks from external platforms
    """
    # Process webhook in background
    background_tasks.add_task(
        services.process_platform_webhook,
        db=db,
        platform=platform,
        payload=payload
    )
    
    return {"status": "success", "message": "Webhook received"}