from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import List, Optional, Dict, Any, BinaryIO
from datetime import datetime, timedelta, date
import uuid
import logging
import json
import random
import io
import os
from fastapi import UploadFile

from . import models, schemas
from ..products.models import Product
from ...clients.facebook import FacebookClient
from ...clients.instagram import InstagramClient
from ...clients.tiktok import TikTokClient
from ...clients.twitter import TwitterClient
from ...clients.pinterest import PinterestClient
from ...clients.youtube import YouTubeClient
from ...clients.linkedin import LinkedInClient
from ...clients.snapchat import SnapchatClient
from ...clients.openai import OpenAIClient

logger = logging.getLogger(__name__)

# Initialize clients
facebook_client = FacebookClient()
instagram_client = InstagramClient()
tiktok_client = TikTokClient()
twitter_client = TwitterClient()
pinterest_client = PinterestClient()
youtube_client = YouTubeClient()
linkedin_client = LinkedInClient()
snapchat_client = SnapchatClient()
openai_client = OpenAIClient()

def get_social_accounts(db: Session, user_id: str, platform: Optional[str] = None) -> List[models.SocialAccount]:
    """
    Get social accounts for a user
    """
    query = db.query(models.SocialAccount).filter(models.SocialAccount.user_id == user_id)
    
    if platform:
        query = query.filter(models.SocialAccount.platform == platform)
    
    return query.all()

def get_social_account(db: Session, account_id: str, user_id: str) -> Optional[models.SocialAccount]:
    """
    Get a social account by ID
    """
    return db.query(models.SocialAccount).filter(
        models.SocialAccount.id == account_id,
        models.SocialAccount.user_id == user_id
    ).first()

def create_social_account(db: Session, account: schemas.SocialAccountCreate, user_id: str) -> models.SocialAccount:
    """
    Create a new social account
    """
    db_account = models.SocialAccount(
        id=str(uuid.uuid4()),
        user_id=user_id,
        platform=account.platform,
        account_name=account.account_name,
        account_id=account.account_id,
        access_token=account.access_token,
        refresh_token=account.refresh_token,
        token_expires_at=account.token_expires_at,
        is_active=account.is_active,
        profile_url=str(account.profile_url) if account.profile_url else None,
        profile_image=account.profile_image,
        followers_count=account.followers_count,
        following_count=account.following_count,
        posts_count=account.posts_count,
        metadata=account.metadata
    )
    
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    
    return db_account

def update_social_account(db: Session, account_id: str, account: schemas.SocialAccountUpdate) -> models.SocialAccount:
    """
    Update a social account
    """
    db_account = db.query(models.SocialAccount).filter(models.SocialAccount.id == account_id).first()
    if not db_account:
        raise ValueError(f"Social account not found: {account_id}")
    
    # Update fields if provided
    if account.account_name is not None:
        db_account.account_name = account.account_name
    
    if account.account_id is not None:
        db_account.account_id = account.account_id
    
    if account.access_token is not None:
        db_account.access_token = account.access_token
    
    if account.refresh_token is not None:
        db_account.refresh_token = account.refresh_token
    
    if account.token_expires_at is not None:
        db_account.token_expires_at = account.token_expires_at
    
    if account.is_active is not None:
        db_account.is_active = account.is_active
    
    if account.profile_url is not None:
        db_account.profile_url = str(account.profile_url)
    
    if account.profile_image is not None:
        db_account.profile_image = account.profile_image
    
    if account.followers_count is not None:
        db_account.followers_count = account.followers_count
    
    if account.following_count is not None:
        db_account.following_count = account.following_count
    
    if account.posts_count is not None:
        db_account.posts_count = account.posts_count
    
    if account.metadata is not None:
        db_account.metadata = account.metadata
    
    db_account.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_account)
    
    return db_account

def delete_social_account(db: Session, account_id: str) -> None:
    """
    Delete a social account
    """
    db_account = db.query(models.SocialAccount).filter(models.SocialAccount.id == account_id).first()
    if db_account:
        db.delete(db_account)
        db.commit()

def sync_social_account(db: Session, account_id: str) -> None:
    """
    Sync a social account
    """
    account = db.query(models.SocialAccount).filter(models.SocialAccount.id == account_id).first()
    if not account:
        logger.error(f"Social account not found: {account_id}")
        return
    
    try:
        # Get platform client
        client = get_platform_client(account)
        
        # Get account info
        account_info = client.get_account_info()
        
        # Update account with new info
        account.account_name = account_info.get("name", account.account_name)
        account.account_id = account_info.get("id", account.account_id)
        account.profile_url = account_info.get("profile_url", account.profile_url)
        account.profile_image = account_info.get("profile_image", account.profile_image)
        account.followers_count = account_info.get("followers_count", account.followers_count)
        account.following_count = account_info.get("following_count", account.following_count)
        account.posts_count = account_info.get("posts_count", account.posts_count)
        
        # Update metadata
        if account.metadata is None:
            account.metadata = {}
        
        account.metadata.update({
            "last_sync_info": account_info,
            "last_sync_time": datetime.utcnow().isoformat()
        })
        
        # Update last sync time
        account.last_sync_at = datetime.utcnow()
        
        db.commit()
        
        # Sync posts
        sync_account_posts(db, account, client)
        
    except Exception as e:
        logger.error(f"Error syncing social account {account_id}: {e}")
        
        # Update metadata with error
        if account.metadata is None:
            account.metadata = {}
        
        account.metadata.update({
            "last_sync_error": str(e),
            "last_sync_time": datetime.utcnow().isoformat()
        })
        
        db.commit()

