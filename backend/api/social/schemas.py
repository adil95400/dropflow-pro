from pydantic import BaseModel, Field, validator, HttpUrl
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, date
from enum import Enum

class SocialPlatform(str, Enum):
    facebook = "facebook"
    instagram = "instagram"
    tiktok = "tiktok"
    twitter = "twitter"
    pinterest = "pinterest"
    youtube = "youtube"
    linkedin = "linkedin"
    snapchat = "snapchat"

class PostStatus(str, Enum):
    draft = "draft"
    scheduled = "scheduled"
    published = "published"
    failed = "failed"
    archived = "archived"

class PostType(str, Enum):
    image = "image"
    video = "video"
    carousel = "carousel"
    text = "text"
    link = "link"
    story = "story"
    reel = "reel"

class SocialAccountBase(BaseModel):
    platform: SocialPlatform
    account_name: str
    account_id: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    is_active: Optional[bool] = True
    profile_url: Optional[HttpUrl] = None
    profile_image: Optional[str] = None
    followers_count: Optional[int] = None
    following_count: Optional[int] = None
    posts_count: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class SocialAccountCreate(SocialAccountBase):
    pass

class SocialAccountUpdate(BaseModel):
    account_name: Optional[str] = None
    account_id: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    profile_url: Optional[HttpUrl] = None
    profile_image: Optional[str] = None
    followers_count: Optional[int] = None
    following_count: Optional[int] = None
    posts_count: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class SocialAccountResponse(SocialAccountBase):
    id: str
    user_id: str
    last_sync_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class SyncResponse(BaseModel):
    status: str
    message: str

class SocialPostBase(BaseModel):
    account_id: str
    product_id: Optional[str] = None
    type: PostType
    status: PostStatus = PostStatus.draft
    content: Optional[str] = None
    media_urls: Optional[List[str]] = None
    link: Optional[HttpUrl] = None
    scheduled_for: Optional[datetime] = None
    hashtags: Optional[List[str]] = None
    mentions: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class SocialPostCreate(SocialPostBase):
    pass

class SocialPostUpdate(BaseModel):
    product_id: Optional[str] = None
    type: Optional[PostType] = None
    status: Optional[PostStatus] = None
    content: Optional[str] = None
    media_urls: Optional[List[str]] = None
    link: Optional[HttpUrl] = None
    scheduled_for: Optional[datetime] = None
    hashtags: Optional[List[str]] = None
    mentions: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class SocialPostResponse(SocialPostBase):
    id: str
    user_id: str
    external_id: Optional[str] = None
    published_at: Optional[datetime] = None
    engagement: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class SocialPostDetailResponse(SocialPostResponse):
    account: SocialAccountResponse
    
    class Config:
        orm_mode = True

class MediaUploadResponse(BaseModel):
    media_url: str

class PostSchedule(BaseModel):
    scheduled_for: datetime

class SocialTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    platform: SocialPlatform
    type: PostType
    content_template: Optional[str] = None
    hashtags: Optional[List[str]] = None
    media_placeholders: Optional[List[str]] = None
    is_default: Optional[bool] = False
    metadata: Optional[Dict[str, Any]] = None

class SocialTemplateCreate(SocialTemplateBase):
    pass

class SocialTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    platform: Optional[SocialPlatform] = None
    type: Optional[PostType] = None
    content_template: Optional[str] = None
    hashtags: Optional[List[str]] = None
    media_placeholders: Optional[List[str]] = None
    is_default: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class SocialTemplateResponse(SocialTemplateBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class SocialScheduleBase(BaseModel):
    account_id: str
    template_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    frequency: str
    days_of_week: Optional[List[int]] = None
    day_of_month: Optional[int] = None
    time_of_day: str
    is_active: Optional[bool] = True
    settings: Optional[Dict[str, Any]] = None
    
    @validator('days_of_week')
    def validate_days_of_week(cls, v, values):
        if values.get('frequency') == 'weekly' and (not v or not len(v)):
            raise ValueError('days_of_week is required for weekly frequency')
        if v:
            for day in v:
                if day < 0 or day > 6:
                    raise ValueError('days_of_week must contain values between 0 and 6')
        return v
    
    @validator('day_of_month')
    def validate_day_of_month(cls, v, values):
        if values.get('frequency') == 'monthly' and v is None:
            raise ValueError('day_of_month is required for monthly frequency')
        if v is not None and (v < 1 or v > 31):
            raise ValueError('day_of_month must be between 1 and 31')
        return v
    
    @validator('time_of_day')
    def validate_time_of_day(cls, v):
        try:
            hours, minutes = v.split(':')
            if not (0 <= int(hours) <= 23 and 0 <= int(minutes) <= 59):
                raise ValueError()
        except:
            raise ValueError('time_of_day must be in format HH:MM')
        return v

class SocialScheduleCreate(SocialScheduleBase):
    pass

class SocialScheduleUpdate(BaseModel):
    account_id: Optional[str] = None
    template_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    frequency: Optional[str] = None
    days_of_week: Optional[List[int]] = None
    day_of_month: Optional[int] = None
    time_of_day: Optional[str] = None
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

class SocialScheduleResponse(SocialScheduleBase):
    id: str
    user_id: str
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class SocialAnalyticsBase(BaseModel):
    account_id: str
    post_id: Optional[str] = None
    date: date
    platform: SocialPlatform
    impressions: Optional[int] = None
    reach: Optional[int] = None
    engagement: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None
    clicks: Optional[int] = None
    saves: Optional[int] = None
    followers_gained: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class SocialAnalyticsResponse(BaseModel):
    summary: Dict[str, Any]
    by_platform: Dict[str, Any]
    by_post: Optional[List[Dict[str, Any]]] = None
    by_date: List[Dict[str, Any]]

class ContentGenerationRequest(BaseModel):
    platform: SocialPlatform
    type: PostType
    product_id: Optional[str] = None
    topic: Optional[str] = None
    tone: Optional[str] = "professional"
    include_hashtags: Optional[bool] = True
    num_variations: Optional[int] = 1

class ContentGenerationResponse(BaseModel):
    variations: List[Dict[str, Any]]

class HashtagSuggestionsResponse(BaseModel):
    hashtags: List[str]
    popularity: Optional[Dict[str, int]] = None
    related_tags: Optional[Dict[str, List[str]]] = None

class CalendarItemResponse(BaseModel):
    id: str
    title: str
    start: datetime
    end: Optional[datetime] = None
    type: str  # "post" or "schedule"
    status: Optional[str] = None
    platform: str
    account_id: str
    account_name: str
    
    class Config:
        orm_mode = True