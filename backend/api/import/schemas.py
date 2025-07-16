from pydantic import BaseModel, Field, validator, HttpUrl
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class ImportSource(str, Enum):
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

class ImportStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    partial = "partial"

class ImportOptions(BaseModel):
    language: Optional[str] = "fr"
    auto_optimize: Optional[bool] = True
    auto_translate: Optional[bool] = False
    target_languages: Optional[List[str]] = ["fr"]
    category_mapping: Optional[Dict[str, str]] = None
    price_markup: Optional[float] = 2.5
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    skip_existing: Optional[bool] = True
    publish_directly: Optional[bool] = False
    import_variants: Optional[bool] = True
    import_reviews: Optional[bool] = False
    custom_fields: Optional[Dict[str, Any]] = None

class ImportUrlRequest(BaseModel):
    url: HttpUrl
    source: ImportSource
    options: Optional[ImportOptions] = None

class ImportBulkRequest(BaseModel):
    urls: List[HttpUrl]
    source: ImportSource
    options: Optional[ImportOptions] = None

class ImportItemBase(BaseModel):
    external_id: Optional[str] = None
    source_url: Optional[HttpUrl] = None
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    status: ImportStatus
    error_message: Optional[str] = None
    product_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class ImportItemCreate(ImportItemBase):
    batch_id: str

class ImportItemResponse(ImportItemBase):
    id: str
    batch_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ImportBatchBase(BaseModel):
    source: ImportSource
    status: ImportStatus
    total_items: int
    processed_items: int
    successful_items: int
    failed_items: int
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class ImportBatchCreate(ImportBatchBase):
    user_id: str

class ImportBatchResponse(ImportBatchBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ImportBatchDetailResponse(ImportBatchResponse):
    items: List[ImportItemResponse]
    
    class Config:
        orm_mode = True

class ImportTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    source: ImportSource
    is_default: Optional[bool] = False
    settings: Dict[str, Any]

class ImportTemplateCreate(ImportTemplateBase):
    pass

class ImportTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_default: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

class ImportTemplateResponse(ImportTemplateBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ImportScheduleFrequency(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"

class ImportScheduleBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: Optional[bool] = True
    frequency: ImportScheduleFrequency
    day_of_week: Optional[int] = None  # 0-6 for weekly
    day_of_month: Optional[int] = None  # 1-31 for monthly
    time_of_day: str  # HH:MM in UTC
    
    @validator('day_of_week')
    def validate_day_of_week(cls, v, values):
        if values.get('frequency') == ImportScheduleFrequency.weekly and v is None:
            raise ValueError('day_of_week is required for weekly frequency')
        if v is not None and (v < 0 or v > 6):
            raise ValueError('day_of_week must be between 0 and 6')
        return v
    
    @validator('day_of_month')
    def validate_day_of_month(cls, v, values):
        if values.get('frequency') == ImportScheduleFrequency.monthly and v is None:
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

class ImportScheduleCreate(ImportScheduleBase):
    template_id: str

class ImportScheduleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    frequency: Optional[ImportScheduleFrequency] = None
    day_of_week: Optional[int] = None
    day_of_month: Optional[int] = None
    time_of_day: Optional[str] = None
    template_id: Optional[str] = None

class ImportScheduleResponse(ImportScheduleBase):
    id: str
    user_id: str
    template_id: str
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True