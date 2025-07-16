from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from typing import List, Optional, Dict, Any, BinaryIO
from datetime import datetime, timedelta
import uuid
import logging
import json
import random
import string
import os
import io
import re

from . import models, schemas
from ..auth.models import User
from ...clients.openai import OpenAIClient
from ...clients.email import EmailClient
from ...clients.storage import StorageClient

logger = logging.getLogger(__name__)

# Initialize clients
openai_client = OpenAIClient()
email_client = EmailClient()
storage_client = StorageClient()

def get_support_tickets(
    db: Session, 
    user_id: str, 
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
) -> List[models.SupportTicket]:
    """
    Get support tickets for a user
    """
    query = db.query(models.SupportTicket).filter(models.SupportTicket.user_id == user_id)
    
    if status:
        query = query.filter(models.SupportTicket.status == status)
    
    if category:
        query = query.filter(models.SupportTicket.category == category)
    
    if priority:
        query = query.filter(models.SupportTicket.priority == priority)
    
    query = query.order_by(models.SupportTicket.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_support_ticket(db: Session, ticket_id: str, user_id: str) -> Optional[models.SupportTicket]:
    """
    Get a support ticket by ID
    """
    return db.query(models.SupportTicket).filter(
        models.SupportTicket.id == ticket_id,
        models.SupportTicket.user_id == user_id
    ).first()

def create_support_ticket(db: Session, ticket: schemas.SupportTicketCreate, user_id: str) -> models.SupportTicket:
    """
    Create a new support ticket
    """
    # Generate reference number
    reference_number = generate_reference_number()
    
    # Create ticket
    db_ticket = models.SupportTicket(
        id=str(uuid.uuid4()),
        user_id=user_id,
        subject=ticket.subject,
        description=ticket.description,
        status=models.TicketStatus.open,
        priority=ticket.priority,
        category=ticket.category,
        reference_number=reference_number,
        metadata=ticket.metadata
    )
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Create initial message from ticket description
    create_ticket_message(
        db,
        ticket_id=db_ticket.id,
        message=schemas.TicketMessageCreate(
            message=ticket.description,
            is_internal=False
        ),
        user_id=user_id
    )
    
    return db_ticket

def update_support_ticket(db: Session, ticket_id: str, ticket: schemas.SupportTicketUpdate) -> models.SupportTicket:
    """
    Update a support ticket
    """
    db_ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if not db_ticket:
        raise ValueError(f"Support ticket not found: {ticket_id}")
    
    # Update fields if provided
    if ticket.subject is not None:
        db_ticket.subject = ticket.subject
    
    if ticket.description is not None:
        db_ticket.description = ticket.description
    
    if ticket.status is not None:
        old_status = db_ticket.status
        db_ticket.status = ticket.status
        
        # If status changed to resolved, set resolved_at timestamp
        if ticket.status == models.TicketStatus.resolved and old_status != models.TicketStatus.resolved:
            db_ticket.resolved_at = datetime.utcnow()
        # If status changed from resolved, clear resolved_at timestamp
        elif old_status == models.TicketStatus.resolved and ticket.status != models.TicketStatus.resolved:
            db_ticket.resolved_at = None
    
    if ticket.priority is not None:
        db_ticket.priority = ticket.priority
    
    if ticket.category is not None:
        db_ticket.category = ticket.category
    
    if ticket.metadata is not None:
        db_ticket.metadata = ticket.metadata
    
    db_ticket.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_ticket)
    
    return db_ticket

def get_ticket_message(db: Session, message_id: str) -> Optional[models.TicketMessage]:
    """
    Get a ticket message by ID
    """
    return db.query(models.TicketMessage).filter(models.TicketMessage.id == message_id).first()

def create_ticket_message(db: Session, ticket_id: str, message: schemas.TicketMessageCreate, user_id: str) -> models.TicketMessage:
    """
    Create a new ticket message
    """
    db_message = models.TicketMessage(
        id=str(uuid.uuid4()),
        ticket_id=ticket_id,
        user_id=user_id,
        message=message.message,
        is_internal=message.is_internal,
        metadata=message.metadata
    )
    
    db.add(db_message)
    
    # Update ticket status and timestamp
    ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if ticket:
        # If customer replies to a waiting ticket, change status to open
        if ticket.status == models.TicketStatus.waiting:
            ticket.status = models.TicketStatus.open
        
        ticket.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_message)
    
    return db_message

