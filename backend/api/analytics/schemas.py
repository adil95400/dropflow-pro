from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime

class AnalyticsEventBase(BaseModel):
    event_type: str
    event_data: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class AnalyticsEventCreate(AnalyticsEventBase):
    pass

class AnalyticsEventResponse(AnalyticsEventBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserMetricsBase(BaseModel):
    total_products: int
    total_imports: int
    total_orders: int
    total_revenue: float
    conversion_rate: float
    average_order_value: float
    last_active_at: Optional[datetime] = None

class UserMetricsResponse(UserMetricsBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class DailyStatsBase(BaseModel):
    date: datetime
    products_imported: int
    orders_placed: int
    revenue: float
    visitors: int
    page_views: int

class DailyStatsResponse(DailyStatsBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ProductPerformanceBase(BaseModel):
    product_id: str
    views: int
    clicks: int
    add_to_carts: int
    purchases: int
    revenue: float
    conversion_rate: float

class ProductPerformanceResponse(ProductPerformanceBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    
    class Config:
        orm_mode = True

class TopProductResponse(BaseModel):
    id: str
    name: str
    image: Optional[str] = None
    revenue: float
    orders: int
    views: int
    conversion_rate: float
    
    class Config:
        orm_mode = True

class TimeSeriesPoint(BaseModel):
    date: str
    value: Union[int, float]

class TrendsResponse(BaseModel):
    metric: str
    interval: str
    data: List[TimeSeriesPoint]
    total: Union[int, float]
    change_percentage: float

class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    conversion_rate: float
    revenue_growth: float
    orders_growth: float
    products_growth: float
    conversion_growth: float
    sales_data: List[Dict[str, Any]]
    top_products: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    supplier_performance: List[Dict[str, Any]]

class AnalyticsExportResponse(BaseModel):
    url: str
    expires_at: datetime
    format: str