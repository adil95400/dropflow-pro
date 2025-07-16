from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from database import get_db
from . import schemas, services
from ..auth.services import get_current_user
from ..auth.models import User

router = APIRouter()

@router.get("/tickets", response_model=List[schemas.SupportTicketResponse])
async def get_support_tickets(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get support tickets for the current user
    """
    return services.get_support_tickets(
        db, 
        user_id=current_user.id,
        status=status,
        category=category,
        priority=priority,
        limit=limit,
        offset=offset
    )

@router.post("/tickets", response_model=schemas.SupportTicketResponse)
async def create_support_ticket(
    ticket: schemas.SupportTicketCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new support ticket
    """
    db_ticket = services.create_support_ticket(db, ticket=ticket, user_id=current_user.id)
    
    # Send notification in background
    background_tasks.add_task(
        services.send_ticket_notification,
        db=db,
        ticket_id=db_ticket.id,
        notification_type="new_ticket"
    )
    
    return db_ticket

@router.get("/tickets/{ticket_id}", response_model=schemas.SupportTicketDetailResponse)
async def get_support_ticket(
    ticket_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a support ticket by ID
    """
    ticket = services.get_support_ticket(db, ticket_id=ticket_id, user_id=current_user.id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
    
    return ticket

@router.put("/tickets/{ticket_id}", response_model=schemas.SupportTicketResponse)
async def update_support_ticket(
    ticket_id: str,
    ticket: schemas.SupportTicketUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a support ticket
    """
    db_ticket = services.get_support_ticket(db, ticket_id=ticket_id, user_id=current_user.id)
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
    
    updated_ticket = services.update_support_ticket(db, ticket_id=ticket_id, ticket=ticket)
    
    # If status changed to resolved, send notification
    if ticket.status == "resolved" and db_ticket.status != "resolved":
        background_tasks.add_task(
            services.send_ticket_notification,
            db=db,
            ticket_id=ticket_id,
            notification_type="ticket_resolved"
        )
    
    return updated_ticket

@router.post("/tickets/{ticket_id}/messages", response_model=schemas.TicketMessageResponse)
async def create_ticket_message(
    ticket_id: str,
    message: schemas.TicketMessageCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a message to a support ticket
    """
    ticket = services.get_support_ticket(db, ticket_id=ticket_id, user_id=current_user.id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
    
    db_message = services.create_ticket_message(db, ticket_id=ticket_id, message=message, user_id=current_user.id)
    
    # Send notification in background
    background_tasks.add_task(
        services.send_ticket_notification,
        db=db,
        ticket_id=ticket_id,
        notification_type="new_message",
        message_id=db_message.id
    )
    
    return db_message

@router.post("/tickets/{ticket_id}/attachments", response_model=schemas.TicketAttachmentResponse)
async def upload_ticket_attachment(
    ticket_id: str,
    file: UploadFile = File(...),
    message_id: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload an attachment to a support ticket
    """
    ticket = services.get_support_ticket(db, ticket_id=ticket_id, user_id=current_user.id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found")
    
    # If message_id is provided, verify it belongs to this ticket
    if message_id:
        message = services.get_ticket_message(db, message_id=message_id)
        if not message or message.ticket_id != ticket_id:
            raise HTTPException(status_code=404, detail="Ticket message not found")
    
    # Upload file
    file_content = await file.read()
    
    return services.create_ticket_attachment(
        db, 
        ticket_id=ticket_id,
        message_id=message_id,
        user_id=current_user.id,
        file_name=file.filename,
        file_content=file_content,
        file_type=file.content_type
    )

@router.get("/kb/categories", response_model=List[schemas.KnowledgeBaseCategoryResponse])
async def get_kb_categories(
    parent_id: Optional[str] = Query(None),
    active_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    """
    Get knowledge base categories
    """
    return services.get_kb_categories(db, parent_id=parent_id, active_only=active_only)

@router.get("/kb/categories/{category_id}", response_model=schemas.KnowledgeBaseCategoryDetailResponse)
async def get_kb_category(
    category_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a knowledge base category by ID
    """
    category = services.get_kb_category(db, category_id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Knowledge base category not found")
    
    return category

@router.get("/kb/articles", response_model=List[schemas.KnowledgeBaseArticleResponse])
async def get_kb_articles(
    category_id: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Get knowledge base articles
    """
    return services.get_kb_articles(
        db, 
        category_id=category_id,
        tag=tag,
        search=search,
        limit=limit,
        offset=offset
    )

@router.get("/kb/articles/{article_id}", response_model=schemas.KnowledgeBaseArticleDetailResponse)
async def get_kb_article(
    article_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a knowledge base article by ID
    """
    article = services.get_kb_article(db, article_id=article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Knowledge base article not found")
    
    # Increment view count
    services.increment_article_view_count(db, article_id=article_id)
    
    return article

@router.post("/kb/articles/{article_id}/feedback", response_model=schemas.ArticleFeedbackResponse)
async def submit_article_feedback(
    article_id: str,
    feedback: schemas.ArticleFeedbackCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submit feedback for a knowledge base article
    """
    article = services.get_kb_article(db, article_id=article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Knowledge base article not found")
    
    user_id = current_user.id if current_user else None
    
    return services.submit_article_feedback(
        db, 
        article_id=article_id,
        helpful=feedback.helpful,
        comment=feedback.comment,
        user_id=user_id
    )

@router.post("/chatbot/conversations", response_model=schemas.ChatbotConversationResponse)
async def create_chatbot_conversation(
    conversation: schemas.ChatbotConversationCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new chatbot conversation
    """
    user_id = current_user.id if current_user else None
    
    return services.create_chatbot_conversation(db, conversation=conversation, user_id=user_id)

@router.get("/chatbot/conversations", response_model=List[schemas.ChatbotConversationResponse])
async def get_chatbot_conversations(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get chatbot conversations for the current user
    """
    return services.get_chatbot_conversations(db, user_id=current_user.id, limit=limit, offset=offset)

@router.get("/chatbot/conversations/{conversation_id}", response_model=schemas.ChatbotConversationDetailResponse)
async def get_chatbot_conversation(
    conversation_id: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a chatbot conversation by ID
    """
    user_id = current_user.id if current_user else None
    
    conversation = services.get_chatbot_conversation(db, conversation_id=conversation_id, user_id=user_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Chatbot conversation not found")
    
    return conversation

@router.post("/chatbot/conversations/{conversation_id}/messages", response_model=schemas.ChatbotMessageResponse)
async def create_chatbot_message(
    conversation_id: str,
    message: schemas.ChatbotMessageCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add a message to a chatbot conversation
    """
    user_id = current_user.id if current_user else None
    
    conversation = services.get_chatbot_conversation(db, conversation_id=conversation_id, user_id=user_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Chatbot conversation not found")
    
    # Create user message
    user_message = services.create_chatbot_message(
        db, 
        conversation_id=conversation_id,
        role="user",
        content=message.content
    )
    
    # Generate assistant response
    assistant_message = services.generate_chatbot_response(db, conversation_id=conversation_id)
    
    return assistant_message

@router.post("/chatbot/query", response_model=schemas.ChatbotQueryResponse)
async def query_chatbot(
    query: schemas.ChatbotQueryRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Query the chatbot without creating a conversation
    """
    return services.query_chatbot(db, query=query.query, user_id=current_user.id if current_user else None)