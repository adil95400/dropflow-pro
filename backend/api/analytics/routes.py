from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.post("/events", response_model=schemas.AnalyticsEventResponse)
async def track_event(
    event: schemas.AnalyticsEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Track an analytics event
    """
    return services.create_analytics_event(db, event, current_user.id)

@router.get("/dashboard", response_model=schemas.DashboardStats)
async def get_dashboard_stats(
    period: str = Query("7d", description="Time period: 24h, 7d, 30d, 90d, all"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics for the current user
    """
    # Convert period to timedelta
    now = datetime.utcnow()
    if period == "24h":
        start_date = now - timedelta(days=1)
    elif period == "7d":
        start_date = now - timedelta(days=7)
    elif period == "30d":
        start_date = now - timedelta(days=30)
    elif period == "90d":
        start_date = now - timedelta(days=90)
    else:  # all
        start_date = None
    
    return services.get_dashboard_stats(db, current_user.id, start_date)

@router.get("/products", response_model=List[schemas.ProductPerformanceResponse])
async def get_product_performance(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort_by: str = Query("revenue", description="Field to sort by: revenue, views, conversion_rate"),
    sort_order: str = Query("desc", description="Sort order: asc, desc"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get performance metrics for user's products
    """
    return services.get_product_performance(
        db, 
        current_user.id, 
        limit, 
        offset, 
        sort_by, 
        sort_order
    )

@router.get("/trends", response_model=schemas.TrendsResponse)
async def get_trends(
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, all"),
    metric: str = Query("revenue", description="Metric: revenue, orders, products, visitors"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get trend data for a specific metric
    """
    # Convert period to timedelta
    now = datetime.utcnow()
    if period == "7d":
        start_date = now - timedelta(days=7)
        interval = "day"
    elif period == "30d":
        start_date = now - timedelta(days=30)
        interval = "day"
    elif period == "90d":
        start_date = now - timedelta(days=90)
        interval = "week"
    else:  # all
        start_date = None
        interval = "month"
    
    return services.get_trends(db, current_user.id, metric, start_date, interval)

@router.get("/user-metrics", response_model=schemas.UserMetricsResponse)
async def get_user_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get aggregated metrics for the current user
    """
    return services.get_user_metrics(db, current_user.id)

@router.get("/top-products", response_model=List[schemas.TopProductResponse])
async def get_top_products(
    limit: int = Query(5, ge=1, le=20),
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, all"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get top performing products
    """
    # Convert period to timedelta
    now = datetime.utcnow()
    if period == "7d":
        start_date = now - timedelta(days=7)
    elif period == "30d":
        start_date = now - timedelta(days=30)
    elif period == "90d":
        start_date = now - timedelta(days=90)
    else:  # all
        start_date = None
    
    return services.get_top_products(db, current_user.id, limit, start_date)

@router.get("/export", response_model=schemas.AnalyticsExportResponse)
async def export_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    format: str = Query("csv", description="Export format: csv, json, xlsx"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Export analytics data
    """
    if not start_date:
        start_date = datetime.utcnow() - timedelta(days=30)
    
    if not end_date:
        end_date = datetime.utcnow()
    
    return services.export_analytics(db, current_user.id, start_date, end_date, format)