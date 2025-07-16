from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class CompetitionLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class SocialProof(BaseModel):
    reviews: Optional[int] = 0
    rating: Optional[float] = 0
    orders: Optional[int] = 0

class AdSpend(BaseModel):
    facebook: Optional[float] = 0
    google: Optional[float] = 0
    tiktok: Optional[float] = 0
    other: Optional[float] = 0

class WinnerProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    images: Optional[List[str]] = None
    supplier: Optional[str] = None
    category: Optional[str] = None
    winner_score: int = Field(..., ge=0, le=100)
    reasons: Optional[List[str]] = None
    market_trends: Optional[List[str]] = None
    competition_level: CompetitionLevel = CompetitionLevel.medium
    profit_potential: Optional[float] = None
    social_proof: Optional[SocialProof] = None
    ad_spend: Optional[AdSpend] = None
    metadata: Optional[Dict[str, Any]] = None

class WinnerProductCreate(WinnerProductBase):
    product_id: Optional[str] = None

class WinnerProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None
    supplier: Optional[str] = None
    category: Optional[str] = None
    winner_score: Optional[int] = Field(None, ge=0, le=100)
    reasons: Optional[List[str]] = None
    market_trends: Optional[List[str]] = None
    competition_level: Optional[CompetitionLevel] = None
    profit_potential: Optional[float] = None
    social_proof: Optional[SocialProof] = None
    ad_spend: Optional[AdSpend] = None
    metadata: Optional[Dict[str, Any]] = None

class WinnerProductResponse(WinnerProductBase):
    id: str
    user_id: str
    product_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class WinnerProductDetailResponse(WinnerProductResponse):
    related_trends: Optional[List[Dict[str, Any]]] = None
    
    class Config:
        orm_mode = True

class MarketTrendBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    growth_rate: Optional[float] = None
    competition_level: CompetitionLevel = CompetitionLevel.medium
    opportunity_score: Optional[int] = Field(None, ge=0, le=100)
    related_keywords: Optional[List[str]] = None
    seasonal: Optional[bool] = False
    season_start: Optional[str] = None
    season_end: Optional[str] = None
    source: Optional[str] = None
    is_public: Optional[bool] = False
    metadata: Optional[Dict[str, Any]] = None

class MarketTrendCreate(MarketTrendBase):
    pass

class MarketTrendUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    growth_rate: Optional[float] = None
    competition_level: Optional[CompetitionLevel] = None
    opportunity_score: Optional[int] = Field(None, ge=0, le=100)
    related_keywords: Optional[List[str]] = None
    seasonal: Optional[bool] = None
    season_start: Optional[str] = None
    season_end: Optional[str] = None
    source: Optional[str] = None
    is_public: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class MarketTrendResponse(MarketTrendBase):
    id: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class MarketTrendDetailResponse(MarketTrendResponse):
    related_products: Optional[List[Dict[str, Any]]] = None
    
    class Config:
        orm_mode = True

class WinnerDetectionSettings(BaseModel):
    min_score: Optional[int] = 70
    categories: Optional[List[str]] = None
    suppliers: Optional[List[str]] = None
    min_profit_potential: Optional[float] = None
    max_competition_level: Optional[CompetitionLevel] = None
    auto_create_winners: Optional[bool] = True

class WinnerDetectionCreate(BaseModel):
    product_ids: Optional[List[str]] = None
    all_products: Optional[bool] = False
    settings: Optional[WinnerDetectionSettings] = None
    
    @validator('all_products', 'product_ids')
    def validate_product_selection(cls, v, values):
        if 'all_products' in values and 'product_ids' in values:
            if not values['all_products'] and not values['product_ids']:
                raise ValueError('Either all_products must be true or product_ids must be provided')
        return v

class WinnerDetectionJobBase(BaseModel):
    status: str
    total_products: int
    processed_products: int
    winners_found: int
    settings: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class WinnerDetectionJobResponse(WinnerDetectionJobBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class WinnerDetectionResultBase(BaseModel):
    product_id: str
    is_winner: bool
    score: Optional[int] = None
    analysis: Optional[str] = None
    reasons: Optional[List[str]] = None
    winner_product_id: Optional[str] = None

class WinnerDetectionResultResponse(WinnerDetectionResultBase):
    id: str
    job_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class WinnerDetectionJobDetailResponse(WinnerDetectionJobResponse):
    results: List[WinnerDetectionResultResponse]
    
    class Config:
        orm_mode = True

class ProductAnalysisResponse(BaseModel):
    product_id: str
    is_winner: bool
    score: int
    analysis: str
    reasons: List[str]
    winner_product_id: Optional[str] = None

class TrendDetectionCreate(BaseModel):
    niche: Optional[str] = None
    categories: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    max_results: Optional[int] = 10

class WinnerStatsResponse(BaseModel):
    total_winners: int
    average_score: float
    by_competition_level: Dict[str, int]
    by_category: Dict[str, int]
    top_trends: List[Dict[str, Any]]
    recent_winners: List[Dict[str, Any]]