def sync_account_posts(db: Session, account: models.SocialAccount, client: Any) -> None:
    """
    Sync posts for a social account
    """
    try:
        # Get posts from platform
        posts = client.get_posts()
        
        # Process each post
        for post_data in posts:
            # Check if post already exists
            external_id = post_data.get("id")
            if not external_id:
                continue
            
            existing_post = db.query(models.SocialPost).filter(
                models.SocialPost.account_id == account.id,
                models.SocialPost.external_id == external_id
            ).first()
            
            if existing_post:
                # Update existing post
                existing_post.status = models.PostStatus.published
                existing_post.published_at = post_data.get("published_at")
                existing_post.engagement = post_data.get("engagement")
                existing_post.updated_at = datetime.utcnow()
            else:
                # Create new post
                new_post = models.SocialPost(
                    id=str(uuid.uuid4()),
                    user_id=account.user_id,
                    account_id=account.id,
                    external_id=external_id,
                    type=map_platform_post_type(post_data.get("type"), account.platform),
                    status=models.PostStatus.published,
                    content=post_data.get("content"),
                    media_urls=post_data.get("media_urls"),
                    link=post_data.get("link"),
                    published_at=post_data.get("published_at"),
                    hashtags=post_data.get("hashtags"),
                    mentions=post_data.get("mentions"),
                    engagement=post_data.get("engagement"),
                    metadata=post_data
                )
                
                db.add(new_post)
        
        db.commit()
        
    except Exception as e:
        logger.error(f"Error syncing posts for account {account.id}: {e}")
        raise

def map_platform_post_type(platform_type: str, platform: str) -> models.PostType:
    """
    Map platform-specific post type to our internal type
    """
    # Define mappings for each platform
    mappings = {
        "facebook": {
            "status": models.PostType.text,
            "photo": models.PostType.image,
            "video": models.PostType.video,
            "link": models.PostType.link,
            "album": models.PostType.carousel
        },
        "instagram": {
            "image": models.PostType.image,
            "video": models.PostType.video,
            "carousel": models.PostType.carousel,
            "story": models.PostType.story,
            "reel": models.PostType.reel
        },
        "twitter": {
            "tweet": models.PostType.text,
            "photo": models.PostType.image,
            "video": models.PostType.video,
            "link": models.PostType.link
        }
        # Add mappings for other platforms as needed
    }
    
    # Get mapping for the platform
    platform_mapping = mappings.get(platform)
    if not platform_mapping:
        return models.PostType.text  # Default
    
    # Map the type
    return platform_mapping.get(platform_type, models.PostType.text)

def get_platform_client(account: models.SocialAccount) -> Any:
    """
    Get the appropriate client for a platform
    """
    if account.platform == models.SocialPlatform.facebook:
        return facebook_client.with_token(account.access_token)
    elif account.platform == models.SocialPlatform.instagram:
        return instagram_client.with_token(account.access_token)
    elif account.platform == models.SocialPlatform.tiktok:
        return tiktok_client.with_token(account.access_token)
    elif account.platform == models.SocialPlatform.twitter:
        return twitter_client.with_token(account.access_token, account.refresh_token)
    elif account.platform == models.SocialPlatform.pinterest:
        return pinterest_client.with_token(account.access_token)
    elif account.platform == models.SocialPlatform.youtube:
        return youtube_client.with_token(account.access_token, account.refresh_token)
    elif account.platform == models.SocialPlatform.linkedin:
        return linkedin_client.with_token(account.access_token)
    elif account.platform == models.SocialPlatform.snapchat:
        return snapchat_client.with_token(account.access_token)
    else:
        raise ValueError(f"Unsupported platform: {account.platform}")

