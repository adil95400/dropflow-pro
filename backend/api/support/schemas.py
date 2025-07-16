from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    waiting = "waiting"
    resolved = "resolved"
    closed = "closed"

class TicketPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

class TicketCategory(str, Enum):
    general = "general"
    technical = "technical"
    billing = "billing"
    feature_request = "feature_request"
    bug_report = "bug_report"
    account = "account"
    other = "other"

class SupportTicketBase(BaseModel):
    subject: str
    description: str
    category: TicketCategory = TicketCategory.general
    priority: TicketPriority = TicketPriority.medium
    metadata: Optional[Dict[str, Any]] = None

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    category: Optional[TicketCategory] = None
    metadata: Optional[Dict[str, Any]] = None

class SupportTicketResponse(SupportTicketBase):
    id: str
    user_id: str
    status: TicketStatus
    reference_number: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class TicketMessageBase(BaseModel):
    message: str
    is_internal: Optional[bool] = False
    metadata: Optional[Dict[str, Any]] = None

class TicketMessageCreate(TicketMessageBase):
    pass

class TicketMessageResponse(TicketMessageBase):
    id: str
    ticket_id: str
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class TicketAttachmentBase(BaseModel):
    file_name: str
    file_size: int
    file_type: str
    file_url: str
    metadata: Optional[Dict[str, Any]] = None

class TicketAttachmentResponse(TicketAttachmentBase):
    id: str
    ticket_id: str
    message_id: Optional[str] = None
    user_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class SupportTicketDetailResponse(SupportTicketResponse):
    messages: List[TicketMessageResponse]
    attachments: List[TicketAttachmentResponse]
    
    class Config:
        orm_mode = True

class KnowledgeBaseCategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True

class KnowledgeBaseCategoryCreate(KnowledgeBaseCategoryBase):
    pass

class KnowledgeBaseCategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class KnowledgeBaseCategoryResponse(KnowledgeBaseCategoryBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class KnowledgeBaseCategoryDetailResponse(KnowledgeBaseCategoryResponse):
    articles_count: int
    subcategories: List['KnowledgeBaseCategoryResponse']
    
    class Config:
        orm_mode = True

class KnowledgeBaseArticleBase(BaseModel):
    category_id: str
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    is_published: Optional[bool] = True
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class KnowledgeBaseArticleCreate(KnowledgeBaseArticleBase):
    pass

class KnowledgeBaseArticleUpdate(BaseModel):
    category_id: Optional[str] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    is_published: Optional[bool] = None
    tags: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None

class KnowledgeBaseArticleResponse(KnowledgeBaseArticleBase):
    id: str
    author_id: Optional[str] = None
    view_count: int
    helpful_count: int
    not_helpful_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class KnowledgeBaseArticleDetailResponse(KnowledgeBaseArticleResponse):
    category: KnowledgeBaseCategoryResponse
    
    class Config:
        orm_mode = True

class ArticleFeedbackCreate(BaseModel):
    helpful: bool
    comment: Optional[str] = None

class ArticleFeedbackResponse(BaseModel):
    article_id: str
    helpful: bool
    helpful_count: int
    not_helpful_count: int

class ChatbotConversationBase(BaseModel):
    title: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatbotConversationCreate(ChatbotConversationBase):
    session_id: Optional[str] = None

class ChatbotConversationResponse(ChatbotConversationBase):
    id: str
    user_id: Optional[str] = None
    session_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ChatbotMessageBase(BaseModel):
    role: str
    content: str
    metadata: Optional[Dict[str, Any]] = None

class ChatbotMessageCreate(BaseModel):
    content: str

class ChatbotMessageResponse(ChatbotMessageBase):
    id: str
    conversation_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class ChatbotConversationDetailResponse(ChatbotConversationResponse):
    messages: List[ChatbotMessageResponse]
    
    class Config:
        orm_mode = True

class ChatbotQueryRequest(BaseModel):
    query: str

class ChatbotQueryResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    related_articles: Optional[List[Dict[str, Any]]] = None