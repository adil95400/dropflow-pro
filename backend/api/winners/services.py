from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import uuid
import logging
import json
import random

from . import models, schemas
from ..products.models import Product
from ...clients.openai import OpenAIClient

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = OpenAIClient()

def get_winner_products(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    category: Optional[str] = None,
    competition_level: Optional[str] = None,
    min_score: Optional[int] = None,
    sort_by: str = "winner_score",
    sort_order: str = "desc"
) -> List[models.WinnerProduct]:
    """
    Get winner products for a user
    """
    query = db.query(models.WinnerProduct).filter(models.WinnerProduct.user_id == user_id)
    
    if category:
        query = query.filter(models.WinnerProduct.category == category)
    
    if competition_level:
        query = query.filter(models.WinnerProduct.competition_level == competition_level)
    
    if min_score is not None:
        query = query.filter(models.WinnerProduct.winner_score >= min_score)
    
    # Apply sorting
    if sort_order.lower() == "asc":
        query = query.order_by(asc(getattr(models.WinnerProduct, sort_by)))
    else:
        query = query.order_by(desc(getattr(models.WinnerProduct, sort_by)))
    
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_winner_product(db: Session, product_id: str, user_id: str) -> Optional[models.WinnerProduct]:
    """
    Get a winner product by ID
    """
    return db.query(models.WinnerProduct).filter(
        models.WinnerProduct.id == product_id,
        models.WinnerProduct.user_id == user_id
    ).first()

def create_winner_product(db: Session, product: schemas.WinnerProductCreate, user_id: str) -> models.WinnerProduct:
    """
    Create a new winner product
    """
    # Create winner product
    db_product = models.WinnerProduct(
        id=str(uuid.uuid4()),
        user_id=user_id,
        product_id=product.product_id,
        title=product.title,
        description=product.description,
        price=product.price,
        images=product.images,
        supplier=product.supplier,
        category=product.category,
        winner_score=product.winner_score,
        reasons=product.reasons,
        market_trends=product.market_trends,
        competition_level=product.competition_level,
        profit_potential=product.profit_potential,
        social_proof=product.social_proof.dict() if product.social_proof else None,
        ad_spend=product.ad_spend.dict() if product.ad_spend else None,
        metadata=product.metadata
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

def update_winner_product(db: Session, product_id: str, product: schemas.WinnerProductUpdate) -> models.WinnerProduct:
    """
    Update a winner product
    """
    db_product = db.query(models.WinnerProduct).filter(models.WinnerProduct.id == product_id).first()
    if not db_product:
        raise ValueError(f"Winner product not found: {product_id}")
    
    # Update fields if provided
    if product.title is not None:
        db_product.title = product.title
    
    if product.description is not None:
        db_product.description = product.description
    
    if product.price is not None:
        db_product.price = product.price
    
    if product.images is not None:
        db_product.images = product.images
    
    if product.supplier is not None:
        db_product.supplier = product.supplier
    
    if product.category is not None:
        db_product.category = product.category
    
    if product.winner_score is not None:
        db_product.winner_score = product.winner_score
    
    if product.reasons is not None:
        db_product.reasons = product.reasons
    
    if product.market_trends is not None:
        db_product.market_trends = product.market_trends
    
    if product.competition_level is not None:
        db_product.competition_level = product.competition_level
    
    if product.profit_potential is not None:
        db_product.profit_potential = product.profit_potential
    
    if product.social_proof is not None:
        db_product.social_proof = product.social_proof.dict()
    
    if product.ad_spend is not None:
        db_product.ad_spend = product.ad_spend.dict()
    
    if product.metadata is not None:
        db_product.metadata = product.metadata
    
    db_product.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_product)
    
    return db_product

