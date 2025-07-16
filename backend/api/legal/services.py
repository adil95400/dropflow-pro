from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import uuid
import logging
import json
import os
import zipfile
import io
import tempfile

from . import models, schemas
from ..auth.models import User
from ...clients.openai import OpenAIClient

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai_client = OpenAIClient()

def get_legal_documents(db: Session, type: Optional[str] = None, active_only: bool = True) -> List[models.LegalDocument]:
    """
    Get legal documents
    """
    query = db.query(models.LegalDocument)
    
    if type:
        query = query.filter(models.LegalDocument.type == type)
    
    if active_only:
        query = query.filter(models.LegalDocument.is_active == True)
    
    return query.all()

def get_legal_document(db: Session, document_id: str) -> Optional[models.LegalDocument]:
    """
    Get a legal document by ID
    """
    return db.query(models.LegalDocument).filter(models.LegalDocument.id == document_id).first()

def create_legal_document(db: Session, document: schemas.LegalDocumentCreate, user_id: str) -> models.LegalDocument:
    """
    Create a new legal document
    """
    # Create document
    db_document = models.LegalDocument(
        id=str(uuid.uuid4()),
        type=document.type,
        title=document.title,
        description=document.description,
        is_active=document.is_active,
        metadata=document.metadata
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Create initial version if provided
    if document.initial_version and document.initial_content:
        version = create_document_version(
            db,
            document_id=db_document.id,
            version=schemas.DocumentVersionCreate(
                version=document.initial_version,
                content=document.initial_content,
                publish=True
            ),
            user_id=user_id
        )
        
        # Set as current version
        db_document.current_version_id = version.id
        db.commit()
        db.refresh(db_document)
    
    return db_document

def update_legal_document(db: Session, document_id: str, document: schemas.LegalDocumentUpdate) -> models.LegalDocument:
    """
    Update a legal document
    """
    db_document = db.query(models.LegalDocument).filter(models.LegalDocument.id == document_id).first()
    if not db_document:
        raise ValueError(f"Legal document not found: {document_id}")
    
    # Update fields if provided
    if document.title is not None:
        db_document.title = document.title
    
    if document.description is not None:
        db_document.description = document.description
    
    if document.is_active is not None:
        db_document.is_active = document.is_active
    
    if document.metadata is not None:
        db_document.metadata = document.metadata
    
    db_document.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_document)
    
    return db_document

def get_document_versions(db: Session, document_id: str) -> List[models.DocumentVersion]:
    """
    Get versions of a legal document
    """
    return db.query(models.DocumentVersion).filter(models.DocumentVersion.document_id == document_id).all()

def get_document_version(db: Session, version_id: str) -> Optional[models.DocumentVersion]:
    """
    Get a document version by ID
    """
    return db.query(models.DocumentVersion).filter(models.DocumentVersion.id == version_id).first()

def create_document_version(db: Session, document_id: str, version: schemas.DocumentVersionCreate, user_id: str) -> models.DocumentVersion:
    """
    Create a new version of a legal document
    """
    db_version = models.DocumentVersion(
        id=str(uuid.uuid4()),
        document_id=document_id,
        version=version.version,
        content=version.content,
        created_by=user_id
    )
    
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    
    # If publish flag is set, publish this version
    if version.publish:
        publish_document_version(db, document_id=document_id, version_id=db_version.id)
    
    return db_version

def publish_document_version(db: Session, document_id: str, version_id: str) -> models.LegalDocument:
    """
    Publish a version of a legal document
    """
    # Get document and version
    document = db.query(models.LegalDocument).filter(models.LegalDocument.id == document_id).first()
    if not document:
        raise ValueError(f"Legal document not found: {document_id}")
    
    version = db.query(models.DocumentVersion).filter(models.DocumentVersion.id == version_id).first()
    if not version:
        raise ValueError(f"Document version not found: {version_id}")
    
    # Set as current version
    document.current_version_id = version.id
    
    # Set published timestamp
    version.published_at = datetime.utcnow()
    
    db.commit()
    db.refresh(document)
    
    return document

