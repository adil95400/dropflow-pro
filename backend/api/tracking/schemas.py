from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class TrackingStatus(str, Enum):
    pending = "pending"
    info_received = "info_received"
    in_transit = "in_transit"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    exception = "exception"
    expired = "expired"
    unknown = "unknown"

class TrackingProvider(str, Enum):
    seventeen_track = "17track"
    aftership = "aftership"
    shippo = "shippo"
    easypost = "easypost"
    usps = "usps"
    ups = "ups"
    fedex = "fedex"
    dhl = "dhl"
    manual = "manual"

class NotificationType(str, Enum):
    email = "email"
    sms = "sms"
    push = "push"
    webhook = "webhook"

class TrackingEventBase(BaseModel):
    status: TrackingStatus
    status_description: Optional[str] = None
    location: Optional[str] = None
    timestamp: datetime
    message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class TrackingEventCreate(TrackingEventBase):
    pass

class TrackingEventResponse(TrackingEventBase):
    id: str
    tracking_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class TrackingBase(BaseModel):
    tracking_number: str
    carrier: Optional[str] = None
    carrier_code: Optional[str] = None
    order_id: Optional[str] = None
    provider: Optional[TrackingProvider] = TrackingProvider.seventeen_track

class TrackingCreate(TrackingBase):
    pass

class TrackingUpdate(BaseModel):
    carrier: Optional[str] = None
    carrier_code: Optional[str] = None
    status: Optional[TrackingStatus] = None
    status_description: Optional[str] = None
    origin_country: Optional[str] = None
    destination_country: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    provider: Optional[TrackingProvider] = None
    metadata: Optional[Dict[str, Any]] = None

class TrackingResponse(TrackingBase):
    id: str
    user_id: str
    status: TrackingStatus
    status_description: Optional[str] = None
    origin_country: Optional[str] = None
    destination_country: Optional[str] = None
    estimated_delivery: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    last_update: Optional[datetime] = None
    last_checked: Optional[datetime] = None
    external_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class TrackingDetailResponse(TrackingResponse):
    events: List[TrackingEventResponse]
    
    class Config:
        orm_mode = True

class NotificationBase(BaseModel):
    type: NotificationType
    recipient: str

class NotificationCreate(NotificationBase):
    pass

class TrackingNotificationBase(BaseModel):
    tracking_id: str
    type: str
    recipient: str
    status: str
    trigger_event: str
    content: Optional[str] = None
    sent_at: Optional[datetime] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class TrackingNotificationResponse(TrackingNotificationBase):
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class TrackingSettingsBase(BaseModel):
    default_provider: TrackingProvider = TrackingProvider.seventeen_track
    auto_track_orders: bool = True
    notify_customer: bool = True
    notification_types: Optional[List[str]] = ["email"]
    api_keys: Optional[Dict[str, str]] = None
    webhook_url: Optional[str] = None

class TrackingSettingsCreate(TrackingSettingsBase):
    pass

class TrackingSettingsUpdate(BaseModel):
    default_provider: Optional[TrackingProvider] = None
    auto_track_orders: Optional[bool] = None
    notify_customer: Optional[bool] = None
    notification_types: Optional[List[str]] = None
    api_keys: Optional[Dict[str, str]] = None
    webhook_url: Optional[str] = None

class TrackingSettingsResponse(TrackingSettingsBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class CarrierInfoBase(BaseModel):
    name: str
    code: str
    website: Optional[str] = None
    tracking_url_template: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: bool = True
    countries: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class CarrierInfoResponse(CarrierInfoBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class StatusCount(BaseModel):
    status: str
    count: int

class TrackingStatsResponse(BaseModel):
    total_trackings: int
    status_counts: List[StatusCount]
    average_delivery_days: Optional[float] = None
    on_time_delivery_rate: Optional[float] = None
    exception_rate: Optional[float] = None
    carrier_stats: Optional[Dict[str, Any]] = None
    country_stats: Optional[Dict[str, Any]] = None

class BatchImportResponse(BaseModel):
    success: bool
    total: int
    imported: int
    failed: int
    tracking_ids: List[str]
    errors: Optional[List[Dict[str, Any]]] = None