def get_social_posts(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    account_id: Optional[str] = None,
    status: Optional[str] = None,
    type: Optional[str] = None,
    product_id: Optional[str] = None
) -> List[models.SocialPost]:
    """
    Get social posts for a user
    """
    query = db.query(models.SocialPost).filter(models.SocialPost.user_id == user_id)
    
    if account_id:
        query = query.filter(models.SocialPost.account_id == account_id)
    
    if status:
        query = query.filter(models.SocialPost.status == status)
    
    if type:
        query = query.filter(models.SocialPost.type == type)
    
    if product_id:
        query = query.filter(models.SocialPost.product_id == product_id)
    
    query = query.order_by(models.SocialPost.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_social_post(db: Session, post_id: str, user_id: str) -> Optional[models.SocialPost]:
    """
    Get a social post by ID
    """
    return db.query(models.SocialPost).filter(
        models.SocialPost.id == post_id,
        models.SocialPost.user_id == user_id
    ).first()

def create_social_post(db: Session, post: schemas.SocialPostCreate, user_id: str) -> models.SocialPost:
    """
    Create a new social post
    """
    db_post = models.SocialPost(
        id=str(uuid.uuid4()),
        user_id=user_id,
        account_id=post.account_id,
        product_id=post.product_id,
        type=post.type,
        status=post.status,
        content=post.content,
        media_urls=post.media_urls,
        link=str(post.link) if post.link else None,
        scheduled_for=post.scheduled_for,
        hashtags=post.hashtags,
        mentions=post.mentions,
        metadata=post.metadata
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    return db_post

async def upload_post_media(file: UploadFile, platform: str) -> str:
    """
    Upload media for a social post
    """
    # In a real implementation, this would upload to a storage service
    # For now, we'll return a mock URL
    
    # Get file extension
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ""
    
    # Generate a unique filename
    filename = f"{uuid.uuid4()}{file_ext}"
    
    # Mock upload
    # In a real implementation, you would upload to S3, Azure, etc.
    
    # Return mock URL
    return f"https://storage.dropflow.pro/social-media/{platform}/{filename}"

def update_social_post(db: Session, post_id: str, post: schemas.SocialPostUpdate) -> models.SocialPost:
    """
    Update a social post
    """
    db_post = db.query(models.SocialPost).filter(models.SocialPost.id == post_id).first()
    if not db_post:
        raise ValueError(f"Social post not found: {post_id}")
    
    # Update fields if provided
    if post.product_id is not None:
        db_post.product_id = post.product_id
    
    if post.type is not None:
        db_post.type = post.type
    
    if post.status is not None:
        db_post.status = post.status
    
    if post.content is not None:
        db_post.content = post.content
    
    if post.media_urls is not None:
        db_post.media_urls = post.media_urls
    
    if post.link is not None:
        db_post.link = str(post.link) if post.link else None
    
    if post.scheduled_for is not None:
        db_post.scheduled_for = post.scheduled_for
    
    if post.hashtags is not None:
        db_post.hashtags = post.hashtags
    
    if post.mentions is not None:
        db_post.mentions = post.mentions
    
    if post.metadata is not None:
        db_post.metadata = post.metadata
    
    db_post.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_post)
    
    return db_post

def delete_social_post(db: Session, post_id: str) -> None:
    """
    Delete a social post
    """
    db_post = db.query(models.SocialPost).filter(models.SocialPost.id == post_id).first()
    if db_post:
        db.delete(db_post)
        db.commit()

def delete_post_from_platform(post: models.SocialPost) -> None:
    """
    Delete a post from the platform
    """
    if not post.external_id:
        return
    
    try:
        # Get platform client
        client = get_platform_client(post.account)
        
        # Delete post
        client.delete_post(post.external_id)
        
    except Exception as e:
        logger.error(f"Error deleting post from platform: {e}")
        raise

def publish_social_post(db: Session, post_id: str) -> None:
    """
    Publish a social post
    """
    post = db.query(models.SocialPost).filter(models.SocialPost.id == post_id).first()
    if not post:
        logger.error(f"Social post not found: {post_id}")
        return
    
    try:
        # Get account
        account = db.query(models.SocialAccount).filter(models.SocialAccount.id == post.account_id).first()
        if not account:
            raise ValueError(f"Social account not found: {post.account_id}")
        
        # Get platform client
        client = get_platform_client(account)
        
        # Prepare post data
        post_data = {
            "content": post.content,
            "media_urls": post.media_urls,
            "link": post.link,
            "hashtags": post.hashtags,
            "mentions": post.mentions,
            "type": post.type
        }
        
        # Publish post
        result = client.publish_post(post_data)
        
        # Update post with external ID and status
        post.external_id = result.get("id")
        post.status = models.PostStatus.published
        post.published_at = datetime.utcnow()
        post.metadata = {
            **(post.metadata or {}),
            "publish_result": result
        }
        
        db.commit()
        
    except Exception as e:
        logger.error(f"Error publishing social post {post_id}: {e}")
        
        # Update post with error
        post.status = models.PostStatus.failed
        post.error_message = str(e)
        post.metadata = {
            **(post.metadata or {}),
            "publish_error": str(e)
        }
        
        db.commit()

def schedule_social_post(db: Session, post_id: str, scheduled_for: datetime) -> models.SocialPost:
    """
    Schedule a social post
    """
    post = db.query(models.SocialPost).filter(models.SocialPost.id == post_id).first()
    if not post:
        raise ValueError(f"Social post not found: {post_id}")
    
    # Update post
    post.status = models.PostStatus.scheduled
    post.scheduled_for = scheduled_for
    post.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(post)
    
    return post

def get_social_templates(
    db: Session, 
    user_id: str, 
    platform: Optional[str] = None,
    type: Optional[str] = None
) -> List[models.SocialTemplate]:
    """
    Get social templates for a user
    """
    query = db.query(models.SocialTemplate).filter(models.SocialTemplate.user_id == user_id)
    
    if platform:
        query = query.filter(models.SocialTemplate.platform == platform)
    
    if type:
        query = query.filter(models.SocialTemplate.type == type)
    
    return query.all()

def get_social_template(db: Session, template_id: str, user_id: str) -> Optional[models.SocialTemplate]:
    """
    Get a social template by ID
    """
    return db.query(models.SocialTemplate).filter(
        models.SocialTemplate.id == template_id,
        models.SocialTemplate.user_id == user_id
    ).first()

def create_social_template(db: Session, template: schemas.SocialTemplateCreate, user_id: str) -> models.SocialTemplate:
    """
    Create a new social template
    """
    # If this is set as default, unset any existing default templates
    if template.is_default:
        existing_defaults = db.query(models.SocialTemplate).filter(
            models.SocialTemplate.user_id == user_id,
            models.SocialTemplate.platform == template.platform,
            models.SocialTemplate.type == template.type,
            models.SocialTemplate.is_default == True
        ).all()
        
        for default_template in existing_defaults:
            default_template.is_default = False
    
    db_template = models.SocialTemplate(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=template.name,
        description=template.description,
        platform=template.platform,
        type=template.type,
        content_template=template.content_template,
        hashtags=template.hashtags,
        media_placeholders=template.media_placeholders,
        is_default=template.is_default,
        metadata=template.metadata
    )
    
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    
    return db_template

def update_social_template(db: Session, template_id: str, template: schemas.SocialTemplateUpdate) -> models.SocialTemplate:
    """
    Update a social template
    """
    db_template = db.query(models.SocialTemplate).filter(models.SocialTemplate.id == template_id).first()
    if not db_template:
        raise ValueError(f"Social template not found: {template_id}")
    
    # Update fields if provided
    if template.name is not None:
        db_template.name = template.name
    
    if template.description is not None:
        db_template.description = template.description
    
    if template.platform is not None:
        db_template.platform = template.platform
    
    if template.type is not None:
        db_template.type = template.type
    
    if template.content_template is not None:
        db_template.content_template = template.content_template
    
    if template.hashtags is not None:
        db_template.hashtags = template.hashtags
    
    if template.media_placeholders is not None:
        db_template.media_placeholders = template.media_placeholders
    
    if template.is_default is not None:
        # If setting as default, unset any existing default templates
        if template.is_default and not db_template.is_default:
            existing_defaults = db.query(models.SocialTemplate).filter(
                models.SocialTemplate.user_id == db_template.user_id,
                models.SocialTemplate.platform == db_template.platform,
                models.SocialTemplate.type == db_template.type,
                models.SocialTemplate.is_default == True,
                models.SocialTemplate.id != template_id
            ).all()
            
            for default_template in existing_defaults:
                default_template.is_default = False
        
        db_template.is_default = template.is_default
    
    if template.metadata is not None:
        db_template.metadata = template.metadata
    
    db_template.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_template)
    
    return db_template