def delete_winner_product(db: Session, product_id: str) -> None:
    """
    Delete a winner product
    """
    db_product = db.query(models.WinnerProduct).filter(models.WinnerProduct.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()

def get_market_trends(
    db: Session, 
    user_id: str, 
    limit: int, 
    offset: int, 
    category: Optional[str] = None,
    include_public: bool = True
) -> List[models.MarketTrend]:
    """
    Get market trends
    """
    if include_public:
        # Get both user's trends and public trends
        query = db.query(models.MarketTrend).filter(
            (models.MarketTrend.user_id == user_id) | (models.MarketTrend.is_public == True)
        )
    else:
        # Get only user's trends
        query = db.query(models.MarketTrend).filter(models.MarketTrend.user_id == user_id)
    
    if category:
        query = query.filter(models.MarketTrend.category == category)
    
    query = query.order_by(models.MarketTrend.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_market_trend(db: Session, trend_id: str, user_id: str) -> Optional[models.MarketTrend]:
    """
    Get a market trend by ID
    """
    return db.query(models.MarketTrend).filter(
        models.MarketTrend.id == trend_id,
        models.MarketTrend.user_id == user_id
    ).first()

def get_public_market_trend(db: Session, trend_id: str) -> Optional[models.MarketTrend]:
    """
    Get a public market trend by ID
    """
    return db.query(models.MarketTrend).filter(
        models.MarketTrend.id == trend_id,
        models.MarketTrend.is_public == True
    ).first()

def create_market_trend(db: Session, trend: schemas.MarketTrendCreate, user_id: str) -> models.MarketTrend:
    """
    Create a new market trend
    """
    db_trend = models.MarketTrend(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=trend.name,
        description=trend.description,
        category=trend.category,
        growth_rate=trend.growth_rate,
        competition_level=trend.competition_level,
        opportunity_score=trend.opportunity_score,
        related_keywords=trend.related_keywords,
        seasonal=trend.seasonal,
        season_start=trend.season_start,
        season_end=trend.season_end,
        source=trend.source,
        is_public=trend.is_public,
        metadata=trend.metadata
    )
    
    db.add(db_trend)
    db.commit()
    db.refresh(db_trend)
    
    return db_trend

def update_market_trend(db: Session, trend_id: str, trend: schemas.MarketTrendUpdate) -> models.MarketTrend:
    """
    Update a market trend
    """
    db_trend = db.query(models.MarketTrend).filter(models.MarketTrend.id == trend_id).first()
    if not db_trend:
        raise ValueError(f"Market trend not found: {trend_id}")
    
    # Update fields if provided
    if trend.name is not None:
        db_trend.name = trend.name
    
    if trend.description is not None:
        db_trend.description = trend.description
    
    if trend.category is not None:
        db_trend.category = trend.category
    
    if trend.growth_rate is not None:
        db_trend.growth_rate = trend.growth_rate
    
    if trend.competition_level is not None:
        db_trend.competition_level = trend.competition_level
    
    if trend.opportunity_score is not None:
        db_trend.opportunity_score = trend.opportunity_score
    
    if trend.related_keywords is not None:
        db_trend.related_keywords = trend.related_keywords
    
    if trend.seasonal is not None:
        db_trend.seasonal = trend.seasonal
    
    if trend.season_start is not None:
        db_trend.season_start = trend.season_start
    
    if trend.season_end is not None:
        db_trend.season_end = trend.season_end
    
    if trend.source is not None:
        db_trend.source = trend.source
    
    if trend.is_public is not None:
        db_trend.is_public = trend.is_public
    
    if trend.metadata is not None:
        db_trend.metadata = trend.metadata
    
    db_trend.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_trend)
    
    return db_trend

def delete_market_trend(db: Session, trend_id: str) -> None:
    """
    Delete a market trend
    """
    db_trend = db.query(models.MarketTrend).filter(models.MarketTrend.id == trend_id).first()
    if db_trend:
        db.delete(db_trend)
        db.commit()

def create_winner_detection_job(db: Session, detection: schemas.WinnerDetectionCreate, user_id: str) -> models.WinnerDetectionJob:
    """
    Create a new winner detection job
    """
    # Determine products to analyze
    product_ids = []
    
    if detection.all_products:
        # Get all user's products
        products = db.query(Product).filter(Product.user_id == user_id).all()
        product_ids = [product.id for product in products]
    elif detection.product_ids:
        # Use specified product IDs
        product_ids = detection.product_ids
    
    # Create job
    db_job = models.WinnerDetectionJob(
        id=str(uuid.uuid4()),
        user_id=user_id,
        status="pending",
        total_products=len(product_ids),
        processed_products=0,
        winners_found=0,
        settings={
            "product_ids": product_ids,
            "detection_settings": detection.settings.dict() if detection.settings else {}
        }
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    return db_job

def get_winner_detection_job(db: Session, job_id: str, user_id: str) -> Optional[models.WinnerDetectionJob]:
    """
    Get a winner detection job by ID
    """
    return db.query(models.WinnerDetectionJob).filter(
        models.WinnerDetectionJob.id == job_id,
        models.WinnerDetectionJob.user_id == user_id
    ).first()

def process_winner_detection_job(db: Session, job_id: str) -> None:
    """
    Process a winner detection job
    """
    job = db.query(models.WinnerDetectionJob).filter(models.WinnerDetectionJob.id == job_id).first()
    if not job:
        logger.error(f"Winner detection job not found: {job_id}")
        return
    
    # Update job status
    job.status = "processing"
    job.started_at = datetime.utcnow()
    db.commit()
    
    try:
        # Get settings
        settings = job.settings.get("detection_settings", {}) if job.settings else {}
        product_ids = job.settings.get("product_ids", []) if job.settings else []
        
        # Process each product
        for product_id in product_ids:
            try:
                # Get product
                product = db.query(Product).filter(Product.id == product_id).first()
                if not product:
                    logger.warning(f"Product not found: {product_id}")
                    continue
                
                # Apply category filter if specified
                if settings.get("categories") and product.category not in settings.get("categories"):
                    continue
                
                # Apply supplier filter if specified
                if settings.get("suppliers") and product.supplier not in settings.get("suppliers"):
                    continue
                
                # Analyze product
                analysis = analyze_product(product, settings)
                
                # Create detection result
                result = models.WinnerDetectionResult(
                    id=str(uuid.uuid4()),
                    job_id=job.id,
                    product_id=product.id,
                    is_winner=analysis["is_winner"],
                    score=analysis["score"],
                    analysis=analysis["analysis"],
                    reasons=analysis["reasons"]
                )
                
                db.add(result)
                db.commit()
                
                # If it's a winner and auto-create is enabled, create winner product
                if analysis["is_winner"] and settings.get("auto_create_winners", True):
                    winner_product = create_winner_product_from_analysis(db, product, analysis, job.user_id)
                    
                    # Update result with winner product ID
                    result.winner_product_id = winner_product.id
                    db.commit()
                    
                    # Increment winners found
                    job.winners_found += 1
                
                # Increment processed products
                job.processed_products += 1
                db.commit()
                
            except Exception as e:
                logger.error(f"Error processing product {product_id}: {e}")
                
                # Increment processed products
                job.processed_products += 1
                db.commit()
        
        # Update job status
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error processing winner detection job {job_id}: {e}")
        
        # Update job status
        job.status = "failed"
        job.error_message = str(e)
        job.completed_at = datetime.utcnow()
        db.commit()

def analyze_product(product: Product, settings: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze a product for winner potential
    """
    # In a real implementation, this would use AI to analyze the product
    # For now, we'll use a simple heuristic
    
    # Calculate base score
    base_score = 50
    
    # Adjust score based on product attributes
    if product.price and product.original_price:
        # Calculate profit margin
        margin = (product.price - product.original_price) / product.original_price * 100
        
        # Adjust score based on margin
        if margin > 200:
            base_score += 20
        elif margin > 150:
            base_score += 15
        elif margin > 100:
            base_score += 10
        elif margin > 50:
            base_score += 5
        
        # Check against min profit potential setting
        min_profit_potential = settings.get("min_profit_potential")
        if min_profit_potential is not None and margin < min_profit_potential:
            base_score -= 20
    
    # Adjust score based on category
    trending_categories = ["Électronique", "Smart Home", "Fitness", "Beauty", "Eco-friendly"]
    if product.category in trending_categories:
        base_score += 10
    
    # Adjust score based on supplier
    premium_suppliers = ["BigBuy", "Spocket"]
    if product.supplier in premium_suppliers:
        base_score += 5
    
    # Randomize a bit to simulate AI variability
    base_score += random.randint(-5, 5)
    
    # Ensure score is within bounds
    score = max(0, min(100, base_score))
    
    # Determine competition level
    if score >= 80:
        competition_level = "low"
    elif score >= 60:
        competition_level = "medium"
    else:
        competition_level = "high"
    
    # Check against max competition level setting
    max_competition_level = settings.get("max_competition_level")
    if max_competition_level and competition_level_value(competition_level) > competition_level_value(max_competition_level):
        score -= 10
    
    # Generate reasons
    reasons = generate_reasons(product, score, competition_level)
    
    # Determine if it's a winner
    min_score = settings.get("min_score", 70)
    is_winner = score >= min_score
    
    # Generate analysis text
    analysis = generate_analysis(product, score, competition_level, is_winner)
    
    return {
        "is_winner": is_winner,
        "score": score,
        "analysis": analysis,
        "reasons": reasons,
        "competition_level": competition_level
    }

def competition_level_value(level: str) -> int:
    """
    Convert competition level to numeric value for comparison
    """
    if level == "low":
        return 1
    elif level == "medium":
        return 2
    else:  # high
        return 3

def generate_reasons(product: Product, score: int, competition_level: str) -> List[str]:
    """
    Generate reasons for winner score
    """
    reasons = []
    
    # Add reasons based on score and product attributes
    if score >= 80:
        reasons.append("Excellent profit margin")
        reasons.append("High demand in current market")
        reasons.append("Low competition for this specific product")
    elif score >= 60:
        reasons.append("Good profit margin")
        reasons.append("Steady demand in market")
        reasons.append("Moderate competition")
    else:
        reasons.append("Acceptable profit margin")
        reasons.append("Niche market with specific demand")
        reasons.append("Higher competition in this category")
    
    # Add product-specific reasons
    if product.price and product.original_price:
        margin = (product.price - product.original_price) / product.original_price * 100
        reasons.append(f"Profit margin of {margin:.1f}%")
    
    if product.category:
        reasons.append(f"Growing demand in {product.category} category")
    
    if product.supplier:
        reasons.append(f"Reliable supplier ({product.supplier})")
    
    # Add some randomized reasons to simulate AI variability
    potential_reasons = [
        "Strong social media potential",
        "Excellent for targeted Facebook ads",
        "Good potential for repeat customers",
        "Solves a common problem",
        "Trending on TikTok",
        "Seasonal demand increase expected",
        "Low shipping cost relative to price",
        "High perceived value",
        "Unique selling proposition",
        "Easy to market with visual content"
    ]
    
    # Add 2-3 random reasons
    num_random = random.randint(2, 3)
    random_reasons = random.sample(potential_reasons, num_random)
    reasons.extend(random_reasons)
    
    return reasons

def generate_analysis(product: Product, score: int, competition_level: str, is_winner: bool) -> str:
    """
    Generate analysis text
    """
    if is_winner:
        if score >= 90:
            return f"Ce produit a un potentiel exceptionnel avec un score de {score}/100. La combinaison d'une marge élevée, d'une demande forte et d'une concurrence {competition_level} en fait un excellent candidat pour votre boutique. Nous recommandons de l'ajouter immédiatement à votre catalogue et de commencer à le promouvoir."
        elif score >= 80:
            return f"Ce produit montre un très bon potentiel avec un score de {score}/100. Il présente une bonne marge bénéficiaire et une demande stable dans un marché à concurrence {competition_level}. Nous recommandons de l'ajouter à votre catalogue."
        elif score >= 70:
            return f"Ce produit a un bon potentiel avec un score de {score}/100. Il pourrait bien performer dans votre boutique malgré une concurrence {competition_level}. Considérez l'ajouter à votre catalogue après une analyse plus approfondie du marché."
    else:
        if score >= 60:
            return f"Ce produit a un potentiel modéré avec un score de {score}/100. Bien qu'il présente certains aspects positifs, la concurrence {competition_level} et d'autres facteurs limitent son potentiel. Vous pourriez l'envisager pour diversifier votre catalogue, mais il n'est pas prioritaire."
        elif score >= 40:
            return f"Ce produit a un potentiel limité avec un score de {score}/100. La concurrence {competition_level} et une marge bénéficiaire réduite en font un choix risqué. Nous recommandons de chercher des alternatives plus prometteuses."
        else:
            return f"Ce produit n'est pas recommandé avec un score de {score}/100. La combinaison d'une faible marge, d'une demande incertaine et d'une concurrence {competition_level} suggère qu'il serait difficile de le vendre avec profit."

def create_winner_product_from_analysis(
    db: Session, 
    product: Product, 
    analysis: Dict[str, Any], 
    user_id: str
) -> models.WinnerProduct:
    """
    Create a winner product from analysis results
    """
    # Calculate profit potential
    profit_potential = None
    if product.price is not None and product.original_price is not None and product.original_price > 0:
        profit_potential = (product.price - product.original_price) / product.original_price * 100
    
    # Create mock social proof
    social_proof = {
        "reviews": random.randint(100, 2000),
        "rating": round(random.uniform(4.0, 4.9), 1),
        "orders": random.randint(500, 5000)
    }
    
    # Create mock ad spend
    ad_spend = {
        "facebook": random.randint(2000, 10000),
        "google": random.randint(1000, 5000),
        "tiktok": random.randint(3000, 15000)
    }
    
    # Create winner product
    db_product = models.WinnerProduct(
        id=str(uuid.uuid4()),
        user_id=user_id,
        product_id=product.id,
        title=product.title,
        description=product.description,
        price=product.price,
        images=product.images,
        supplier=product.supplier,
        category=product.category,
        winner_score=analysis["score"],
        reasons=analysis["reasons"],
        market_trends=generate_market_trends(product.category),
        competition_level=analysis["competition_level"],
        profit_potential=profit_potential,
        social_proof=social_proof,
        ad_spend=ad_spend,
        metadata={
            "analysis": analysis["analysis"],
            "detection_date": datetime.utcnow().isoformat()
        }
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

def generate_market_trends(category: Optional[str]) -> List[str]:
    """
    Generate market trends based on category
    """
    # Define trends by category
    category_trends = {
        "Électronique": [
            "Smart home devices",
            "Wearable tech",
            "Wireless audio",
            "Mobile accessories"
        ],
        "Audio": [
            "Noise cancellation",
            "True wireless earbuds",
            "Hi-Fi audio",
            "Gaming audio"
        ],
        "Accessoires": [
            "Phone protection",
            "Device customization",
            "Tech organization",
            "Wireless charging"
        ],
        "Maison": [
            "Home office",
            "Smart lighting",
            "Kitchen gadgets",
            "Space-saving solutions"
        ],
        "Mode": [
            "Sustainable fashion",
            "Athleisure",
            "Minimalist design",
            "Customizable accessories"
        ],
        "Sport": [
            "Home fitness",
            "Outdoor activities",
            "Recovery tools",
            "Smart training"
        ],
        "Beauté": [
            "Skincare tech",
            "Sustainable beauty",
            "DIY beauty",
            "Men's grooming"
        ]
    }
    
    # Get trends for the category or use general trends
    if category and category in category_trends:
        trends = category_trends[category]
    else:
        # Combine all trends
        trends = []
        for cat_trends in category_trends.values():
            trends.extend(cat_trends)
    
    # Select 3-5 random trends
    num_trends = random.randint(3, 5)
    selected_trends = random.sample(trends, min(num_trends, len(trends)))
    
    return selected_trends

def analyze_product_winner_potential(db: Session, product_id: str, user_id: str) -> Dict[str, Any]:
    """
    Analyze a product for winner potential
    """
    # Get product
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.user_id == user_id
    ).first()
    
    if not product:
        raise ValueError(f"Product not found: {product_id}")
    
    # Analyze product
    analysis = analyze_product(product, {})
    
    # If it's a winner, create or update winner product
    winner_product_id = None
    if analysis["is_winner"]:
        # Check if winner product already exists
        existing_winner = db.query(models.WinnerProduct).filter(
            models.WinnerProduct.product_id == product.id,
            models.WinnerProduct.user_id == user_id
        ).first()
        
        if existing_winner:
            # Update existing winner
            existing_winner.winner_score = analysis["score"]
            existing_winner.reasons = analysis["reasons"]
            existing_winner.competition_level = analysis["competition_level"]
            existing_winner.updated_at = datetime.utcnow()
            db.commit()
            winner_product_id = existing_winner.id
        else:
            # Create new winner product
            winner_product = create_winner_product_from_analysis(db, product, analysis, user_id)
            winner_product_id = winner_product.id
    
    return {
        "product_id": product.id,
        "is_winner": analysis["is_winner"],
        "score": analysis["score"],
        "analysis": analysis["analysis"],
        "reasons": analysis["reasons"],
        "winner_product_id": winner_product_id
    }

def detect_market_trends(db: Session, detection: schemas.TrendDetectionCreate, user_id: str) -> List[models.MarketTrend]:
    """
    Detect market trends
    """
    # In a real implementation, this would use AI to analyze market data
    # For now, we'll return mock trends
    
    trends = []
    
    # Generate trends based on niche or categories
    if detection.niche:
        trends.extend(generate_trends_for_niche(detection.niche, detection.max_results or 5))
    
    if detection.categories:
        for category in detection.categories:
            trends.extend(generate_trends_for_category(category, (detection.max_results or 10) // len(detection.categories)))
    
    if detection.keywords:
        for keyword in detection.keywords:
            trends.extend(generate_trends_for_keyword(keyword, (detection.max_results or 10) // len(detection.keywords)))
    
    # If no specific inputs, generate general trends
    if not detection.niche and not detection.categories and not detection.keywords:
        trends.extend(generate_general_trends(detection.max_results or 10))
    
    # Create trend objects
    db_trends = []
    for trend_data in trends:
        db_trend = models.MarketTrend(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=trend_data["name"],
            description=trend_data["description"],
            category=trend_data["category"],
            growth_rate=trend_data["growth_rate"],
            competition_level=trend_data["competition_level"],
            opportunity_score=trend_data["opportunity_score"],
            related_keywords=trend_data["related_keywords"],
            seasonal=trend_data["seasonal"],
            season_start=trend_data["season_start"],
            season_end=trend_data["season_end"],
            source="ai_detection",
            is_public=False
        )
        
        db.add(db_trend)
        db.commit()
        db.refresh(db_trend)
        
        db_trends.append(db_trend)
    
    return db_trends

def generate_trends_for_niche(niche: str, count: int) -> List[Dict[str, Any]]:
    """
    Generate trends for a specific niche
    """
    # This would use AI to generate trends
    # For now, return mock data
    
    trends = []
    
    for i in range(count):
        trend = {
            "name": f"Trend {i+1} for {niche}",
            "description": f"This is a trending opportunity in the {niche} niche with significant growth potential.",
            "category": niche,
            "growth_rate": random.uniform(10.0, 50.0),
            "competition_level": random.choice(["low", "medium", "high"]),
            "opportunity_score": random.randint(60, 95),
            "related_keywords": [f"{niche} trend", f"{niche} product", f"best {niche}"],
            "seasonal": random.choice([True, False]),
            "season_start": "January" if random.choice([True, False]) else None,
            "season_end": "March" if random.choice([True, False]) else None
        }
        
        trends.append(trend)
    
    return trends

def generate_trends_for_category(category: str, count: int) -> List[Dict[str, Any]]:
    """
    Generate trends for a specific category
    """
    # Similar to generate_trends_for_niche
    return generate_trends_for_niche(category, count)

def generate_trends_for_keyword(keyword: str, count: int) -> List[Dict[str, Any]]:
    """
    Generate trends for a specific keyword
    """
    # Similar to generate_trends_for_niche
    return generate_trends_for_niche(keyword, count)

def generate_general_trends(count: int) -> List[Dict[str, Any]]:
    """
    Generate general market trends
    """
    # Define some general trend templates
    trend_templates = [
        {
            "name": "Produits Écologiques et Durables",
            "description": "La demande pour des produits respectueux de l'environnement continue de croître, avec un accent particulier sur les emballages réduits et les matériaux recyclables.",
            "category": "Éco-responsable",
            "growth_rate": 35.0,
            "competition_level": "medium",
            "opportunity_score": 85,
            "related_keywords": ["eco-friendly", "sustainable", "zero waste", "recyclable"],
            "seasonal": False
        },
        {
            "name": "Accessoires Tech Minimalistes",
            "description": "Les accessoires technologiques au design épuré et minimaliste gagnent en popularité, particulièrement dans les segments premium.",
            "category": "Électronique",
            "growth_rate": 28.0,
            "competition_level": "medium",
            "opportunity_score": 80,
            "related_keywords": ["minimalist tech", "clean design", "premium accessories"],
            "seasonal": False
        },
        {
            "name": "Équipement de Fitness à Domicile",
            "description": "Suite à la pandémie, l'équipement de fitness compact pour la maison reste très demandé, avec une préférence pour les solutions multifonctionnelles.",
            "category": "Fitness",
            "growth_rate": 42.0,
            "competition_level": "high",
            "opportunity_score": 75,
            "related_keywords": ["home gym", "compact fitness", "workout equipment"],
            "seasonal": True,
            "season_start": "January",
            "season_end": "March"
        },
        {
            "name": "Produits de Bien-être Mental",
            "description": "Les produits axés sur la réduction du stress et l'amélioration du bien-être mental connaissent une forte croissance.",
            "category": "Bien-être",
            "growth_rate": 45.0,
            "competition_level": "low",
            "opportunity_score": 90,
            "related_keywords": ["mental health", "stress relief", "mindfulness", "wellness"],
            "seasonal": False
        },
        {
            "name": "Gadgets de Cuisine Intelligents",
            "description": "Les petits appareils de cuisine connectés qui simplifient la préparation des repas sont de plus en plus populaires.",
            "category": "Maison",
            "growth_rate": 32.0,
            "competition_level": "medium",
            "opportunity_score": 78,
            "related_keywords": ["smart kitchen", "cooking gadgets", "kitchen tech"],
            "seasonal": True,
            "season_start": "November",
            "season_end": "December"
        },
        {
            "name": "Accessoires pour Animaux de Compagnie Design",
            "description": "Les accessoires pour animaux de compagnie qui allient fonctionnalité et esthétique moderne connaissent une forte demande.",
            "category": "Animaux",
            "growth_rate": 38.0,
            "competition_level": "low",
            "opportunity_score": 88,
            "related_keywords": ["pet accessories", "designer pet", "modern pet products"],
            "seasonal": False
        },
        {
            "name": "Vêtements Techniques Polyvalents",
            "description": "Les vêtements qui combinent technologie et polyvalence pour différentes activités sont en forte croissance.",
            "category": "Mode",
            "growth_rate": 30.0,
            "competition_level": "high",
            "opportunity_score": 72,
            "related_keywords": ["technical clothing", "versatile apparel", "multi-purpose clothing"],
            "seasonal": True,
            "season_start": "September",
            "season_end": "November"
        },
        {
            "name": "Outils de Productivité Personnelle",
            "description": "Les gadgets et accessoires qui aident à l'organisation et à la productivité personnelle sont très recherchés.",
            "category": "Bureau",
            "growth_rate": 25.0,
            "competition_level": "medium",
            "opportunity_score": 76,
            "related_keywords": ["productivity tools", "organization gadgets", "desk accessories"],
            "seasonal": True,
            "season_start": "August",
            "season_end": "September"
        },
        {
            "name": "Produits de Beauté Clean & Vegan",
            "description": "Les produits de beauté sans ingrédients controversés et certifiés vegan connaissent une croissance exponentielle.",
            "category": "Beauté",
            "growth_rate": 48.0,
            "competition_level": "high",
            "opportunity_score": 82,
            "related_keywords": ["clean beauty", "vegan cosmetics", "natural skincare"],
            "seasonal": False
        },
        {
            "name": "Accessoires de Voyage Compacts",
            "description": "Les accessoires de voyage multifonctionnels et compacts qui facilitent les déplacements sont très populaires.",
            "category": "Voyage",
            "growth_rate": 22.0,
            "competition_level": "medium",
            "opportunity_score": 74,
            "related_keywords": ["travel accessories", "compact luggage", "travel gadgets"],
            "seasonal": True,
            "season_start": "May",
            "season_end": "August"
        }
    ]
    
    # Select random trends
    selected_trends = random.sample(trend_templates, min(count, len(trend_templates)))
    
    # Add some randomization to make each trend unique
    for trend in selected_trends:
        trend["growth_rate"] += random.uniform(-5.0, 5.0)
        trend["opportunity_score"] += random.randint(-5, 5)
        trend["opportunity_score"] = max(0, min(100, trend["opportunity_score"]))
    
    return selected_trends

def get_winner_stats(db: Session, user_id: str) -> Dict[str, Any]:
    """
    Get winner statistics
    """
    # Get total winners
    total_winners = db.query(models.WinnerProduct).filter(models.WinnerProduct.user_id == user_id).count()
    
    # Get average score
    average_score_result = db.query(func.avg(models.WinnerProduct.winner_score)).filter(
        models.WinnerProduct.user_id == user_id
    ).scalar()
    average_score = float(average_score_result) if average_score_result else 0
    
    # Get winners by competition level
    by_competition_level = {}
    for level in models.CompetitionLevel:
        count = db.query(models.WinnerProduct).filter(
            models.WinnerProduct.user_id == user_id,
            models.WinnerProduct.competition_level == level
        ).count()
        by_competition_level[level] = count
    
    # Get winners by category
    category_counts = db.query(
        models.WinnerProduct.category,
        func.count(models.WinnerProduct.id).label('count')
    ).filter(
        models.WinnerProduct.user_id == user_id,
        models.WinnerProduct.category.isnot(None)
    ).group_by(models.WinnerProduct.category).all()
    
    by_category = {category: count for category, count in category_counts}
    
    # Get top trends
    top_trends = []
    trends = db.query(models.MarketTrend).filter(
        (models.MarketTrend.user_id == user_id) | (models.MarketTrend.is_public == True)
    ).order_by(models.MarketTrend.opportunity_score.desc()).limit(5).all()
    
    for trend in trends:
        top_trends.append({
            "id": trend.id,
            "name": trend.name,
            "opportunity_score": trend.opportunity_score,
            "growth_rate": trend.growth_rate
        })
    
    # Get recent winners
    recent_winners = []
    winners = db.query(models.WinnerProduct).filter(
        models.WinnerProduct.user_id == user_id
    ).order_by(models.WinnerProduct.created_at.desc()).limit(5).all()
    
    for winner in winners:
        recent_winners.append({
            "id": winner.id,
            "title": winner.title,
            "winner_score": winner.winner_score,
            "profit_potential": winner.profit_potential,
            "created_at": winner.created_at.isoformat()
        })
    
    return {
        "total_winners": total_winners,
        "average_score": average_score,
        "by_competition_level": by_competition_level,
        "by_category": by_category,
        "top_trends": top_trends,
        "recent_winners": recent_winners
    }