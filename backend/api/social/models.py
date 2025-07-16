from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class SocialPlatform(str, enum.Enum):
    facebook = "facebook"
    instagram = "instagram"
    tiktok = "tiktok"
    twitter = "twitter"
    pinterest = "pinterest"
    youtube = "youtube"
    linkedin = "linkedin"
    snapchat = "snapchat"

class PostStatus(str, enum.Enum):
    draft = "draft"
    scheduled = "scheduled"
    published = "published"
    failed = "failed"
    archived = "archived"

class PostType(str, enum.Enum):
    image = "image"
    video = "video"
    carousel = "carousel"
    text = "text"
    link = "link"
    story = "story"
    reel = "reel"

class SocialAccount(Base):
    __tablename__ = "social_accounts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    platform = Column(Enum(SocialPlatform), nullable=False)
    account_name = Column(String, nullable=False)
    account_id = Column(String, nullable=True)
    access_token = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    profile_url = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    followers_count = Column(Integer, nullable=True)
    following_count = Column(Integer, nullable=True)
    posts_count = Column(Integer, nullable=True)
    metadata = Column(JSON, nullable=True)
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_accounts")
    posts = relationship("SocialPost", back_populates="account", cascade="all, delete-orphan")

class SocialPost(Base):
    __tablename__ = "social_posts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    account_id = Column(String, ForeignKey("social_accounts.id", ondelete="CASCADE"))
    product_id = Column(String, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    external_id = Column(String, nullable=True)
    type = Column(Enum(PostType), nullable=False)
    status = Column(Enum(PostStatus), default=PostStatus.draft)
    content = Column(Text, nullable=True)
    media_urls = Column(JSON, nullable=True)  # List of media URLs
    link = Column(String, nullable=True)
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    hashtags = Column(JSON, nullable=True)  # List of hashtags
    mentions = Column(JSON, nullable=True)  # List of mentions
    engagement = Column(JSON, nullable=True)  # Likes, comments, shares, etc.
    error_message = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_posts")
    account = relationship("SocialAccount", back_populates="posts")
    product = relationship("Product", back_populates="social_posts")

class SocialTemplate(Base):
    __tablename__ = "social_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    platform = Column(Enum(SocialPlatform), nullable=False)
    type = Column(Enum(PostType), nullable=False)
    content_template = Column(Text, nullable=True)
    hashtags = Column(JSON, nullable=True)  # List of hashtags
    media_placeholders = Column(JSON, nullable=True)  # Descriptions of media to include
    is_default = Column(Boolean, default=False)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_templates")

class SocialSchedule(Base):
    __tablename__ = "social_schedules"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    account_id = Column(String, ForeignKey("social_accounts.id", ondelete="CASCADE"))
    template_id = Column(String, ForeignKey("social_templates.id", ondelete="SET NULL"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    frequency = Column(String, nullable=False)  # daily, weekly, monthly
    days_of_week = Column(JSON, nullable=True)  # List of days (0-6) for weekly
    day_of_month = Column(Integer, nullable=True)  # 1-31 for monthly
    time_of_day = Column(String, nullable=False)  # HH:MM in UTC
    is_active = Column(Boolean, default=True)
    last_run_at = Column(DateTime(timezone=True), nullable=True)
    next_run_at = Column(DateTime(timezone=True), nullable=True)
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_schedules")
    account = relationship("SocialAccount")
    template = relationship("SocialTemplate")

class SocialAnalytics(Base):
    __tablename__ = "social_analytics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    account_id = Column(String, ForeignKey("social_accounts.id", ondelete="CASCADE"))
    post_id = Column(String, ForeignKey("social_posts.id", ondelete="CASCADE"), nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    platform = Column(Enum(SocialPlatform), nullable=False)
    impressions = Column(Integer, nullable=True)
    reach = Column(Integer, nullable=True)
    engagement = Column(Integer, nullable=True)
    likes = Column(Integer, nullable=True)
    comments = Column(Integer, nullable=True)
    shares = Column(Integer, nullable=True)
    clicks = Column(Integer, nullable=True)
    saves = Column(Integer, nullable=True)
    followers_gained = Column(Integer, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="social_analytics")
    account = relationship("SocialAccount")
    post = relationship("SocialPost")

# Add relationships to User and Product models
from ..auth.models import User
from ..products.models import Product

User.social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
User.social_posts = relationship("SocialPost", back_populates="user")
User.social_templates = relationship("SocialTemplate", back_populates="user", cascade="all, delete-orphan")
User.social_schedules = relationship("SocialSchedule", back_populates="user", cascade="all, delete-orphan")
User.social_analytics = relationship("SocialAnalytics", back_populates="user")
Product.social_posts = relationship("SocialPost", back_populates="product")