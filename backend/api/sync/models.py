from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class SyncDirection(str, enum.Enum):
    import_to_dropflow = "import_to_dropflow"
    export_from_dropflow = "export_from_dropflow"
    bidirectional = "bidirectional"

class SyncStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    failed = "failed"
    partial = "partial"

class SyncFrequency(str, enum.Enum):
    manual = "manual"
    hourly = "hourly"
    daily = "daily"
    weekly = "weekly"

class PlatformType(str, enum.Enum):
    shopify = "shopify"
    woocommerce = "woocommerce"
    prestashop = "prestashop"
    magento = "magento"
    etsy = "etsy"
    ebay = "ebay"
    amazon = "amazon"
    bigcommerce = "bigcommerce"
    custom = "custom"

class SyncEntityType(str, enum.Enum):
    product = "product"
    order = "order"
    customer = "customer"
    inventory = "inventory"
    all = "all"

class StoreConnection(Base):
    __tablename__ = "store_connections"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    platform = Column(Enum(PlatformType), nullable=False)
    store_url = Column(String, nullable=False)
    api_key = Column(String, nullable=False)
    api_secret = Column(String, nullable=True)
    api_version = Column(String, nullable=True)
    access_token = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, nullable=True)
    metadata = Column(JSON, nullable=True)
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="store_connections")
    sync_jobs = relationship("SyncJob", back_populates="store_connection", cascade="all, delete-orphan")
    sync_logs = relationship("SyncLog", back_populates="store_connection", cascade="all, delete-orphan")
    sync_schedules = relationship("SyncSchedule", back_populates="store_connection", cascade="all, delete-orphan")

class SyncJob(Base):
    __tablename__ = "sync_jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    store_connection_id = Column(String, ForeignKey("store_connections.id", ondelete="CASCADE"))
    direction = Column(Enum(SyncDirection), nullable=False)
    entity_type = Column(Enum(SyncEntityType), nullable=False)
    status = Column(Enum(SyncStatus), default=SyncStatus.pending)
    total_items = Column(Integer, default=0)
    processed_items = Column(Integer, default=0)
    successful_items = Column(Integer, default=0)
    failed_items = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    settings = Column(JSON, nullable=True)
    metadata = Column(JSON, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sync_jobs")
    store_connection = relationship("StoreConnection", back_populates="sync_jobs")
    sync_items = relationship("SyncItem", back_populates="sync_job", cascade="all, delete-orphan")

class SyncItem(Base):
    __tablename__ = "sync_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sync_job_id = Column(String, ForeignKey("sync_jobs.id", ondelete="CASCADE"))
    entity_id = Column(String, nullable=False)  # ID in the source system
    entity_type = Column(Enum(SyncEntityType), nullable=False)
    target_id = Column(String, nullable=True)  # ID in the target system
    status = Column(Enum(SyncStatus), default=SyncStatus.pending)
    error_message = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    sync_job = relationship("SyncJob", back_populates="sync_items")

class SyncLog(Base):
    __tablename__ = "sync_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    store_connection_id = Column(String, ForeignKey("store_connections.id", ondelete="CASCADE"))
    sync_job_id = Column(String, ForeignKey("sync_jobs.id", ondelete="SET NULL"), nullable=True)
    direction = Column(Enum(SyncDirection), nullable=False)
    entity_type = Column(Enum(SyncEntityType), nullable=False)
    status = Column(Enum(SyncStatus), nullable=False)
    total_items = Column(Integer, default=0)
    successful_items = Column(Integer, default=0)
    failed_items = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sync_logs")
    store_connection = relationship("StoreConnection", back_populates="sync_logs")
    sync_job = relationship("SyncJob")

class SyncSchedule(Base):
    __tablename__ = "sync_schedules"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    store_connection_id = Column(String, ForeignKey("store_connections.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    direction = Column(Enum(SyncDirection), nullable=False)
    entity_type = Column(Enum(SyncEntityType), nullable=False)
    frequency = Column(Enum(SyncFrequency), nullable=False)
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, nullable=True)
    last_run_at = Column(DateTime(timezone=True), nullable=True)
    next_run_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sync_schedules")
    store_connection = relationship("StoreConnection", back_populates="sync_schedules")

class SyncConflict(Base):
    __tablename__ = "sync_conflicts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    store_connection_id = Column(String, ForeignKey("store_connections.id", ondelete="CASCADE"))
    sync_job_id = Column(String, ForeignKey("sync_jobs.id", ondelete="SET NULL"), nullable=True)
    entity_id = Column(String, nullable=False)
    entity_type = Column(Enum(SyncEntityType), nullable=False)
    conflict_type = Column(String, nullable=False)  # e.g., "data_mismatch", "duplicate", "missing"
    source_data = Column(JSON, nullable=True)
    target_data = Column(JSON, nullable=True)
    resolution = Column(String, nullable=True)  # e.g., "use_source", "use_target", "merge", "skip"
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sync_conflicts")
    store_connection = relationship("StoreConnection")
    sync_job = relationship("SyncJob")

# Add relationships to User model
from ..auth.models import User
User.store_connections = relationship("StoreConnection", back_populates="user", cascade="all, delete-orphan")
User.sync_jobs = relationship("SyncJob", back_populates="user")
User.sync_logs = relationship("SyncLog", back_populates="user")
User.sync_schedules = relationship("SyncSchedule", back_populates="user", cascade="all, delete-orphan")
User.sync_conflicts = relationship("SyncConflict", back_populates="user")