def delete_social_template(db: Session, template_id: str) -> None:
    """
    Delete a social template
    """
    db_template = db.query(models.SocialTemplate).filter(models.SocialTemplate.id == template_id).first()
    if db_template:
        db.delete(db_template)
        db.commit()

def get_social_schedules(db: Session, user_id: str, account_id: Optional[str] = None) -> List[models.SocialSchedule]:
    """
    Get social schedules for a user
    """
    query = db.query(models.SocialSchedule).filter(models.SocialSchedule.user_id == user_id)
    
    if account_id:
        query = query.filter(models.SocialSchedule.account_id == account_id)
    
    return query.all()

def get_social_schedule(db: Session, schedule_id: str, user_id: str) -> Optional[models.SocialSchedule]:
    """
    Get a social schedule by ID
    """
    return db.query(models.SocialSchedule).filter(
        models.SocialSchedule.id == schedule_id,
        models.SocialSchedule.user_id == user_id
    ).first()

def create_social_schedule(db: Session, schedule: schemas.SocialScheduleCreate, user_id: str) -> models.SocialSchedule:
    """
    Create a new social schedule
    """
    # Calculate next run time
    next_run = calculate_next_run(
        frequency=schedule.frequency,
        days_of_week=schedule.days_of_week,
        day_of_month=schedule.day_of_month,
        time_of_day=schedule.time_of_day
    )
    
    db_schedule = models.SocialSchedule(
        id=str(uuid.uuid4()),
        user_id=user_id,
        account_id=schedule.account_id,
        template_id=schedule.template_id,
        name=schedule.name,
        description=schedule.description,
        frequency=schedule.frequency,
        days_of_week=schedule.days_of_week,
        day_of_month=schedule.day_of_month,
        time_of_day=schedule.time_of_day,
        is_active=schedule.is_active,
        settings=schedule.settings,
        next_run_at=next_run
    )
    
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def update_social_schedule(db: Session, schedule_id: str, schedule: schemas.SocialScheduleUpdate) -> models.SocialSchedule:
    """
    Update a social schedule
    """
    db_schedule = db.query(models.SocialSchedule).filter(models.SocialSchedule.id == schedule_id).first()
    if not db_schedule:
        raise ValueError(f"Social schedule not found: {schedule_id}")
    
    # Update fields if provided
    if schedule.account_id is not None:
        db_schedule.account_id = schedule.account_id
    
    if schedule.template_id is not None:
        db_schedule.template_id = schedule.template_id
    
    if schedule.name is not None:
        db_schedule.name = schedule.name
    
    if schedule.description is not None:
        db_schedule.description = schedule.description
    
    # If any schedule parameters changed, recalculate next run
    schedule_changed = False
    
    if schedule.frequency is not None:
        db_schedule.frequency = schedule.frequency
        schedule_changed = True
    
    if schedule.days_of_week is not None:
        db_schedule.days_of_week = schedule.days_of_week
        schedule_changed = True
    
    if schedule.day_of_month is not None:
        db_schedule.day_of_month = schedule.day_of_month
        schedule_changed = True
    
    if schedule.time_of_day is not None:
        db_schedule.time_of_day = schedule.time_of_day
        schedule_changed = True
    
    if schedule_changed:
        db_schedule.next_run_at = calculate_next_run(
            frequency=db_schedule.frequency,
            days_of_week=db_schedule.days_of_week,
            day_of_month=db_schedule.day_of_month,
            time_of_day=db_schedule.time_of_day
        )
    
    if schedule.is_active is not None:
        db_schedule.is_active = schedule.is_active
    
    if schedule.settings is not None:
        db_schedule.settings = schedule.settings
    
    db_schedule.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_schedule)
    
    return db_schedule

