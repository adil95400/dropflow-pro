from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.get("/products", response_model=List[schemas.WinnerProductResponse])
async def get_winner_products(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    category: Optional[str] = Query(None),
    competition_level: Optional[str] = Query(None),
    min_score: Optional[int] = Query(None, ge=0, le=100),
    sort_by: str = Query("winner_score", description="Field to sort by: winner_score, profit_potential, created_at"),
    sort_order: str = Query("desc", description="Sort order: asc, desc"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get winner products for the current user
    """
    return services.get_winner_products(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        category=category,
        competition_level=competition_level,
        min_score=min_score,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/products/{product_id}", response_model=schemas.WinnerProductDetailResponse)
async def get_winner_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get winner product details
    """
    product = services.get_winner_product(db, product_id=product_id, user_id=current_user.id)
    if not product:
        raise HTTPException(status_code=404, detail="Winner product not found")
    
    return product

@router.post("/products", response_model=schemas.WinnerProductResponse)
async def create_winner_product(
    product: schemas.WinnerProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new winner product
    """
    return services.create_winner_product(db, product=product, user_id=current_user.id)

@router.put("/products/{product_id}", response_model=schemas.WinnerProductResponse)
async def update_winner_product(
    product_id: str,
    product: schemas.WinnerProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a winner product
    """
    db_product = services.get_winner_product(db, product_id=product_id, user_id=current_user.id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Winner product not found")
    
    return services.update_winner_product(db, product_id=product_id, product=product)

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_winner_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a winner product
    """
    db_product = services.get_winner_product(db, product_id=product_id, user_id=current_user.id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Winner product not found")
    
    services.delete_winner_product(db, product_id=product_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.post("/detect", response_model=schemas.WinnerDetectionJobResponse)
async def detect_winners(
    detection: schemas.WinnerDetectionCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Start a winner detection job
    """
    job = services.create_winner_detection_job(db, detection=detection, user_id=current_user.id)
    
    # Process detection in background
    background_tasks.add_task(
        services.process_winner_detection_job,
        db=db,
        job_id=job.id
    )
    
    return job

@router.get("/detect/{job_id}", response_model=schemas.WinnerDetectionJobDetailResponse)
async def get_detection_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get winner detection job details
    """
    job = services.get_winner_detection_job(db, job_id=job_id, user_id=current_user.id)
    if not job:
        raise HTTPException(status_code=404, detail="Winner detection job not found")
    
    return job

@router.post("/analyze/{product_id}", response_model=schemas.ProductAnalysisResponse)
async def analyze_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze a product for winner potential
    """
    return services.analyze_product_winner_potential(db, product_id=product_id, user_id=current_user.id)

@router.get("/trends", response_model=List[schemas.MarketTrendResponse])
async def get_market_trends(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    category: Optional[str] = Query(None),
    include_public: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get market trends
    """
    return services.get_market_trends(
        db, 
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        category=category,
        include_public=include_public
    )

@router.post("/trends", response_model=schemas.MarketTrendResponse)
async def create_market_trend(
    trend: schemas.MarketTrendCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new market trend
    """
    return services.create_market_trend(db, trend=trend, user_id=current_user.id)

@router.get("/trends/{trend_id}", response_model=schemas.MarketTrendDetailResponse)
async def get_market_trend(
    trend_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get market trend details
    """
    trend = services.get_market_trend(db, trend_id=trend_id, user_id=current_user.id)
    if not trend:
        # Check if it's a public trend
        trend = services.get_public_market_trend(db, trend_id=trend_id)
        if not trend:
            raise HTTPException(status_code=404, detail="Market trend not found")
    
    return trend

@router.put("/trends/{trend_id}", response_model=schemas.MarketTrendResponse)
async def update_market_trend(
    trend_id: str,
    trend: schemas.MarketTrendUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a market trend
    """
    db_trend = services.get_market_trend(db, trend_id=trend_id, user_id=current_user.id)
    if not db_trend:
        raise HTTPException(status_code=404, detail="Market trend not found")
    
    return services.update_market_trend(db, trend_id=trend_id, trend=trend)

@router.delete("/trends/{trend_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_market_trend(
    trend_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a market trend
    """
    db_trend = services.get_market_trend(db, trend_id=trend_id, user_id=current_user.id)
    if not db_trend:
        raise HTTPException(status_code=404, detail="Market trend not found")
    
    services.delete_market_trend(db, trend_id=trend_id)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

@router.post("/trends/detect", response_model=List[schemas.MarketTrendResponse])
async def detect_market_trends(
    detection: schemas.TrendDetectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Detect market trends
    """
    return services.detect_market_trends(db, detection=detection, user_id=current_user.id)

@router.get("/stats", response_model=schemas.WinnerStatsResponse)
async def get_winner_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get winner statistics
    """
    return services.get_winner_stats(db, user_id=current_user.id)