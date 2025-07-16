from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import logging
import uuid

from . import models, schemas
from ..auth.models import User
from ..products.models import Product
from ..orders.models import Order

logger = logging.getLogger(__name__)

def create_analytics_event(db: Session, event: schemas.AnalyticsEventCreate, user_id: str) -> models.AnalyticsEvent:
    """
    Create a new analytics event
    """
    db_event = models.AnalyticsEvent(
        id=str(uuid.uuid4()),
        user_id=user_id,
        event_type=event.event_type,
        event_data=event.event_data,
        ip_address=event.ip_address,
        user_agent=event.user_agent
    )
    
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Update user's last active timestamp
    update_user_last_active(db, user_id)
    
    return db_event

def update_user_last_active(db: Session, user_id: str) -> None:
    """
    Update user's last active timestamp
    """
    # Get or create user metrics
    user_metrics = db.query(models.UserMetrics).filter(models.UserMetrics.user_id == user_id).first()
    
    if not user_metrics:
        user_metrics = models.UserMetrics(
            id=str(uuid.uuid4()),
            user_id=user_id
        )
        db.add(user_metrics)
    
    user_metrics.last_active_at = datetime.utcnow()
    db.commit()

def get_dashboard_stats(db: Session, user_id: str, start_date: Optional[datetime] = None) -> Dict[str, Any]:
    """
    Get dashboard statistics for a user
    """
    # Get user metrics
    user_metrics = db.query(models.UserMetrics).filter(models.UserMetrics.user_id == user_id).first()
    
    if not user_metrics:
        user_metrics = models.UserMetrics(
            id=str(uuid.uuid4()),
            user_id=user_id
        )
        db.add(user_metrics)
        db.commit()
        db.refresh(user_metrics)
    
    # Get previous period metrics for growth calculation
    now = datetime.utcnow()
    if start_date:
        period_length = (now - start_date).days
        previous_start = start_date - timedelta(days=period_length)
        previous_end = start_date
    else:
        # Default to 30 days
        period_length = 30
        start_date = now - timedelta(days=period_length)
        previous_start = start_date - timedelta(days=period_length)
        previous_end = start_date
    
    # Get current period orders
    current_orders = db.query(Order).filter(
        Order.user_id == user_id,
        Order.created_at >= start_date,
        Order.created_at <= now
    ).all()
    
    # Get previous period orders
    previous_orders = db.query(Order).filter(
        Order.user_id == user_id,
        Order.created_at >= previous_start,
        Order.created_at <= previous_end
    ).all()
    
    # Calculate revenue and growth
    current_revenue = sum(order.total_amount for order in current_orders)
    previous_revenue = sum(order.total_amount for order in previous_orders)
    
    revenue_growth = calculate_growth(current_revenue, previous_revenue)
    orders_growth = calculate_growth(len(current_orders), len(previous_orders))
    
    # Get products count
    current_products_count = db.query(Product).filter(
        Product.user_id == user_id,
        Product.created_at >= start_date,
        Product.created_at <= now
    ).count()
    
    previous_products_count = db.query(Product).filter(
        Product.user_id == user_id,
        Product.created_at >= previous_start,
        Product.created_at <= previous_end
    ).count()
    
    products_growth = calculate_growth(current_products_count, previous_products_count)
    
    # Calculate conversion rate (if we have page view events)
    page_views = db.query(models.AnalyticsEvent).filter(
        models.AnalyticsEvent.user_id == user_id,
        models.AnalyticsEvent.event_type == "page_view",
        models.AnalyticsEvent.created_at >= start_date,
        models.AnalyticsEvent.created_at <= now
    ).count()
    
    previous_page_views = db.query(models.AnalyticsEvent).filter(
        models.AnalyticsEvent.user_id == user_id,
        models.AnalyticsEvent.event_type == "page_view",
        models.AnalyticsEvent.created_at >= previous_start,
        models.AnalyticsEvent.created_at <= previous_end
    ).count()
    
    current_conversion_rate = (len(current_orders) / page_views * 100) if page_views > 0 else 0
    previous_conversion_rate = (len(previous_orders) / previous_page_views * 100) if previous_page_views > 0 else 0
    
    conversion_growth = calculate_growth(current_conversion_rate, previous_conversion_rate)
    
    # Get sales data (for charts)
    sales_data = get_sales_data(db, user_id, start_date, now)
    
    # Get top products
    top_products = get_top_products(db, user_id, 5, start_date)
    
    # Get recent activity
    recent_activity = get_recent_activity(db, user_id, 5)
    
    # Get supplier performance
    supplier_performance = get_supplier_performance(db, user_id, start_date)
    
    return {
        "total_revenue": user_metrics.total_revenue,
        "total_orders": user_metrics.total_orders,
        "total_products": user_metrics.total_products,
        "conversion_rate": user_metrics.conversion_rate,
        "revenue_growth": revenue_growth,
        "orders_growth": orders_growth,
        "products_growth": products_growth,
        "conversion_growth": conversion_growth,
        "sales_data": sales_data,
        "top_products": top_products,
        "recent_activity": recent_activity,
        "supplier_performance": supplier_performance
    }