def create_user_consent(
    db: Session, 
    user_id: str, 
    document_id: str, 
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> models.UserConsent:
    """
    Create a user consent record
    """
    # Get document
    document = db.query(models.LegalDocument).filter(models.LegalDocument.id == document_id).first()
    if not document:
        raise ValueError(f"Legal document not found: {document_id}")
    
    # Create consent record
    db_consent = models.UserConsent(
        id=str(uuid.uuid4()),
        user_id=user_id,
        document_id=document_id,
        document_version_id=document.current_version_id,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    db.add(db_consent)
    db.commit()
    db.refresh(db_consent)
    
    return db_consent

def get_user_consents(db: Session, user_id: str) -> List[models.UserConsent]:
    """
    Get consent records for a user
    """
    return db.query(models.UserConsent).filter(models.UserConsent.user_id == user_id).all()

def create_data_request(db: Session, request: schemas.DataRequestCreate, user_id: str) -> models.DataRequest:
    """
    Create a data request
    """
    db_request = models.DataRequest(
        id=str(uuid.uuid4()),
        user_id=user_id,
        type=request.type,
        status="pending",
        request_data=request.request_data
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request

def get_data_requests(db: Session, user_id: str) -> List[models.DataRequest]:
    """
    Get data requests for a user
    """
    return db.query(models.DataRequest).filter(models.DataRequest.user_id == user_id).all()

def get_data_request(db: Session, request_id: str, user_id: str) -> Optional[models.DataRequest]:
    """
    Get a data request by ID
    """
    return db.query(models.DataRequest).filter(
        models.DataRequest.id == request_id,
        models.DataRequest.user_id == user_id
    ).first()

def process_data_request(db: Session, request_id: str) -> None:
    """
    Process a data request
    """
    data_request = db.query(models.DataRequest).filter(models.DataRequest.id == request_id).first()
    if not data_request:
        logger.error(f"Data request not found: {request_id}")
        return
    
    try:
        # Update request status
        data_request.status = "processing"
        db.commit()
        
        # Process based on request type
        if data_request.type == "export":
            process_data_export(db, data_request)
        elif data_request.type == "deletion":
            process_data_deletion(db, data_request)
        elif data_request.type == "correction":
            process_data_correction(db, data_request)
        else:
            raise ValueError(f"Unsupported data request type: {data_request.type}")
        
        # Update request status
        data_request.status = "completed"
        data_request.completed_at = datetime.utcnow()
        db.commit()
        
    except Exception as e:
        logger.error(f"Error processing data request {request_id}: {e}")
        
        # Update request status
        data_request.status = "failed"
        data_request.request_data = {
            **(data_request.request_data or {}),
            "error": str(e)
        }
        db.commit()

def process_data_export(db: Session, data_request: models.DataRequest) -> None:
    """
    Process a data export request
    """
    # Get user data
    user_id = data_request.user_id
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise ValueError(f"User not found: {user_id}")
    
    # Collect user data
    user_data = {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat() if user.created_at else None
        },
        "profile": get_user_profile_data(db, user_id),
        "products": get_user_products_data(db, user_id),
        "orders": get_user_orders_data(db, user_id),
        "store_connections": get_user_store_connections_data(db, user_id),
        "social_accounts": get_user_social_accounts_data(db, user_id),
        "consents": get_user_consents_data(db, user_id)
    }
    
    # Create export file
    export_file_path = create_export_file(user_data, user_id)
    
    # Set result URL and expiry
    data_request.result_url = export_file_path
    data_request.expires_at = datetime.utcnow() + timedelta(days=7)
    db.commit()

def process_data_deletion(db: Session, data_request: models.DataRequest) -> None:
    """
    Process a data deletion request
    """
    # In a real implementation, this would anonymize or delete user data
    # For now, we'll just log the request
    logger.info(f"Processing data deletion request for user {data_request.user_id}")
    
    # Mark as completed
    data_request.completed_at = datetime.utcnow()
    db.commit()

def process_data_correction(db: Session, data_request: models.DataRequest) -> None:
    """
    Process a data correction request
    """
    # In a real implementation, this would update user data based on the request
    # For now, we'll just log the request
    logger.info(f"Processing data correction request for user {data_request.user_id}")
    
    # Mark as completed
    data_request.completed_at = datetime.utcnow()
    db.commit()

def get_user_profile_data(db: Session, user_id: str) -> Dict[str, Any]:
    """
    Get user profile data
    """
    # In a real implementation, this would query the user's profile data
    # For now, return a mock object
    return {
        "profile_data": "Would contain user profile information"
    }

def get_user_products_data(db: Session, user_id: str) -> List[Dict[str, Any]]:
    """
    Get user products data
    """
    # In a real implementation, this would query the user's products
    # For now, return a mock list
    return [
        {"product_data": "Would contain product information"}
    ]

def get_user_orders_data(db: Session, user_id: str) -> List[Dict[str, Any]]:
    """
    Get user orders data
    """
    # In a real implementation, this would query the user's orders
    # For now, return a mock list
    return [
        {"order_data": "Would contain order information"}
    ]

def get_user_store_connections_data(db: Session, user_id: str) -> List[Dict[str, Any]]:
    """
    Get user store connections data
    """
    # In a real implementation, this would query the user's store connections
    # For now, return a mock list
    return [
        {"connection_data": "Would contain store connection information"}
    ]

def get_user_social_accounts_data(db: Session, user_id: str) -> List[Dict[str, Any]]:
    """
    Get user social accounts data
    """
    # In a real implementation, this would query the user's social accounts
    # For now, return a mock list
    return [
        {"account_data": "Would contain social account information"}
    ]

def get_user_consents_data(db: Session, user_id: str) -> List[Dict[str, Any]]:
    """
    Get user consents data
    """
    consents = db.query(models.UserConsent).filter(models.UserConsent.user_id == user_id).all()
    
    return [
        {
            "id": consent.id,
            "document_id": consent.document_id,
            "document_version_id": consent.document_version_id,
            "consented_at": consent.consented_at.isoformat() if consent.consented_at else None,
            "ip_address": consent.ip_address,
            "user_agent": consent.user_agent
        }
        for consent in consents
    ]

def create_export_file(data: Dict[str, Any], user_id: str) -> str:
    """
    Create an export file with user data
    """
    # In a real implementation, this would create a file and store it securely
    # For now, we'll just return a mock URL
    return f"/api/legal/data-exports/{user_id}_{int(datetime.utcnow().timestamp())}.json"

def generate_legal_documents(
    db: Session,
    company_name: str,
    website_url: str,
    country: str,
    industry: str,
    collects_personal_data: bool,
    has_cookies: bool,
    has_user_accounts: bool,
    user_id: str
) -> Dict[str, Any]:
    """
    Generate legal documents based on company information
    """
    result = {}
    
    # Generate Terms of Service
    tos_content = generate_terms_of_service(
        company_name=company_name,
        website_url=website_url,
        country=country,
        industry=industry,
        has_user_accounts=has_user_accounts
    )
    
    tos_document = create_legal_document(
        db,
        document=schemas.LegalDocumentCreate(
            type=schemas.DocumentType.terms_of_service,
            title="Terms of Service",
            description="Terms and conditions for using the website and services",
            initial_version="1.0",
            initial_content=tos_content
        ),
        user_id=user_id
    )
    
    result["terms_of_service"] = tos_document
    
    # Generate Privacy Policy
    if collects_personal_data:
        privacy_content = generate_privacy_policy(
            company_name=company_name,
            website_url=website_url,
            country=country,
            industry=industry,
            has_user_accounts=has_user_accounts
        )
        
        privacy_document = create_legal_document(
            db,
            document=schemas.LegalDocumentCreate(
                type=schemas.DocumentType.privacy_policy,
                title="Privacy Policy",
                description="How we collect, use, and protect your personal information",
                initial_version="1.0",
                initial_content=privacy_content
            ),
            user_id=user_id
        )
        
        result["privacy_policy"] = privacy_document
    
    # Generate Cookie Policy
    if has_cookies:
        cookie_content = generate_cookie_policy(
            company_name=company_name,
            website_url=website_url,
            country=country
        )
        
        cookie_document = create_legal_document(
            db,
            document=schemas.LegalDocumentCreate(
                type=schemas.DocumentType.cookie_policy,
                title="Cookie Policy",
                description="How we use cookies and similar technologies",
                initial_version="1.0",
                initial_content=cookie_content
            ),
            user_id=user_id
        )
        
        result["cookie_policy"] = cookie_document
    
    # Generate Refund Policy
    refund_content = generate_refund_policy(
        company_name=company_name,
        website_url=website_url,
        country=country,
        industry=industry
    )
    
    refund_document = create_legal_document(
        db,
        document=schemas.LegalDocumentCreate(
            type=schemas.DocumentType.refund_policy,
            title="Refund Policy",
            description="Our policy for refunds and returns",
            initial_version="1.0",
            initial_content=refund_content
        ),
        user_id=user_id
    )
    
    result["refund_policy"] = refund_document
    
    # Generate Shipping Policy
    shipping_content = generate_shipping_policy(
        company_name=company_name,
        website_url=website_url,
        country=country,
        industry=industry
    )
    
    shipping_document = create_legal_document(
        db,
        document=schemas.LegalDocumentCreate(
            type=schemas.DocumentType.shipping_policy,
            title="Shipping Policy",
            description="Our policy for shipping and delivery",
            initial_version="1.0",
            initial_content=shipping_content
        ),
        user_id=user_id
    )
    
    result["shipping_policy"] = shipping_document
    
    return result

def generate_terms_of_service(
    company_name: str,
    website_url: str,
    country: str,
    industry: str,
    has_user_accounts: bool
) -> str:
    """
    Generate Terms of Service content
    """
    # In a real implementation, this would use AI to generate custom content
    # For now, return a template with placeholders filled in
    
    template = """
    # Terms of Service

    Last Updated: {date}

    ## 1. Introduction

    Welcome to {website_url} ("the Website"), operated by {company_name} ("we," "us," or "our"). By accessing or using our Website and services, you agree to be bound by these Terms of Service ("Terms").

    ## 2. Acceptance of Terms

    By accessing or using our Website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Website or services.

    ## 3. Changes to Terms

    We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on the Website. Your continued use of the Website after such modifications constitutes your acceptance of the modified Terms.

    ## 4. User Accounts

    {user_accounts_section}

    ## 5. Intellectual Property

    All content on the Website, including text, graphics, logos, images, and software, is the property of {company_name} and is protected by copyright, trademark, and other intellectual property laws.

    ## 6. User Content

    By submitting content to our Website, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.

    ## 7. Prohibited Activities

    You agree not to:
    - Use the Website for any illegal purpose
    - Violate any laws or regulations
    - Infringe upon the rights of others
    - Interfere with the operation of the Website
    - Attempt to gain unauthorized access to the Website or user accounts

    ## 8. Disclaimer of Warranties

    THE WEBSITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

    ## 9. Limitation of Liability

    IN NO EVENT SHALL {company_name} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.

    ## 10. Governing Law

    These Terms shall be governed by and construed in accordance with the laws of {country}, without regard to its conflict of law principles.

    ## 11. Contact Information

    If you have any questions about these Terms, please contact us at:

    {company_name}
    Email: [Your Contact Email]
    Website: {website_url}
    """
    
    user_accounts_section = """
    To access certain features of the Website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
    """ if has_user_accounts else """
    Our Website does not currently require user accounts for access.
    """
    
    return template.format(
        date=datetime.utcnow().strftime("%B %d, %Y"),
        website_url=website_url,
        company_name=company_name,
        country=country,
        user_accounts_section=user_accounts_section
    )

def generate_privacy_policy(
    company_name: str,
    website_url: str,
    country: str,
    industry: str,
    has_user_accounts: bool
) -> str:
    """
    Generate Privacy Policy content
    """
    # Similar implementation to generate_terms_of_service
    return f"Privacy Policy for {company_name} ({website_url})"

def generate_cookie_policy(
    company_name: str,
    website_url: str,
    country: str
) -> str:
    """
    Generate Cookie Policy content
    """
    # Similar implementation to generate_terms_of_service
    return f"Cookie Policy for {company_name} ({website_url})"

def generate_refund_policy(
    company_name: str,
    website_url: str,
    country: str,
    industry: str
) -> str:
    """
    Generate Refund Policy content
    """
    # Similar implementation to generate_terms_of_service
    return f"Refund Policy for {company_name} ({website_url})"

def generate_shipping_policy(
    company_name: str,
    website_url: str,
    country: str,
    industry: str
) -> str:
    """
    Generate Shipping Policy content
    """
    # Similar implementation to generate_terms_of_service
    return f"Shipping Policy for {company_name} ({website_url})"