def create_ticket_attachment(
    db: Session, 
    ticket_id: str, 
    user_id: str, 
    file_name: str, 
    file_content: bytes,
    file_type: str,
    message_id: Optional[str] = None
) -> models.TicketAttachment:
    """
    Create a new ticket attachment
    """
    # Upload file to storage
    file_url = upload_attachment(file_content, file_name, ticket_id)
    
    # Create attachment record
    db_attachment = models.TicketAttachment(
        id=str(uuid.uuid4()),
        ticket_id=ticket_id,
        message_id=message_id,
        user_id=user_id,
        file_name=file_name,
        file_size=len(file_content),
        file_type=file_type,
        file_url=file_url
    )
    
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    
    return db_attachment

def upload_attachment(file_content: bytes, file_name: str, ticket_id: str) -> str:
    """
    Upload an attachment to storage
    """
    # In a real implementation, this would upload to a storage service
    # For now, we'll return a mock URL
    
    # Generate a unique filename
    unique_filename = f"{uuid.uuid4()}_{file_name}"
    
    # Return mock URL
    return f"/api/support/attachments/{ticket_id}/{unique_filename}"

def send_ticket_notification(db: Session, ticket_id: str, notification_type: str, message_id: Optional[str] = None) -> None:
    """
    Send a notification for a ticket event
    """
    ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if not ticket:
        logger.error(f"Ticket not found for notification: {ticket_id}")
        return
    
    # Get user
    user = db.query(User).filter(User.id == ticket.user_id).first()
    if not user:
        logger.error(f"User not found for ticket notification: {ticket.user_id}")
        return
    
    # Get message if provided
    message = None
    if message_id:
        message = db.query(models.TicketMessage).filter(models.TicketMessage.id == message_id).first()
    
    # Prepare notification data
    notification_data = {
        "ticket_id": ticket.id,
        "reference_number": ticket.reference_number,
        "subject": ticket.subject,
        "status": ticket.status,
        "user_email": user.email,
        "user_name": user.full_name,
        "message": message.message if message else None,
        "notification_type": notification_type
    }
    
    # Send email notification
    try:
        if notification_type == "new_ticket":
            email_client.send_email(
                to=user.email,
                subject=f"Support Ticket Created: {ticket.reference_number}",
                template="new_ticket",
                template_data=notification_data
            )
            
            # Also notify support team
            email_client.send_email(
                to="support@dropflow.pro",
                subject=f"New Support Ticket: {ticket.reference_number}",
                template="new_ticket_admin",
                template_data=notification_data
            )
        
        elif notification_type == "new_message":
            email_client.send_email(
                to=user.email,
                subject=f"New Message on Ticket: {ticket.reference_number}",
                template="new_message",
                template_data=notification_data
            )
        
        elif notification_type == "ticket_resolved":
            email_client.send_email(
                to=user.email,
                subject=f"Ticket Resolved: {ticket.reference_number}",
                template="ticket_resolved",
                template_data=notification_data
            )
    
    except Exception as e:
        logger.error(f"Error sending ticket notification: {e}")

def generate_reference_number() -> str:
    """
    Generate a unique reference number for a ticket
    """
    # Format: TKT-YYYYMMDD-XXXXX
    date_part = datetime.utcnow().strftime("%Y%m%d")
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    
    return f"TKT-{date_part}-{random_part}"

def get_kb_categories(db: Session, parent_id: Optional[str] = None, active_only: bool = True) -> List[models.KnowledgeBaseCategory]:
    """
    Get knowledge base categories
    """
    query = db.query(models.KnowledgeBaseCategory)
    
    if parent_id:
        query = query.filter(models.KnowledgeBaseCategory.parent_id == parent_id)
    else:
        query = query.filter(models.KnowledgeBaseCategory.parent_id.is_(None))
    
    if active_only:
        query = query.filter(models.KnowledgeBaseCategory.is_active == True)
    
    query = query.order_by(models.KnowledgeBaseCategory.order)
    
    return query.all()

def get_kb_category(db: Session, category_id: str) -> Optional[models.KnowledgeBaseCategory]:
    """
    Get a knowledge base category by ID
    """
    return db.query(models.KnowledgeBaseCategory).filter(models.KnowledgeBaseCategory.id == category_id).first()

