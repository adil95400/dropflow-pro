from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, date

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.get("/accounts", response_model=List[schemas.SocialAccountResponse])
async def get_social_accounts(
    platform: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get social accounts for the current user
    """
    return services.get_social_accounts(db, user_id=current_user.id, platform=platform)

@router.post("/accounts", response_model=schemas.SocialAccountResponse)
async def create_social_account(
    account: schemas.SocialAccountCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new social account
    """
    return services.create_social_account(db, account=account, user_id=current_user.id)

@router.get("/accounts/{account_id}", response_model=schemas.SocialAccountResponse)
async def get_social_account(
    account_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a social account by ID
    """
    account = services.get_social_account(db, account_id=account_id, user_id=current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    return account

@router.put("/accounts/{account_id}", response_model=schemas.SocialAccountResponse)
async def update_social_account(
    account_id: str,
    account: schemas.SocialAccountUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a social account
    """
    db_account = services.get_social_account(db, account_id=account_id, user_id=current_user.id)
    if not db_account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    return services.update_social_account(db, account_id=account_id, account=account)

@router.delete("/accounts/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social_account(
    account_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a social account
    """
    db_account = services.get_social_account(db, account_id=account_id, user_id=current_user.id)
    if not db_account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    services.delete_social_account(db, account_id=account_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.post("/accounts/{account_id}/sync", response_model=schemas.SyncResponse)
async def sync_social_account(
    account_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sync a social account
    """
    account = services.get_social_account(db, account_id=account_id, user_id=current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    # Start sync in background
    background_tasks.add_task(
        services.sync_social_account,
        db=db,
        account_id=account_id
    )
    
    return {"status": "success", "message": "Sync started"}

@router.get("/posts", response_model=List[schemas.SocialPostResponse])
async def get_social_posts(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    account_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    product_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get social posts for the current user
    """
    return services.get_social_posts(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        account_id=account_id,
        status=status,
        type=type,
        product_id=product_id
    )

@router.post("/posts", response_model=schemas.SocialPostResponse)
async def create_social_post(
    post: schemas.SocialPostCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new social post
    """
    # Verify account exists and belongs to user
    account = services.get_social_account(db, account_id=post.account_id, user_id=current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    # Create post
    db_post = services.create_social_post(db, post=post, user_id=current_user.id)
    
    # If post is scheduled for immediate publishing, publish it
    if post.status == schemas.PostStatus.published:
        background_tasks.add_task(
            services.publish_social_post,
            db=db,
            post_id=db_post.id
        )
    
    return db_post

@router.post("/posts/media", response_model=schemas.MediaUploadResponse)
async def upload_post_media(
    file: UploadFile = File(...),
    account_id: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload media for a social post
    """
    # Verify account exists and belongs to user
    account = services.get_social_account(db, account_id=account_id, user_id=current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    # Upload media
    media_url = await services.upload_post_media(file, account.platform)
    
    return {"media_url": media_url}

@router.get("/posts/{post_id}", response_model=schemas.SocialPostDetailResponse)
async def get_social_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a social post by ID
    """
    post = services.get_social_post(db, post_id=post_id, user_id=current_user.id)
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")
    
    return post

@router.put("/posts/{post_id}", response_model=schemas.SocialPostResponse)
async def update_social_post(
    post_id: str,
    post: schemas.SocialPostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a social post
    """
    db_post = services.get_social_post(db, post_id=post_id, user_id=current_user.id)
    if not db_post:
        raise HTTPException(status_code=404, detail="Social post not found")
    
    # Prevent updates to published posts
    if db_post.status == "published" and db_post.published_at:
        raise HTTPException(status_code=400, detail="Cannot update a published post")
    
    return services.update_social_post(db, post_id=post_id, post=post)

@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a social post
    """
    db_post = services.get_social_post(db, post_id=post_id, user_id=current_user.id)
    if not db_post:
        raise HTTPException(status_code=404, detail="Social post not found")
    
    # Prevent deletion of published posts on some platforms
    if db_post.status == "published" and db_post.published_at:
        # Check if the platform allows deletion
        if db_post.account.platform in ["facebook", "instagram", "twitter"]:
            # These platforms allow deletion of published posts
            # Delete from platform first
            try:
                services.delete_post_from_platform(db_post)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to delete post from platform: {str(e)}")
    
    services.delete_social_post(db, post_id=post_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.post("/posts/{post_id}/publish", response_model=schemas.SocialPostResponse)
async def publish_social_post(
    post_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Publish a social post
    """
    post = services.get_social_post(db, post_id=post_id, user_id=current_user.id)
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")
    
    if post.status == "published":
        raise HTTPException(status_code=400, detail="Post is already published")
    
    # Update post status
    post = services.update_social_post(
        db, 
        post_id=post_id, 
        post=schemas.SocialPostUpdate(status=schemas.PostStatus.published)
    )
    
    # Publish in background
    background_tasks.add_task(
        services.publish_social_post,
        db=db,
        post_id=post_id
    )
    
    return post

@router.post("/posts/{post_id}/schedule", response_model=schemas.SocialPostResponse)
async def schedule_social_post(
    post_id: str,
    schedule: schemas.PostSchedule,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Schedule a social post
    """
    post = services.get_social_post(db, post_id=post_id, user_id=current_user.id)
    if not post:
        raise HTTPException(status_code=404, detail="Social post not found")
    
    if post.status == "published":
        raise HTTPException(status_code=400, detail="Post is already published")
    
    # Update post with schedule
    return services.schedule_social_post(db, post_id=post_id, scheduled_for=schedule.scheduled_for)

@router.get("/templates", response_model=List[schemas.SocialTemplateResponse])
async def get_social_templates(
    platform: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get social templates for the current user
    """
    return services.get_social_templates(
        db, 
        user_id=current_user.id,
        platform=platform,
        type=type
    )

@router.post("/templates", response_model=schemas.SocialTemplateResponse)
async def create_social_template(
    template: schemas.SocialTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new social template
    """
    return services.create_social_template(db, template=template, user_id=current_user.id)

@router.get("/templates/{template_id}", response_model=schemas.SocialTemplateResponse)
async def get_social_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a social template by ID
    """
    template = services.get_social_template(db, template_id=template_id, user_id=current_user.id)
    if not template:
        raise HTTPException(status_code=404, detail="Social template not found")
    
    return template

@router.put("/templates/{template_id}", response_model=schemas.SocialTemplateResponse)
async def update_social_template(
    template_id: str,
    template: schemas.SocialTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a social template
    """
    db_template = services.get_social_template(db, template_id=template_id, user_id=current_user.id)
    if not db_template:
        raise HTTPException(status_code=404, detail="Social template not found")
    
    return services.update_social_template(db, template_id=template_id, template=template)

@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social_template(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a social template
    """
    db_template = services.get_social_template(db, template_id=template_id, user_id=current_user.id)
    if not db_template:
        raise HTTPException(status_code=404, detail="Social template not found")
    
    services.delete_social_template(db, template_id=template_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.get("/schedules", response_model=List[schemas.SocialScheduleResponse])
async def get_social_schedules(
    account_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get social schedules for the current user
    """
    return services.get_social_schedules(db, user_id=current_user.id, account_id=account_id)

@router.post("/schedules", response_model=schemas.SocialScheduleResponse)
async def create_social_schedule(
    schedule: schemas.SocialScheduleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new social schedule
    """
    # Verify account exists and belongs to user
    account = services.get_social_account(db, account_id=schedule.account_id, user_id=current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    # Verify template exists and belongs to user if provided
    if schedule.template_id:
        template = services.get_social_template(db, template_id=schedule.template_id, user_id=current_user.id)
        if not template:
            raise HTTPException(status_code=404, detail="Social template not found")
    
    return services.create_social_schedule(db, schedule=schedule, user_id=current_user.id)

@router.get("/schedules/{schedule_id}", response_model=schemas.SocialScheduleResponse)
async def get_social_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a social schedule by ID
    """
    schedule = services.get_social_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Social schedule not found")
    
    return schedule

@router.put("/schedules/{schedule_id}", response_model=schemas.SocialScheduleResponse)
async def update_social_schedule(
    schedule_id: str,
    schedule: schemas.SocialScheduleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a social schedule
    """
    db_schedule = services.get_social_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Social schedule not found")
    
    # Verify account exists and belongs to user if provided
    if schedule.account_id:
        account = services.get_social_account(db, account_id=schedule.account_id, user_id=current_user.id)
        if not account:
            raise HTTPException(status_code=404, detail="Social account not found")
    
    # Verify template exists and belongs to user if provided
    if schedule.template_id:
        template = services.get_social_template(db, template_id=schedule.template_id, user_id=current_user.id)
        if not template:
            raise HTTPException(status_code=404, detail="Social template not found")
    
    return services.update_social_schedule(db, schedule_id=schedule_id, schedule=schedule)

@router.delete("/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_social_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a social schedule
    """
    db_schedule = services.get_social_schedule(db, schedule_id=schedule_id, user_id=current_user.id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Social schedule not found")
    
    services.delete_social_schedule(db, schedule_id=schedule_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.get("/analytics", response_model=schemas.SocialAnalyticsResponse)
async def get_social_analytics(
    start_date: date = Query(...),
    end_date: date = Query(...),
    account_id: Optional[str] = Query(None),
    platform: Optional[str] = Query(None),
    post_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get social analytics
    """
    return services.get_social_analytics(
        db, 
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        account_id=account_id,
        platform=platform,
        post_id=post_id
    )

@router.post("/generate", response_model=schemas.ContentGenerationResponse)
async def generate_social_content(
    generation: schemas.ContentGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate social content using AI
    """
    # If product_id is provided, verify it exists and belongs to user
    if generation.product_id:
        product = db.query("Product").filter(
            "Product.id" == generation.product_id,
            "Product.user_id" == current_user.id
        ).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
    
    return services.generate_social_content(db, generation=generation, user_id=current_user.id)

@router.get("/hashtags", response_model=schemas.HashtagSuggestionsResponse)
async def get_hashtag_suggestions(
    query: str = Query(..., min_length=2),
    platform: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get hashtag suggestions
    """
    return services.get_hashtag_suggestions(
        db, 
        query=query,
        platform=platform,
        limit=limit
    )

@router.get("/calendar", response_model=List[schemas.CalendarItemResponse])
async def get_social_calendar(
    start_date: date = Query(...),
    end_date: date = Query(...),
    account_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get social calendar
    """
    return services.get_social_calendar(
        db, 
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        account_id=account_id
    )