def delete_social_schedule(db: Session, schedule_id: str) -> None:
    """
    Delete a social schedule
    """
    db_schedule = db.query(models.SocialSchedule).filter(models.SocialSchedule.id == schedule_id).first()
    if db_schedule:
        db.delete(db_schedule)
        db.commit()

def calculate_next_run(
    frequency: str,
    time_of_day: str,
    days_of_week: Optional[List[int]] = None,
    day_of_month: Optional[int] = None
) -> datetime:
    """
    Calculate the next run time for a schedule
    """
    now = datetime.utcnow()
    
    # Parse time of day
    hour, minute = map(int, time_of_day.split(':'))
    
    # Start with today at the specified time
    next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    # If that time has already passed today, start from tomorrow
    if next_run <= now:
        next_run += timedelta(days=1)
    
    if frequency == "daily":
        # For daily, we're already good
        pass
    elif frequency == "weekly":
        # For weekly, adjust to the next specified day of week
        if not days_of_week:
            raise ValueError("days_of_week is required for weekly frequency")
        
        # Find the next day of week that is in the list
        days_ahead = 0
        for i in range(7):
            check_date = next_run + timedelta(days=i)
            if check_date.weekday() in days_of_week:
                days_ahead = i
                break
        
        next_run += timedelta(days=days_ahead)
    elif frequency == "monthly":
        # For monthly, adjust to the specified day of month
        if day_of_month is None:
            raise ValueError("day_of_month is required for monthly frequency")
        
        # If the day has already passed this month, go to next month
        if next_run.day > day_of_month or (next_run.day == day_of_month and next_run <= now):
            # Go to first day of next month
            if next_run.month == 12:
                next_run = next_run.replace(year=next_run.year + 1, month=1, day=1)
            else:
                next_run = next_run.replace(month=next_run.month + 1, day=1)
        
        # Set to the specified day of month
        try:
            next_run = next_run.replace(day=day_of_month)
        except ValueError:
            # Handle invalid day for month (e.g., February 30)
            # Go to the last day of the month
            if next_run.month == 12:
                next_month = 1
                next_year = next_run.year + 1
            else:
                next_month = next_run.month + 1
                next_year = next_run.year
            
            last_day = (datetime(next_year, next_month, 1) - timedelta(days=1)).day
            next_run = next_run.replace(day=min(day_of_month, last_day))
    
    return next_run

