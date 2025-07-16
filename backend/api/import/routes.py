from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, BackgroundTasks, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.post("/url", response_model=schemas.ImportBatchResponse)
async def import_from_url(
    import_data: schemas.ImportUrlRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Import product from URL
    """
    batch = services.create_import_batch(
        db, 
        user_id=current_user.id,
        source=import_data.source,
        urls=[import_data.url],
        options=import_data.options
    )
    
    # Process import in background
    background_tasks.add_task(
        services.process_url_import,
        db=db,
        batch_id=batch.id,
        user_id=current_user.id
    )
    
    return batch

@router.post("/bulk", response_model=schemas.ImportBatchResponse)
async def import_bulk(
    import_data: schemas.ImportBulkRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Import multiple products from URLs
    """
    batch = services.create_import_batch(
        db, 
        user_id=current_user.id,
        source=import_data.source,
        urls=import_data.urls,
        options=import_data.options
    )
    
    # Process import in background
    background_tasks.add_task(
        services.process_bulk_import,
        db=db,
        batch_id=batch.id,
        user_id=current_user.id
    )
    
    return batch

@router.post("/file", response_model=schemas.ImportBatchResponse)
async def import_from_file(
    file: UploadFile = File(...),
    source: str = Form(...),
    options: str = Form("{}"),
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Import products from file (CSV, XML, JSON)
    """
    # Parse options
    try:
        options_dict = json.loads(options)
    except json.JSONDecodeError:
        options_dict = {}
    
    # Read file content
    file_content = await file.read()
    
    batch = services.create_file_import_batch(
        db, 
        user_id=current_user.id,
        source=source,
        file_content=file_content,
        file_name=file.filename,
        options=options_dict
    )
    
    # Process import in background
    background_tasks.add_task(
        services.process_file_import,
        db=db,
        batch_id=batch.id,
        user_id=current_user.id
    )
    
    return batch

@router.post("/image", response_model=schemas.ImportBatchResponse)
async def import_from_image(
    image: UploadFile = File(...),
    options: str = Form("{}"),
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Import product from image (using AI vision)
    """
    # Parse options
    try:
        options_dict = json.loads(options)
    except json.JSONDecodeError:
        options_dict = {}
    
    # Read image content
    image_content = await image.read()
    
    batch = services.create_image_import_batch(
        db, 
        user_id=current_user.id,
        image_content=image_content,
        image_name=image.filename,
        options=options_dict
    )
    
    # Process import in background
    background_tasks.add_task(
        services.process_image_import,
        db=db,
        batch_id=batch.id,
        user_id=current_user.id
    )
    
    return batch

@router.get("/batches", response_model=List[schemas.ImportBatchResponse])
async def get_import_batches(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get import batches for the current user
    """
    return services.get_import_batches(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        status=status,
        source=source
    )

@router.get("/batches/{batch_id}", response_model=schemas.ImportBatchDetailResponse)
async def get_import_batch(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get import batch details
    """
    batch = services.get_import_batch(db, batch_id=batch_id, user_id=current_user.id)
    if not batch:
        raise HTTPException(status_code=404, detail="Import batch not found")
    
    return batch

@router.post("/batches/{batch_id}/retry", response_model=schemas.ImportBatchResponse)
async def retry_import_batch(
    batch_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retry a failed import batch
    """
    batch = services.get_import_batch(db, batch_id=batch_id, user_id=current_user.id)
    if not batch:
        raise HTTPException(status_code=404, detail="Import batch not found")
    
    if batch.status not in ["failed", "partial"]:
        raise HTTPException(status_code=400, detail="Only failed or partial batches can be retried")
    
    # Reset batch status
    updated_batch = services.reset_import_batch(db, batch_id=batch_id)
    
    # Process import in background based on source
    if batch.source in ["url", "aliexpress", "bigbuy", "eprolo", "printify", "spocket"]:
        background_tasks.add_task(
            services.process_url_import,
            db=db,
            batch_id=batch.id,
            user_id=current_user.id
        )
    elif batch.source in ["csv", "xml", "json"]:
        background_tasks.add_task(
            services.process_file_import,
            db=db,
            batch_id=batch.id,
            user_id=current_user.id
        )
    elif batch.source == "image":
        background_tasks.add_task(
            services.process_image_import,
            db=db,
            batch_id=batch.id,
            user_id=current_user.id
        )
    
    return updated_batch

@router.delete("/batches/{batch_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_import_batch(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an import batch
    """
    batch = services.get_import_batch(db, batch_id=batch_id, user_id=current_user.id)
    if not batch:
        raise HTTPException(status_code=404, detail="Import batch not found")
    
    services.delete_import_batch(db, batch_id=batch_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.get("/templates", response_model=List[schemas.ImportTemplateResponse])
async def get_import_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get import templates for the current user
    """
    return services.get_import_templates(db, user_id=current_user.id)

@router.post("/templates", response_model=schemas.ImportTemplateResponse)
async def create_import_template(
    template: schemas.ImportTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new import template
    """
    return services.create_import_template(db, template=template, user_id=current_user.id)

@router.put("/templates/{template_id}", response_model=schemas.ImportTemplateResponse)
async def update_import_template(
    template_id: str,
    template: schemas.ImportTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an import template
    """
    db_template = services.get_import_template(db, template_id=template_id, user_id=current_user.id)
    if not db_template:
        raise HTTPException(status_code=404, detail="Import template not found")
    
    return services.update_import_template(db, template_id=template_id, template=template)

@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_import_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an import template
    """
    db_template = services.get_import_template(db, template_id=template_id, user_id=current_user.id)
    if not db_template:
        raise HTTPException(status_code=404, detail="Import template not found")
    
    services.delete_import_template(db, template_id=template_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.get("/schedules", response_model=List[schemas.ImportScheduleResponse])
async def get_import_schedules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get import schedules for the current user
    """
    return services.get_import_schedules(db, user_id=current_user.id)

@router.post("/schedules", response_model=schemas.ImportScheduleResponse)
async def create_import_schedule(
    schedule: schemas.ImportScheduleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new import schedule
    """
    return services.create_import_schedule(db, schedule=schedule, user_id=current_user.id)

@router.put("/schedules/{schedule_id}", response_model=schemas.ImportScheduleResponse)
async def update_import_schedule(
    schedule_id: str,
    schedule: schemas.ImportScheduleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an import schedule
    """
    db_schedule = services.get_import_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Import schedule not found")
    
    return services.update_import_schedule(db, schedule_id=schedule_id, schedule=schedule)

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_import_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an import schedule
    """
    db_schedule = services.get_import_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Import schedule not found")
    
    services.delete_import_schedule(db, schedule_id=schedule_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})