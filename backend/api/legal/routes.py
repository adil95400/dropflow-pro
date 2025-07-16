from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status, Request
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.get("/documents", response_model=List[schemas.LegalDocumentResponse])
async def get_legal_documents(
    type: Optional[str] = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Get legal documents
    """
    return services.get_legal_documents(db, type=type, active_only=active_only)

@router.get("/documents/{document_id}", response_model=schemas.LegalDocumentDetailResponse)
async def get_legal_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a legal document by ID
    """
    document = services.get_legal_document(db, document_id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    return document

@router.post("/documents", response_model=schemas.LegalDocumentResponse)
async def create_legal_document(
    document: schemas.LegalDocumentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new legal document
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can create legal documents")
    
    return services.create_legal_document(db, document=document, user_id=current_user.id)

@router.put("/documents/{document_id}", response_model=schemas.LegalDocumentResponse)
async def update_legal_document(
    document_id: str,
    document: schemas.LegalDocumentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a legal document
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can update legal documents")
    
    db_document = services.get_legal_document(db, document_id=document_id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    return services.update_legal_document(db, document_id=document_id, document=document)

@router.post("/documents/{document_id}/versions", response_model=schemas.DocumentVersionResponse)
async def create_document_version(
    document_id: str,
    version: schemas.DocumentVersionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new version of a legal document
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can create document versions")
    
    db_document = services.get_legal_document(db, document_id=document_id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    return services.create_document_version(db, document_id=document_id, version=version, user_id=current_user.id)

@router.get("/documents/{document_id}/versions", response_model=List[schemas.DocumentVersionResponse])
async def get_document_versions(
    document_id: str,
    db: Session = Depends(get_db)
):
    """
    Get versions of a legal document
    """
    db_document = services.get_legal_document(db, document_id=document_id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    return services.get_document_versions(db, document_id=document_id)

@router.post("/documents/{document_id}/publish/{version_id}", response_model=schemas.LegalDocumentResponse)
async def publish_document_version(
    document_id: str,
    version_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Publish a version of a legal document
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can publish document versions")
    
    db_document = services.get_legal_document(db, document_id=document_id)
    if not db_document:
        raise HTTPException(status_code=404, detail="Legal document not found")
    
    db_version = services.get_document_version(db, version_id=version_id)
    if not db_version:
        raise HTTPException(status_code=404, detail="Document version not found")
    
    if db_version.document_id != document_id:
        raise HTTPException(status_code=400, detail="Version does not belong to this document")
    
    return services.publish_document_version(db, document_id=document_id, version_id=version_id)

@router.post("/consent", response_model=schemas.UserConsentResponse)
async def create_user_consent(
    consent: schemas.UserConsentCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a user consent record
    """
    # Get client IP and user agent
    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "")
    
    return services.create_user_consent(
        db, 
        user_id=current_user.id,
        document_id=consent.document_id,
        ip_address=ip_address,
        user_agent=user_agent
    )

@router.get("/consent", response_model=List[schemas.UserConsentResponse])
async def get_user_consents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get consent records for the current user
    """
    return services.get_user_consents(db, user_id=current_user.id)

@router.post("/data-requests", response_model=schemas.DataRequestResponse)
async def create_data_request(
    request: schemas.DataRequestCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a data request (export, deletion, correction)
    """
    data_request = services.create_data_request(db, request=request, user_id=current_user.id)
    
    # Process request in background
    background_tasks.add_task(
        services.process_data_request,
        db=db,
        request_id=data_request.id
    )
    
    return data_request

@router.get("/data-requests", response_model=List[schemas.DataRequestResponse])
async def get_data_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get data requests for the current user
    """
    return services.get_data_requests(db, user_id=current_user.id)

@router.get("/data-requests/{request_id}", response_model=schemas.DataRequestResponse)
async def get_data_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a data request by ID
    """
    data_request = services.get_data_request(db, request_id=request_id, user_id=current_user.id)
    if not data_request:
        raise HTTPException(status_code=404, detail="Data request not found")
    
    return data_request

@router.get("/data-requests/{request_id}/download")
async def download_data_request_result(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Download the result of a data request
    """
    data_request = services.get_data_request(db, request_id=request_id, user_id=current_user.id)
    if not data_request:
        raise HTTPException(status_code=404, detail="Data request not found")
    
    if data_request.status != "completed":
        raise HTTPException(status_code=400, detail="Data request is not completed")
    
    if not data_request.result_url:
        raise HTTPException(status_code=400, detail="No result available for download")
    
    if data_request.expires_at and data_request.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Download link has expired")
    
    # In a real implementation, this would return a file or redirect to a download URL
    # For now, we'll return a mock response
    return JSONResponse(content={
        "message": "In a real implementation, this would download the data export file",
        "url": data_request.result_url
    })

@router.get("/generate-documents", response_model=schemas.GeneratedDocumentsResponse)
async def generate_legal_documents(
    company_name: str = Query(...),
    website_url: str = Query(...),
    country: str = Query(...),
    industry: str = Query(...),
    collects_personal_data: bool = Query(True),
    has_cookies: bool = Query(True),
    has_user_accounts: bool = Query(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate legal documents based on company information
    """
    # Check if user is admin
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only admins can generate legal documents")
    
    return services.generate_legal_documents(
        db,
        company_name=company_name,
        website_url=website_url,
        country=country,
        industry=industry,
        collects_personal_data=collects_personal_data,
        has_cookies=has_cookies,
        has_user_accounts=has_user_accounts,
        user_id=current_user.id
    )