def get_kb_articles(
    db: Session, 
    category_id: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 10,
    offset: int = 0
) -> List[models.KnowledgeBaseArticle]:
    """
    Get knowledge base articles
    """
    query = db.query(models.KnowledgeBaseArticle).filter(models.KnowledgeBaseArticle.is_published == True)
    
    if category_id:
        query = query.filter(models.KnowledgeBaseArticle.category_id == category_id)
    
    if tag:
        # Filter by tag (JSON array contains)
        query = query.filter(models.KnowledgeBaseArticle.tags.contains([tag]))
    
    if search:
        # Search in title and content
        search_term = f"%{search}%"
        query = query.filter(
            (models.KnowledgeBaseArticle.title.ilike(search_term)) | 
            (models.KnowledgeBaseArticle.content.ilike(search_term))
        )
    
    query = query.order_by(models.KnowledgeBaseArticle.created_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_kb_article(db: Session, article_id: str) -> Optional[models.KnowledgeBaseArticle]:
    """
    Get a knowledge base article by ID
    """
    return db.query(models.KnowledgeBaseArticle).filter(models.KnowledgeBaseArticle.id == article_id).first()

def increment_article_view_count(db: Session, article_id: str) -> None:
    """
    Increment the view count for an article
    """
    article = db.query(models.KnowledgeBaseArticle).filter(models.KnowledgeBaseArticle.id == article_id).first()
    if article:
        article.view_count += 1
        db.commit()

def submit_article_feedback(
    db: Session, 
    article_id: str, 
    helpful: bool, 
    comment: Optional[str] = None,
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Submit feedback for a knowledge base article
    """
    article = db.query(models.KnowledgeBaseArticle).filter(models.KnowledgeBaseArticle.id == article_id).first()
    if not article:
        raise ValueError(f"Knowledge base article not found: {article_id}")
    
    # Update helpful/not helpful count
    if helpful:
        article.helpful_count += 1
    else:
        article.not_helpful_count += 1
    
    # Save comment in metadata if provided
    if comment:
        if not article.metadata:
            article.metadata = {}
        
        if "feedback" not in article.metadata:
            article.metadata["feedback"] = []
        
        article.metadata["feedback"].append({
            "helpful": helpful,
            "comment": comment,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    db.commit()
    
    return {
        "article_id": article_id,
        "helpful": helpful,
        "helpful_count": article.helpful_count,
        "not_helpful_count": article.not_helpful_count
    }

def create_chatbot_conversation(db: Session, conversation: schemas.ChatbotConversationCreate, user_id: Optional[str] = None) -> models.ChatbotConversation:
    """
    Create a new chatbot conversation
    """
    # Generate session ID if not provided
    session_id = conversation.session_id or str(uuid.uuid4())
    
    db_conversation = models.ChatbotConversation(
        id=str(uuid.uuid4()),
        user_id=user_id,
        session_id=session_id,
        title=conversation.title,
        metadata=conversation.metadata
    )
    
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    
    return db_conversation

def get_chatbot_conversations(db: Session, user_id: str, limit: int = 10, offset: int = 0) -> List[models.ChatbotConversation]:
    """
    Get chatbot conversations for a user
    """
    query = db.query(models.ChatbotConversation).filter(models.ChatbotConversation.user_id == user_id)
    query = query.order_by(models.ChatbotConversation.updated_at.desc())
    query = query.offset(offset).limit(limit)
    
    return query.all()

def get_chatbot_conversation(db: Session, conversation_id: str, user_id: Optional[str] = None) -> Optional[models.ChatbotConversation]:
    """
    Get a chatbot conversation by ID
    """
    query = db.query(models.ChatbotConversation).filter(models.ChatbotConversation.id == conversation_id)
    
    if user_id:
        query = query.filter(models.ChatbotConversation.user_id == user_id)
    
    return query.first()

def create_chatbot_message(db: Session, conversation_id: str, role: str, content: str) -> models.ChatbotMessage:
    """
    Create a new chatbot message
    """
    db_message = models.ChatbotMessage(
        id=str(uuid.uuid4()),
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    
    db.add(db_message)
    
    # Update conversation timestamp
    conversation = db.query(models.ChatbotConversation).filter(models.ChatbotConversation.id == conversation_id).first()
    if conversation:
        conversation.updated_at = datetime.utcnow()
        
        # Update title if it's empty and this is a user message
        if not conversation.title and role == "user":
            # Generate title from first user message
            conversation.title = generate_conversation_title(content)
    
    db.commit()
    db.refresh(db_message)
    
    return db_message

def generate_chatbot_response(db: Session, conversation_id: str) -> models.ChatbotMessage:
    """
    Generate a response from the chatbot
    """
    # Get conversation
    conversation = db.query(models.ChatbotConversation).filter(models.ChatbotConversation.id == conversation_id).first()
    if not conversation:
        raise ValueError(f"Chatbot conversation not found: {conversation_id}")
    
    # Get conversation history
    messages = db.query(models.ChatbotMessage).filter(
        models.ChatbotMessage.conversation_id == conversation_id
    ).order_by(models.ChatbotMessage.created_at).all()
    
    # Prepare conversation history for OpenAI
    history = []
    
    # Add system message
    history.append({
        "role": "system",
        "content": "You are a helpful assistant for DropFlow Pro, a dropshipping platform. You can help with questions about dropshipping, e-commerce, product sourcing, and using the DropFlow Pro platform."
    })
    
    # Add conversation history
    for msg in messages:
        history.append({
            "role": msg.role,
            "content": msg.content
        })
    
    # Generate response using OpenAI
    try:
        response = openai_client.generate_chat_completion(history)
        
        # Create assistant message
        return create_chatbot_message(db, conversation_id=conversation_id, role="assistant", content=response)
    
    except Exception as e:
        logger.error(f"Error generating chatbot response: {e}")
        
        # Create fallback response
        return create_chatbot_message(
            db, 
            conversation_id=conversation_id, 
            role="assistant", 
            content="I'm sorry, I'm having trouble generating a response right now. Please try again later or contact our support team for assistance."
        )

def query_chatbot(db: Session, query: str, user_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Query the chatbot without creating a conversation
    """
    try:
        # Prepare query for OpenAI
        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant for DropFlow Pro, a dropshipping platform. You can help with questions about dropshipping, e-commerce, product sourcing, and using the DropFlow Pro platform."
            },
            {
                "role": "user",
                "content": query
            }
        ]
        
        # Generate response using OpenAI
        response = openai_client.generate_chat_completion(messages)
        
        # Find related KB articles
        related_articles = find_related_kb_articles(db, query)
        
        return {
            "response": response,
            "related_articles": related_articles
        }
    
    except Exception as e:
        logger.error(f"Error querying chatbot: {e}")
        
        return {
            "response": "I'm sorry, I'm having trouble generating a response right now. Please try again later or contact our support team for assistance.",
            "related_articles": []
        }

