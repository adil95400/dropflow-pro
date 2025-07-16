from pydantic import BaseModel, Field, validator, HttpUrl
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class DocumentType(str, Enum):
    terms_of_service = "terms_of_service"
    privacy_policy = "privacy_policy"
    cookie_policy = "cookie_policy"
    refund_policy = "refund_policy"
    shipping_policy = "shipping_policy"
    disclaimer = "disclaimer"
    custom = "custom"

class LegalDocumentBase(BaseModel):
    type: DocumentType
    title: str
    description: Optional[str] = None
    is_active: Optional[bool] = True
    metadata: Optional[Dict[str, Any]] = None

class LegalDocumentCreate(LegalDocumentBase):
    initial_version: Optional[str] = None
    initial_content: Optional[str] = None

class LegalDocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class LegalDocumentResponse(LegalDocumentBase):
    id: str
    current_version_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class DocumentVersionBase(BaseModel):
    version: str
    content: str

class DocumentVersionCreate(DocumentVersionBase):
    publish: Optional[bool] = False

class DocumentVersionResponse(DocumentVersionBase):
    id: str
    document_id: str
    published_at: Optional[datetime] = None
    created_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        orm_mode = True

class LegalDocumentDetailResponse(LegalDocumentResponse):
    current_version: Optional[DocumentVersionResponse] = None
    
    class Config:
        orm_mode = True

class UserConsentBase(BaseModel):
    document_id: str

class UserConsentCreate(UserConsentBase):
    pass

class UserConsentResponse(UserConsentBase):
    id: str
    user_id: str
    document_version_id: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    consented_at: datetime
    
    class Config:
        orm_mode = True

class DataRequestType(str, Enum):
    export = "export"
    deletion = "deletion"
    correction = "correction"

class DataRequestBase(BaseModel):
    type: DataRequestType
    request_data: Optional[Dict[str, Any]] = None

class DataRequestCreate(DataRequestBase):
    pass

class DataRequestResponse(DataRequestBase):
    id: str
    user_id: str
    status: str
    result_url: Optional[str] = None
    expires_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class GeneratedDocumentsResponse(BaseModel):
    terms_of_service: Optional[LegalDocumentResponse] = None
    privacy_policy: Optional[LegalDocumentResponse] = None
    cookie_policy: Optional[LegalDocumentResponse] = None
    refund_policy: Optional[LegalDocumentResponse] = None
    shipping_policy: Optional[LegalDocumentResponse] = None
    disclaimer: Optional[LegalDocumentResponse] = None