def get_social_analytics(
    db: Session, 
    user_id: str, 
    start_date: date,
    end_date: date,
    account_id: Optional[str] = None,
    platform: Optional[str] = None,
    post_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Get social analytics
    """
    # Convert dates to datetime
    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(end_date, datetime.max.time())
    
    # Build query
    query = db.query(models.SocialAnalytics).filter(
        models.SocialAnalytics.user_id == user_id,
        models.SocialAnalytics.date >= start_datetime,
        models.SocialAnalytics.date <= end_datetime
    )
    
    if account_id:
        query = query.filter(models.SocialAnalytics.account_id == account_id)
    
    if platform:
        query = query.filter(models.SocialAnalytics.platform == platform)
    
    if post_id:
        query = query.filter(models.SocialAnalytics.post_id == post_id)
    
    analytics = query.all()
    
    # If no analytics data, return empty results
    if not analytics:
        return {
            "summary": {
                "impressions": 0,
                "reach": 0,
                "engagement": 0,
                "likes": 0,
                "comments": 0,
                "shares": 0,
                "clicks": 0,
                "saves": 0,
                "followers_gained": 0
            },
            "by_platform": {},
            "by_post": [],
            "by_date": []
        }
    
    # Calculate summary
    summary = {
        "impressions": sum(a.impressions or 0 for a in analytics),
        "reach": sum(a.reach or 0 for a in analytics),
        "engagement": sum(a.engagement or 0 for a in analytics),
        "likes": sum(a.likes or 0 for a in analytics),
        "comments": sum(a.comments or 0 for a in analytics),
        "shares": sum(a.shares or 0 for a in analytics),
        "clicks": sum(a.clicks or 0 for a in analytics),
        "saves": sum(a.saves or 0 for a in analytics),
        "followers_gained": sum(a.followers_gained or 0 for a in analytics)
    }
    
    # Calculate by platform
    by_platform = {}
    for platform_name in set(a.platform for a in analytics):
        platform_analytics = [a for a in analytics if a.platform == platform_name]
        by_platform[platform_name] = {
            "impressions": sum(a.impressions or 0 for a in platform_analytics),
            "reach": sum(a.reach or 0 for a in platform_analytics),
            "engagement": sum(a.engagement or 0 for a in platform_analytics),
            "likes": sum(a.likes or 0 for a in platform_analytics),
            "comments": sum(a.comments or 0 for a in platform_analytics),
            "shares": sum(a.shares or 0 for a in platform_analytics),
            "clicks": sum(a.clicks or 0 for a in platform_analytics),
            "saves": sum(a.saves or 0 for a in platform_analytics),
            "followers_gained": sum(a.followers_gained or 0 for a in platform_analytics)
        }
    
    # Calculate by post if post_id is not specified
    by_post = []
    if not post_id:
        post_ids = set(a.post_id for a in analytics if a.post_id)
        for post_id in post_ids:
            post_analytics = [a for a in analytics if a.post_id == post_id]
            
            # Get post details
            post = db.query(models.SocialPost).filter(models.SocialPost.id == post_id).first()
            
            by_post.append({
                "post_id": post_id,
                "title": post.content[:50] + "..." if post and post.content and len(post.content) > 50 else "N/A",
                "platform": post_analytics[0].platform,
                "date": post.published_at.isoformat() if post and post.published_at else None,
                "impressions": sum(a.impressions or 0 for a in post_analytics),
                "reach": sum(a.reach or 0 for a in post_analytics),
                "engagement": sum(a.engagement or 0 for a in post_analytics),
                "likes": sum(a.likes or 0 for a in post_analytics),
                "comments": sum(a.comments or 0 for a in post_analytics),
                "shares": sum(a.shares or 0 for a in post_analytics)
            })
    
    # Calculate by date
    by_date = []
    date_range = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
    
    for date in date_range:
        date_analytics = [a for a in analytics if a.date.date() == date]
        by_date.append({
            "date": date.isoformat(),
            "impressions": sum(a.impressions or 0 for a in date_analytics),
            "reach": sum(a.reach or 0 for a in date_analytics),
            "engagement": sum(a.engagement or 0 for a in date_analytics),
            "likes": sum(a.likes or 0 for a in date_analytics),
            "comments": sum(a.comments or 0 for a in date_analytics),
            "shares": sum(a.shares or 0 for a in date_analytics),
            "followers_gained": sum(a.followers_gained or 0 for a in date_analytics)
        })
    
    return {
        "summary": summary,
        "by_platform": by_platform,
        "by_post": by_post,
        "by_date": by_date
    }

def generate_social_content(db: Session, generation: schemas.ContentGenerationRequest, user_id: str) -> Dict[str, Any]:
    """
    Generate social content using AI
    """
    # Get product if specified
    product = None
    if generation.product_id:
        product = db.query(Product).filter(
            Product.id == generation.product_id,
            Product.user_id == user_id
        ).first()
    
    # Prepare prompt based on platform and type
    prompt = prepare_content_generation_prompt(generation, product)
    
    # Generate content using OpenAI
    try:
        response = openai_client.generate_completion(prompt)
        
        # Parse response
        variations = parse_content_generation_response(response, generation.platform, generation.type)
        
        return {
            "variations": variations
        }
    except Exception as e:
        logger.error(f"Error generating social content: {e}")
        
        # Return mock variations as fallback
        return {
            "variations": generate_mock_content_variations(generation, product)
        }

def prepare_content_generation_prompt(generation: schemas.ContentGenerationRequest, product: Optional[Product]) -> str:
    """
    Prepare prompt for content generation
    """
    platform_name = generation.platform.value.capitalize()
    content_type = generation.type.value.capitalize()
    
    if product:
        prompt = f"""
        Generate {generation.num_variations} {platform_name} {content_type} posts for the following product:
        
        Product: {product.title}
        Description: {product.description}
        Price: {product.price}
        Category: {product.category}
        
        Tone: {generation.tone}
        """
    else:
        prompt = f"""
        Generate {generation.num_variations} {platform_name} {content_type} posts about:
        
        Topic: {generation.topic or 'dropshipping and e-commerce'}
        
        Tone: {generation.tone}
        """
    
    # Add platform-specific instructions
    if generation.platform == schemas.SocialPlatform.instagram:
        prompt += "\nMake it visually descriptive and engaging with emojis. Include a call to action."
    elif generation.platform == schemas.SocialPlatform.tiktok:
        prompt += "\nMake it trendy, short, and catchy. Include a hook and call to action."
    elif generation.platform == schemas.SocialPlatform.facebook:
        prompt += "\nMake it conversational and include a question to encourage engagement."
    elif generation.platform == schemas.SocialPlatform.twitter:
        prompt += "\nMake it concise and impactful, under 280 characters."
    
    # Add hashtag instructions
    if generation.include_hashtags:
        prompt += f"\nInclude relevant hashtags for {platform_name}."
    
    # Add format instructions
    prompt += """
    
    For each variation, provide:
    1. Content: The main text of the post
    2. Hashtags: A list of relevant hashtags (if requested)
    3. Media description: A description of what image or video would work well
    4. Call to action: What you want the viewer to do
    
    Format the response as JSON.
    """
    
    return prompt

def parse_content_generation_response(response: str, platform: schemas.SocialPlatform, post_type: schemas.PostType) -> List[Dict[str, Any]]:
    """
    Parse content generation response
    """
    try:
        # Try to parse as JSON
        data = json.loads(response)
        
        # If it's already in the expected format, return it
        if isinstance(data, list) and all(isinstance(item, dict) for item in data):
            return data
        
        # If it's a single object, wrap it in a list
        if isinstance(data, dict):
            return [data]
        
    except json.JSONDecodeError:
        # If it's not valid JSON, try to parse the text
        variations = []
        
        # Split by variation
        parts = response.split("Variation")
        
        for part in parts[1:]:  # Skip the first part (before "Variation 1")
            try:
                content_match = re.search(r"Content:(.*?)(?:Hashtags:|Media description:|Call to action:|$)", part, re.DOTALL)
                hashtags_match = re.search(r"Hashtags:(.*?)(?:Media description:|Call to action:|$)", part, re.DOTALL)
                media_match = re.search(r"Media description:(.*?)(?:Call to action:|$)", part, re.DOTALL)
                cta_match = re.search(r"Call to action:(.*?)(?:$)", part, re.DOTALL)
                
                content = content_match.group(1).strip() if content_match else ""
                hashtags = hashtags_match.group(1).strip().split() if hashtags_match else []
                media = media_match.group(1).strip() if media_match else ""
                cta = cta_match.group(1).strip() if cta_match else ""
                
                variations.append({
                    "content": content,
                    "hashtags": hashtags,
                    "media_description": media,
                    "call_to_action": cta
                })
            except:
                # Skip this variation if parsing fails
                continue
        
        if variations:
            return variations
    
    # If all parsing fails, return a generic response
    return [{
        "content": f"Check out our latest products! #ecommerce #{platform.value}",
        "hashtags": ["ecommerce", platform.value, "shopping", "onlineshopping"],
        "media_description": "Product showcase image",
        "call_to_action": "Shop now"
    }]

def generate_mock_content_variations(generation: schemas.ContentGenerationRequest, product: Optional[Product]) -> List[Dict[str, Any]]:
    """
    Generate mock content variations as fallback
    """
    variations = []
    
    for i in range(generation.num_variations):
        if product:
            content = f"Check out our {product.title}! Perfect for anyone looking for {product.category}. Only ${product.price}!"
            hashtags = [f"#{product.category.lower().replace(' ', '')}", "#shopping", "#musthave", f"#{generation.platform.value}"]
            media_description = f"Image of {product.title} from multiple angles"
        else:
            content = f"Looking for the best products for your {generation.topic or 'dropshipping'} store? We've got you covered!"
            hashtags = ["#ecommerce", "#dropshipping", "#onlinestore", f"#{generation.platform.value}"]
            media_description = "Lifestyle image showing products in use"
        
        variations.append({
            "content": content,
            "hashtags": hashtags,
            "media_description": media_description,
            "call_to_action": "Shop now"
        })
    
    return variations

def get_hashtag_suggestions(db: Session, query: str, platform: Optional[str] = None, limit: int = 20) -> Dict[str, Any]:
    """
    Get hashtag suggestions
    """
    # In a real implementation, this would query a hashtag API or database
    # For now, we'll return mock suggestions
    
    # Base hashtags related to e-commerce and dropshipping
    base_hashtags = [
        "ecommerce", "dropshipping", "onlineshopping", "shopify", "amazonfinds",
        "smallbusiness", "entrepreneur", "sidehustle", "passiveincome", "workfromhome",
        "onlinestore", "shopsmall", "supportsmallbusiness", "startup", "business",
        "marketing", "digitalmarketing", "socialmediamarketing", "branding", "sales",
        "productphotography", "productlaunch", "newproduct", "trending", "viral"
    ]
    
    # Platform-specific hashtags
    platform_hashtags = {
        "instagram": [
            "instashop", "instashopping", "instabusiness", "instastore", "igshop",
            "instagood", "instalike", "instadaily", "photooftheday", "picoftheday"
        ],
        "tiktok": [
            "tiktokshop", "tiktokmademebuyit", "tiktokfinds", "tiktokalgorithm", "fyp",
            "foryoupage", "viral", "trending", "tiktoktrend", "tiktokmarketing"
        ],
        "facebook": [
            "facebookshop", "facebookmarketplace", "facebookads", "facebookbusiness", "facebookmarketing",
            "fbshop", "fbmarketplace", "fbads", "fbbusiness", "fbmarketing"
        ],
        "twitter": [
            "twittershop", "twitterbusiness", "twittermarketing", "tweetshop", "tweetbusiness",
            "twitterads", "tweetads", "twitterstrategy", "tweetstrategy", "twittergrowth"
        ],
        "pinterest": [
            "pinterestshop", "pinterestbusiness", "pinterestmarketing", "pinterestads", "pinterestideas",
            "pinterestinspiration", "pinteresttips", "pinterestdiy", "pinterestfinds", "pinterestworthy"
        ]
    }
    
    # Query-related hashtags
    query_words = query.lower().split()
    query_hashtags = []
    
    for word in query_words:
        # Generate variations
        query_hashtags.extend([
            word,
            f"{word}shop",
            f"{word}store",
            f"{word}online",
            f"best{word}",
            f"trending{word}",
            f"{word}deals",
            f"{word}sale",
            f"{word}discount",
            f"cheap{word}"
        ])
    
    # Combine hashtags
    all_hashtags = []
    all_hashtags.extend(query_hashtags)
    
    if platform and platform in platform_hashtags:
        all_hashtags.extend(platform_hashtags[platform])
    
    all_hashtags.extend(base_hashtags)
    
    # Filter hashtags that contain the query
    filtered_hashtags = [tag for tag in all_hashtags if query.lower() in tag.lower()]
    
    # Remove duplicates and limit
    unique_hashtags = list(dict.fromkeys(filtered_hashtags))[:limit]
    
    # Generate mock popularity data
    popularity = {}
    for tag in unique_hashtags:
        popularity[tag] = random.randint(10000, 10000000)
    
    # Generate mock related tags
    related_tags = {}
    for tag in unique_hashtags[:5]:  # Only for the top 5 tags
        related_tags[tag] = random.sample(unique_hashtags, min(5, len(unique_hashtags)))
    
    return {
        "hashtags": unique_hashtags,
        "popularity": popularity,
        "related_tags": related_tags
    }

def get_social_calendar(
    db: Session, 
    user_id: str, 
    start_date: date,
    end_date: date,
    account_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Get social calendar
    """
    # Convert dates to datetime
    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(end_date, datetime.max.time())
    
    # Get scheduled posts
    posts_query = db.query(models.SocialPost).filter(
        models.SocialPost.user_id == user_id,
        models.SocialPost.status.in_(["scheduled", "published"]),
        models.SocialPost.scheduled_for >= start_datetime,
        models.SocialPost.scheduled_for <= end_datetime
    )
    
    if account_id:
        posts_query = posts_query.filter(models.SocialPost.account_id == account_id)
    
    posts = posts_query.all()
    
    # Get schedules
    schedules_query = db.query(models.SocialSchedule).filter(
        models.SocialSchedule.user_id == user_id,
        models.SocialSchedule.is_active == True
    )
    
    if account_id:
        schedules_query = schedules_query.filter(models.SocialSchedule.account_id == account_id)
    
    schedules = schedules_query.all()
    
    # Prepare calendar items
    calendar_items = []
    
    # Add posts
    for post in posts:
        account = db.query(models.SocialAccount).filter(models.SocialAccount.id == post.account_id).first()
        
        calendar_items.append({
            "id": post.id,
            "title": post.content[:30] + "..." if post.content and len(post.content) > 30 else "Post",
            "start": post.scheduled_for,
            "end": post.scheduled_for + timedelta(minutes=30) if post.scheduled_for else None,
            "type": "post",
            "status": post.status,
            "platform": account.platform if account else "unknown",
            "account_id": post.account_id,
            "account_name": account.account_name if account else "Unknown Account"
        })
    
    # Add schedule occurrences
    for schedule in schedules:
        account = db.query(models.SocialAccount).filter(models.SocialAccount.id == schedule.account_id).first()
        
        # Generate occurrences for the date range
        occurrences = generate_schedule_occurrences(schedule, start_date, end_date)
        
        for occurrence in occurrences:
            calendar_items.append({
                "id": f"{schedule.id}_{occurrence.isoformat()}",
                "title": schedule.name,
                "start": occurrence,
                "end": occurrence + timedelta(minutes=30),
                "type": "schedule",
                "status": "scheduled",
                "platform": account.platform if account else "unknown",
                "account_id": schedule.account_id,
                "account_name": account.account_name if account else "Unknown Account"
            })
    
    return calendar_items

def generate_schedule_occurrences(schedule: models.SocialSchedule, start_date: date, end_date: date) -> List[datetime]:
    """
    Generate schedule occurrences for a date range
    """
    occurrences = []
    
    # Parse time of day
    hour, minute = map(int, schedule.time_of_day.split(':'))
    
    # Generate occurrences based on frequency
    if schedule.frequency == "daily":
        # Daily occurrences
        current_date = start_date
        while current_date <= end_date:
            occurrences.append(datetime.combine(current_date, datetime.min.time()).replace(hour=hour, minute=minute))
            current_date += timedelta(days=1)
    
    elif schedule.frequency == "weekly":
        # Weekly occurrences on specified days
        if not schedule.days_of_week:
            return occurrences
        
        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() in schedule.days_of_week:
                occurrences.append(datetime.combine(current_date, datetime.min.time()).replace(hour=hour, minute=minute))
            current_date += timedelta(days=1)
    
    elif schedule.frequency == "monthly":
        # Monthly occurrences on specified day
        if not schedule.day_of_month:
            return occurrences
        
        current_date = start_date
        while current_date <= end_date:
            # Check if it's the specified day of month
            if current_date.day == schedule.day_of_month:
                occurrences.append(datetime.combine(current_date, datetime.min.time()).replace(hour=hour, minute=minute))
            
            # Move to next day
            current_date += timedelta(days=1)
    
    return occurrences