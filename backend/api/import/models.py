from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class ImportSource(str, enum.Enum):
    aliexpress = "aliexpress"
    bigbuy = "bigbuy"
    eprolo = "eprolo"
    printify = "printify"
    spocket = "spocket"
    amazon = "amazon"
    ebay = "ebay"
    etsy = "etsy"
    csv = "csv"
    api = "api"
    url = "url"
    manual = "manual"

class ImportStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    partial = "partial"

class ImportBatch(Base):
    __tablename__ = "import_batches"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    source = Column(Enum(ImportSource), nullable=False)
    status = Column(Enum(ImportStatus), default=ImportStatus.pending)
    total_items = Column(Integer, default=0)
    processed_items = Column(Integer, default=0)
    successful_items = Column(Integer, default=0)
    failed_items = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="import_batches")
    import_items = relationship("ImportItem", back_populates="batch", cascade="all, delete-orphan")

class ImportItem(Base):
    __tablename__ = "import_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    batch_id = Column(String, ForeignKey("import_batches.id", ondelete="CASCADE"))
    external_id = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    original_price = Column(Float, nullable=True)
    status = Column(Enum(ImportStatus), default=ImportStatus.pending)
    error_message = Column(Text, nullable=True)
    product_id = Column(String, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    batch = relationship("ImportBatch", back_populates="import_items")
    product = relationship("Product", back_populates="import_item")

class ImportTemplate(Base):
    __tablename__ = "import_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    source = Column(Enum(ImportSource), nullable=False)
    is_default = Column(Boolean, default=False)
    settings = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="import_templates")

class ImportSchedule(Base):
    __tablename__ = "import_schedules"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    template_id = Column(String, ForeignKey("import_templates.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    frequency = Column(String, nullable=False)  # daily, weekly, monthly
    day_of_week = Column(Integer, nullable=True)  # 0-6 for weekly
    day_of_month = Column(Integer, nullable=True)  # 1-31 for monthly
    time_of_day = Column(String, nullable=False)  # HH:MM in UTC
    last_run = Column(DateTime(timezone=True), nullable=True)
    next_run = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="import_schedules")
    template = relationship("ImportTemplate", back_populates="schedules")

# Add relationships to other models
ImportTemplate.schedules = relationship("ImportSchedule", back_populates="template", cascade="all, delete-orphan")