def find_related_kb_articles(db: Session, query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Find knowledge base articles related to a query
    """
    # In a real implementation, this would use a search index or vector similarity
    # For now, we'll use a simple keyword search
    
    # Extract keywords from query
    keywords = re.findall(r'\b\w{3,}\b', query.lower())
    
    if not keywords:
        return []
    
    # Search for articles containing these keywords
    articles = []
    
    for keyword in keywords:
        search_term = f"%{keyword}%"
        results = db.query(models.KnowledgeBaseArticle).filter(
            models.KnowledgeBaseArticle.is_published == True,
            (models.KnowledgeBaseArticle.title.ilike(search_term)) | 
            (models.KnowledgeBaseArticle.content.ilike(search_term))
        ).limit(limit).all()
        
        for article in results:
            if article.id not in [a["id"] for a in articles]:
                articles.append({
                    "id": article.id,
                    "title": article.title,
                    "excerpt": article.excerpt or article.content[:100] + "...",
                    "url": f"/kb/articles/{article.slug}"
                })
            
            if len(articles) >= limit:
                break
        
        if len(articles) >= limit:
            break
    
    return articles

def generate_conversation_title(content: str) -> str:
    """
    Generate a title for a conversation based on the first message
    """
    # Truncate and clean up the content
    title = content.strip()
    
    # Limit to first sentence or first 50 characters
    sentence_end = title.find('.')
    if sentence_end > 0:
        title = title[:sentence_end + 1]
    
    if len(title) > 50:
        title = title[:47] + "..."
    
    return title