from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Union, Any, Dict
import logging
import uuid
import os
from email.message import EmailMessage
import smtplib

from database import get_db
from . import models, schemas
from config import settings

# Constants
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")
logger = logging.getLogger(__name__)

# Password hashing
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# User CRUD operations
def get_user(db: Session, user_id: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        id=str(uuid.uuid4()),
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create user profile and settings
    db_profile = models.UserProfile(user_id=db_user.id)
    db_settings = models.UserSettings(user_id=db_user.id)
    
    db.add(db_profile)
    db.add(db_settings)
    db.commit()
    
    return db_user

def update_user(
    db: Session, user_id: str, user_in: Union[schemas.UserUpdate, Dict[str, Any]]
) -> models.User:
    db_user = get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.dict(exclude_unset=True) if isinstance(user_in, schemas.UserUpdate) else user_in
    
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_password(db: Session, user_id: str, password: str) -> models.User:
    db_user = get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.hashed_password = get_password_hash(password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> bool:
    db_user = get_user(db, user_id=user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

# Authentication
def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email=email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        logger.error(f"Token decode error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError as e:
        logger.error(f"JWT error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user = get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Password reset
def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=24)
    now = datetime.utcnow()
    expires = now + delta
    encoded_jwt = jwt.encode(
        {"exp": expires, "nbf": now, "sub": email},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    return encoded_jwt

def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        return None

# Email
def send_reset_password_email(email: str, token: str) -> None:
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    msg = EmailMessage()
    msg.set_content(
        f"Please click the link below to reset your password:\n\n{reset_link}\n\n"
        f"This link will expire in 24 hours.\n\n"
        f"If you did not request a password reset, please ignore this email."
    )
    
    msg["Subject"] = "Password Reset - DropFlow Pro"
    msg["From"] = settings.EMAILS_FROM_EMAIL
    msg["To"] = email
    
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            logger.info(f"Password reset email sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")

# Session management
def create_session(
    db: Session, user_id: str, token: str, ip_address: Optional[str] = None, user_agent: Optional[str] = None
) -> models.Session:
    expires_at = datetime.utcnow() + timedelta(days=30)
    db_session = models.Session(
        id=str(uuid.uuid4()),
        user_id=user_id,
        token=token,
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=expires_at,
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_session_by_token(db: Session, token: str) -> Optional[models.Session]:
    return db.query(models.Session).filter(models.Session.token == token).first()

def get_session_by_id(db: Session, session_id: str) -> Optional[models.Session]:
    return db.query(models.Session).filter(models.Session.id == session_id).first()

def get_user_sessions(db: Session, user_id: str) -> List[models.Session]:
    return db.query(models.Session).filter(
        models.Session.user_id == user_id,
        models.Session.expires_at > datetime.utcnow()
    ).all()

def delete_session(db: Session, session_id: str) -> bool:
    db_session = get_session_by_id(db, session_id=session_id)
    if not db_session:
        return False
    
    db.delete(db_session)
    db.commit()
    return True

def invalidate_token(db: Session, token: str, user_id: str) -> None:
    db_session = get_session_by_token(db, token=token)
    if db_session and db_session.user_id == user_id:
        db.delete(db_session)
        db.commit()

def log_login(db: Session, user_id: str, method: str) -> None:
    # In a real app, log to database
    logger.info(f"User {user_id} logged in via {method}")