def calculate_growth(current: float, previous: float) -> float:
    """
    Calculate growth percentage
    """
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    
    return ((current - previous) / previous) * 100

def get_sales_data(db: Session, user_id: str, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
    """
    Get sales data for charts
    """
    # This would typically involve complex SQL queries to aggregate data by day/week/month
    # For simplicity, we'll return mock data
    
    # In a real implementation, you would query the database for orders in the date range
    # and aggregate them by day/week/month
    
    # Example:
    # result = db.query(
    #     func.date_trunc('month', Order.created_at).label('month'),
    #     func.sum(Order.total_amount).label('revenue'),
    #     func.count(Order.id).label('orders')
    # ).filter(
    #     Order.user_id == user_id,
    #     Order.created_at >= start_date,
    #     Order.created_at <= end_date
    # ).group_by(
    #     func.date_trunc('month', Order.created_at)
    # ).order_by(
    #     func.date_trunc('month', Order.created_at)
    # ).all()
    
    # For now, return mock data
    return [
        {"month": "Jan", "revenue": 18500, "orders": 245, "profit": 8500},
        {"month": "Fév", "revenue": 22300, "orders": 298, "profit": 11200},
        {"month": "Mar", "revenue": 19800, "orders": 267, "profit": 9400},
        {"month": "Avr", "revenue": 25600, "orders": 342, "profit": 13800},
        {"month": "Mai", "revenue": 28900, "orders": 389, "profit": 16200},
        {"month": "Jun", "revenue": 32400, "orders": 435, "profit": 19800}
    ]

def get_top_products(db: Session, user_id: str, limit: int, start_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
    """
    Get top performing products
    """
    # In a real implementation, you would join the products and orders tables
    # and aggregate by product to find the top performers
    
    # For now, return mock data
    return [
        {"name": "Montre Connectée Sport Pro Max", "sales": 1247, "revenue": 112023.53, "margin": 98.5},
        {"name": "Écouteurs Bluetooth Premium ANC", "sales": 892, "revenue": 71351.08, "margin": 146.1},
        {"name": "Coque iPhone 15 Pro Transparente", "sales": 2156, "revenue": 53874.44, "margin": 185.6},
        {"name": "Chargeur Sans Fil Rapide 15W", "sales": 743, "revenue": 25992.57, "margin": 184.5},
        {"name": "Lampe LED Bureau Pliable", "sales": 456, "revenue": 22795.44, "margin": 164.5}
    ]

def get_recent_activity(db: Session, user_id: str, limit: int) -> List[Dict[str, Any]]:
    """
    Get recent user activity
    """
    # Query recent events
    events = db.query(models.AnalyticsEvent).filter(
        models.AnalyticsEvent.user_id == user_id
    ).order_by(
        models.AnalyticsEvent.created_at.desc()
    ).limit(limit).all()
    
    # Transform events to activity items
    activity = []
    for event in events:
        item = {
            "id": event.id,
            "action": event.event_type,
            "time": format_time_ago(event.created_at),
            "type": map_event_type_to_activity_type(event.event_type)
        }
        
        # Add product info if available
        if event.event_data and "product_id" in event.event_data:
            product = db.query(Product).filter(Product.id == event.event_data["product_id"]).first()
            if product:
                item["product"] = product.title
        
        activity.append(item)
    
    # If we don't have enough real events, add some mock data
    if len(activity) < limit:
        mock_activity = [
            {"id": "1", "action": "Nouveau produit importé", "product": "Montre Sport Elite", "time": "2 min", "type": "import"},
            {"id": "2", "action": "Commande trackée", "product": "Écouteurs Pro Max", "time": "5 min", "type": "order"},
            {"id": "3", "action": "SEO optimisé", "product": "Coque Premium iPhone", "time": "10 min", "type": "seo"},
            {"id": "4", "action": "Review générée", "product": "Chargeur Rapide", "time": "15 min", "type": "review"},
            {"id": "5", "action": "Stock faible détecté", "product": "Lampe LED Bureau", "time": "1h", "type": "alert"}
        ]
        
        # Add mock data to fill the limit
        for i in range(limit - len(activity)):
            if i < len(mock_activity):
                activity.append(mock_activity[i])
    
    return activity

def get_supplier_performance(db: Session, user_id: str, start_date: Optional[datetime] = None) -> List[Dict[str, Any]]:
    """
    Get supplier performance metrics
    """
    # In a real implementation, you would join the suppliers and orders tables
    # and calculate performance metrics
    
    # For now, return mock data
    return [
        {"name": "AliExpress", "orders": 1247, "rating": 4.8, "onTime": 94},
        {"name": "BigBuy", "orders": 892, "rating": 4.9, "onTime": 98},
        {"name": "Eprolo", "orders": 743, "rating": 4.6, "onTime": 92},
        {"name": "Printify", "orders": 456, "rating": 4.7, "onTime": 95},
        {"name": "Spocket", "orders": 234, "rating": 4.5, "onTime": 90}
    ]

def get_product_performance(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    sort_by: str, 
    sort_order: str
) -> List[models.ProductPerformance]:
    """
    Get performance metrics for user's products
    """
    query = db.query(models.ProductPerformance).filter(
        models.ProductPerformance.user_id == user_id
    )
    
    # Apply sorting
    if sort_order.lower() == "asc":
        query = query.order_by(asc(getattr(models.ProductPerformance, sort_by)))
    else:
        query = query.order_by(desc(getattr(models.ProductPerformance, sort_by)))
    
    # Apply pagination
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_trends(
    db: Session, 
    user_id: str, 
    metric: str, 
    start_date: Optional[datetime], 
    interval: str
) -> Dict[str, Any]:
    """
    Get trend data for a specific metric
    """
    # This would typically involve complex SQL queries to aggregate data by the specified interval
    # For simplicity, we'll return mock data
    
    # Mock data for different metrics
    if metric == "revenue":
        data = [
            {"date": "2024-01-01", "value": 1250.45},
            {"date": "2024-01-02", "value": 1345.78},
            {"date": "2024-01-03", "value": 1100.23},
            {"date": "2024-01-04", "value": 1420.56},
            {"date": "2024-01-05", "value": 1550.89},
            {"date": "2024-01-06", "value": 1680.12},
            {"date": "2024-01-07", "value": 1890.34}
        ]
        total = sum(point["value"] for point in data)
        change = 15.5  # Percentage change
    elif metric == "orders":
        data = [
            {"date": "2024-01-01", "value": 25},
            {"date": "2024-01-02", "value": 32},
            {"date": "2024-01-03", "value": 28},
            {"date": "2024-01-04", "value": 35},
            {"date": "2024-01-05", "value": 42},
            {"date": "2024-01-06", "value": 38},
            {"date": "2024-01-07", "value": 45}
        ]
        total = sum(point["value"] for point in data)
        change = 12.3  # Percentage change
    elif metric == "products":
        data = [
            {"date": "2024-01-01", "value": 5},
            {"date": "2024-01-02", "value": 8},
            {"date": "2024-01-03", "value": 3},
            {"date": "2024-01-04", "value": 7},
            {"date": "2024-01-05", "value": 10},
            {"date": "2024-01-06", "value": 6},
            {"date": "2024-01-07", "value": 9}
        ]
        total = sum(point["value"] for point in data)
        change = 8.7  # Percentage change
    else:  # visitors
        data = [
            {"date": "2024-01-01", "value": 120},
            {"date": "2024-01-02", "value": 145},
            {"date": "2024-01-03", "value": 135},
            {"date": "2024-01-04", "value": 160},
            {"date": "2024-01-05", "value": 180},
            {"date": "2024-01-06", "value": 165},
            {"date": "2024-01-07", "value": 195}
        ]
        total = sum(point["value"] for point in data)
        change = 18.2  # Percentage change
    
    return {
        "metric": metric,
        "interval": interval,
        "data": data,
        "total": total,
        "change_percentage": change
    }

def get_user_metrics(db: Session, user_id: str) -> models.UserMetrics:
    """
    Get aggregated metrics for a user
    """
    metrics = db.query(models.UserMetrics).filter(models.UserMetrics.user_id == user_id).first()
    
    if not metrics:
        metrics = models.UserMetrics(
            id=str(uuid.uuid4()),
            user_id=user_id
        )
        db.add(metrics)
        db.commit()
        db.refresh(metrics)
    
    return metrics

def export_analytics(
    db: Session, 
    user_id: str, 
    start_date: datetime, 
    end_date: datetime, 
    format: str
) -> Dict[str, Any]:
    """
    Export analytics data
    """
    # In a real implementation, you would generate a file with the requested data
    # and return a URL to download it
    
    # For now, return a mock response
    return {
        "url": f"https://api.dropflow.pro/exports/analytics_{user_id}_{int(datetime.utcnow().timestamp())}.{format}",
        "expires_at": datetime.utcnow() + timedelta(days=7),
        "format": format
    }

def map_event_type_to_activity_type(event_type: str) -> str:
    """
    Map event type to activity type
    """
    mapping = {
        "product_import": "import",
        "product_view": "view",
        "product_edit": "edit",
        "order_created": "order",
        "order_updated": "order",
        "seo_optimization": "seo",
        "review_generated": "review",
        "stock_alert": "alert"
    }
    
    return mapping.get(event_type, "other")

def format_time_ago(timestamp: datetime) -> str:
    """
    Format timestamp as time ago
    """
    now = datetime.utcnow()
    diff = now - timestamp
    
    if diff.days > 0:
        return f"{diff.days}d"
    
    hours = diff.seconds // 3600
    if hours > 0:
        return f"{hours}h"
    
    minutes = (diff.seconds % 3600) // 60
    if minutes > 0:
        return f"{minutes}min"
    
    return "just now"