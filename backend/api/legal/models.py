from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid
import enum

class DocumentType(str, enum.Enum):
    terms_of_service = "terms_of_service"
    privacy_policy = "privacy_policy"
    cookie_policy = "cookie_policy"
    refund_policy = "refund_policy"
    shipping_policy = "shipping_policy"
    disclaimer = "disclaimer"
    custom = "custom"

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("legal_documents.id", ondelete="CASCADE"))
    version = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    document = relationship("LegalDocument", back_populates="versions")
    creator = relationship("User", foreign_keys=[created_by])

class LegalDocument(Base):
    __tablename__ = "legal_documents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(Enum(DocumentType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    current_version_id = Column(String, ForeignKey("document_versions.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    versions = relationship("DocumentVersion", back_populates="document", foreign_keys=[DocumentVersion.document_id])
    current_version = relationship("DocumentVersion", foreign_keys=[current_version_id])
    user_consents = relationship("UserConsent", back_populates="document", cascade="all, delete-orphan")

class UserConsent(Base):
    __tablename__ = "user_consents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    document_id = Column(String, ForeignKey("legal_documents.id", ondelete="CASCADE"))
    document_version_id = Column(String, ForeignKey("document_versions.id", ondelete="SET NULL"), nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    consented_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="consents")
    document = relationship("LegalDocument", back_populates="user_consents")
    document_version = relationship("DocumentVersion")

class DataRequest(Base):
    __tablename__ = "data_requests"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    type = Column(String, nullable=False)  # export, deletion, correction
    status = Column(String, nullable=False)  # pending, processing, completed, failed
    request_data = Column(JSON, nullable=True)
    result_url = Column(String, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="data_requests")

# Add relationships to User model
from ..auth.models import User
User.consents = relationship("UserConsent", back_populates="user", cascade="all, delete-orphan")
User.data_requests = relationship("DataRequest", back_populates="user", cascade="all, delete-orphan")