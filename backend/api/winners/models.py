from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class CompetitionLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class WinnerProduct(Base):
    __tablename__ = "winner_products"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    product_id = Column(String, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    images = Column(JSON, nullable=True)  # List of image URLs
    supplier = Column(String, nullable=True)
    category = Column(String, nullable=True)
    winner_score = Column(Integer, nullable=False)
    reasons = Column(JSON, nullable=True)  # List of reasons why it's a winner
    market_trends = Column(JSON, nullable=True)  # List of related market trends
    competition_level = Column(Enum(CompetitionLevel), default=CompetitionLevel.medium)
    profit_potential = Column(Float, nullable=True)  # Percentage
    social_proof = Column(JSON, nullable=True)  # Object with reviews, rating, orders
    ad_spend = Column(JSON, nullable=True)  # Object with ad spend by platform
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="winner_products")
    product = relationship("Product", back_populates="winner_data")

class MarketTrend(Base):
    __tablename__ = "market_trends"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    growth_rate = Column(Float, nullable=True)  # Percentage
    competition_level = Column(Enum(CompetitionLevel), default=CompetitionLevel.medium)
    opportunity_score = Column(Integer, nullable=True)  # 0-100
    related_keywords = Column(JSON, nullable=True)  # List of related keywords
    seasonal = Column(Boolean, default=False)
    season_start = Column(String, nullable=True)  # Month or date
    season_end = Column(String, nullable=True)  # Month or date
    source = Column(String, nullable=True)  # Where this trend was detected
    is_public = Column(Boolean, default=False)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="market_trends")
    products = relationship("WinnerProduct", secondary="trend_product_association")

class TrendProductAssociation(Base):
    __tablename__ = "trend_product_association"
    
    trend_id = Column(String, ForeignKey("market_trends.id", ondelete="CASCADE"), primary_key=True)
    product_id = Column(String, ForeignKey("winner_products.id", ondelete="CASCADE"), primary_key=True)
    relevance_score = Column(Integer, nullable=True)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class WinnerDetectionJob(Base):
    __tablename__ = "winner_detection_jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    status = Column(String, nullable=False)  # pending, processing, completed, failed
    total_products = Column(Integer, default=0)
    processed_products = Column(Integer, default=0)
    winners_found = Column(Integer, default=0)
    settings = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="winner_detection_jobs")
    results = relationship("WinnerDetectionResult", back_populates="job", cascade="all, delete-orphan")

class WinnerDetectionResult(Base):
    __tablename__ = "winner_detection_results"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("winner_detection_jobs.id", ondelete="CASCADE"))
    product_id = Column(String, nullable=False)
    is_winner = Column(Boolean, default=False)
    score = Column(Integer, nullable=True)  # 0-100
    analysis = Column(Text, nullable=True)
    reasons = Column(JSON, nullable=True)  # List of reasons
    winner_product_id = Column(String, ForeignKey("winner_products.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    job = relationship("WinnerDetectionJob", back_populates="results")
    winner_product = relationship("WinnerProduct")

# Add relationships to User and Product models
from ..auth.models import User
from ..products.models import Product

User.winner_products = relationship("WinnerProduct", back_populates="user")
User.market_trends = relationship("MarketTrend", back_populates="user")
User.winner_detection_jobs = relationship("WinnerDetectionJob", back_populates="user")
Product.winner_data = relationship("WinnerProduct", back_populates="product", uselist=False)