from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class TrackingStatus(str, enum.Enum):
    pending = "pending"
    info_received = "info_received"
    in_transit = "in_transit"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    exception = "exception"
    expired = "expired"
    unknown = "unknown"

class TrackingProvider(str, enum.Enum):
    seventeen_track = "17track"
    aftership = "aftership"
    shippo = "shippo"
    easypost = "easypost"
    usps = "usps"
    ups = "ups"
    fedex = "fedex"
    dhl = "dhl"
    manual = "manual"

class Tracking(Base):
    __tablename__ = "trackings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=True)
    tracking_number = Column(String, nullable=False)
    carrier = Column(String, nullable=True)
    carrier_code = Column(String, nullable=True)
    status = Column(Enum(TrackingStatus), default=TrackingStatus.pending)
    status_description = Column(String, nullable=True)
    origin_country = Column(String, nullable=True)
    destination_country = Column(String, nullable=True)
    estimated_delivery = Column(DateTime(timezone=True), nullable=True)
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    last_update = Column(DateTime(timezone=True), nullable=True)
    last_checked = Column(DateTime(timezone=True), nullable=True)
    provider = Column(Enum(TrackingProvider), default=TrackingProvider.seventeen_track)
    external_id = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="trackings")
    order = relationship("Order", back_populates="tracking")
    events = relationship("TrackingEvent", back_populates="tracking", cascade="all, delete-orphan")
    notifications = relationship("TrackingNotification", back_populates="tracking", cascade="all, delete-orphan")

class TrackingEvent(Base):
    __tablename__ = "tracking_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_id = Column(String, ForeignKey("trackings.id", ondelete="CASCADE"))
    status = Column(Enum(TrackingStatus), nullable=False)
    status_description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    message = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    tracking = relationship("Tracking", back_populates="events")

class TrackingNotification(Base):
    __tablename__ = "tracking_notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tracking_id = Column(String, ForeignKey("trackings.id", ondelete="CASCADE"))
    type = Column(String, nullable=False)  # email, sms, push, webhook
    recipient = Column(String, nullable=False)
    status = Column(String, nullable=False)  # pending, sent, failed
    trigger_event = Column(String, nullable=False)  # status_change, delivery, exception, etc.
    content = Column(Text, nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    tracking = relationship("Tracking", back_populates="notifications")

class CarrierInfo(Base):
    __tablename__ = "carrier_info"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    website = Column(String, nullable=True)
    tracking_url_template = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    countries = Column(JSON, nullable=True)  # List of country codes
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TrackingSettings(Base):
    __tablename__ = "tracking_settings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    default_provider = Column(Enum(TrackingProvider), default=TrackingProvider.seventeen_track)
    auto_track_orders = Column(Boolean, default=True)
    notify_customer = Column(Boolean, default=True)
    notification_types = Column(JSON, nullable=True)  # List of enabled notification types
    api_keys = Column(JSON, nullable=True)  # API keys for different providers
    webhook_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="tracking_settings")

# Add relationships to User and Order models
from ..auth.models import User
from ..orders.models import Order

User.trackings = relationship("Tracking", back_populates="user")
User.tracking_settings = relationship("TrackingSettings", back_populates="user", uselist=False)
Order.tracking = relationship("Tracking", back_populates="order", uselist=False)