from pydantic import BaseModel, Field, validator, HttpUrl
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class SyncDirection(str, Enum):
    import_to_dropflow = "import_to_dropflow"
    export_from_dropflow = "export_from_dropflow"
    bidirectional = "bidirectional"

class SyncStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    failed = "failed"
    partial = "partial"

class SyncFrequency(str, Enum):
    manual = "manual"
    hourly = "hourly"
    daily = "daily"
    weekly = "weekly"

class PlatformType(str, Enum):
    shopify = "shopify"
    woocommerce = "woocommerce"
    prestashop = "prestashop"
    magento = "magento"
    etsy = "etsy"
    ebay = "ebay"
    amazon = "amazon"
    bigcommerce = "bigcommerce"
    custom = "custom"

class SyncEntityType(str, Enum):
    product = "product"
    order = "order"
    customer = "customer"
    inventory = "inventory"
    all = "all"

class StoreConnectionBase(BaseModel):
    name: str
    platform: PlatformType
    store_url: HttpUrl
    api_key: str
    api_secret: Optional[str] = None
    api_version: Optional[str] = None
    is_active: Optional[bool] = True
    settings: Optional[Dict[str, Any]] = None

class StoreConnectionCreate(StoreConnectionBase):
    pass

class StoreConnectionUpdate(BaseModel):
    name: Optional[str] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    api_version: Optional[str] = None
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

class StoreConnectionResponse(StoreConnectionBase):
    id: str
    user_id: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    last_sync_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ConnectionTestResponse(BaseModel):
    success: bool
    message: str
    details: Optional[Dict[str, Any]] = None

class SyncJobBase(BaseModel):
    store_connection_id: str
    direction: SyncDirection
    entity_type: SyncEntityType
    settings: Optional[Dict[str, Any]] = None

class SyncJobCreate(SyncJobBase):
    pass

class SyncJobResponse(SyncJobBase):
    id: str
    user_id: str
    status: SyncStatus
    total_items: int
    processed_items: int
    successful_items: int
    failed_items: int
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class SyncItemBase(BaseModel):
    entity_id: str
    entity_type: SyncEntityType
    target_id: Optional[str] = None
    status: SyncStatus
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class SyncItemResponse(SyncItemBase):
    id: str
    sync_job_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class SyncJobDetailResponse(SyncJobResponse):
    items: List[SyncItemResponse]
    store_connection: StoreConnectionResponse
    
    class Config:
        orm_mode = True

class SyncLogBase(BaseModel):
    store_connection_id: str
    sync_job_id: Optional[str] = None
    direction: SyncDirection
    entity_type: SyncEntityType
    status: SyncStatus
    total_items: int
    successful_items: int
    failed_items: int
    error_message: Optional[str] = None
    duration_seconds: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class SyncLogResponse(SyncLogBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class SyncScheduleBase(BaseModel):
    store_connection_id: str
    name: str
    direction: SyncDirection
    entity_type: SyncEntityType
    frequency: SyncFrequency
    is_active: Optional[bool] = True
    settings: Optional[Dict[str, Any]] = None

class SyncScheduleCreate(SyncScheduleBase):
    pass

class SyncScheduleUpdate(BaseModel):
    name: Optional[str] = None
    store_connection_id: Optional[str] = None
    direction: Optional[SyncDirection] = None
    entity_type: Optional[SyncEntityType] = None
    frequency: Optional[SyncFrequency] = None
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

class SyncScheduleResponse(SyncScheduleBase):
    id: str
    user_id: str
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class SyncConflictBase(BaseModel):
    store_connection_id: str
    sync_job_id: Optional[str] = None
    entity_id: str
    entity_type: SyncEntityType
    conflict_type: str
    source_data: Optional[Dict[str, Any]] = None
    target_data: Optional[Dict[str, Any]] = None
    resolution: Optional[str] = None
    resolved_at: Optional[datetime] = None

class SyncConflictResponse(SyncConflictBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ConflictResolution(BaseModel):
    resolution: str = Field(..., description="Resolution type: use_source, use_target, merge, skip")
    
    @validator('resolution')
    def validate_resolution(cls, v):
        valid_resolutions = ["use_source", "use_target", "merge", "skip"]
        if v not in valid_resolutions:
            raise ValueError(f"Resolution must be one of: {', '.join(valid_resolutions)}")
        return v