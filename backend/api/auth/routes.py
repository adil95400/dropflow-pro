from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Any, List
from datetime import timedelta
import logging

from database import get_db
from . import schemas, services, models

router = APIRouter()
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

@router.post("/register", response_model=schemas.UserResponse)
async def register(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Register a new user.
    """
    user = services.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = services.create_user(db, user=user_in)
    return user

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = services.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=services.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = services.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Log login activity
    services.log_login(db, user.id, "password")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
    }

@router.post("/refresh-token", response_model=schemas.Token)
async def refresh_access_token(
    refresh_token: str = Body(..., embed=True),
    db: Session = Depends(get_db)
) -> Any:
    """
    Refresh access token.
    """
    try:
        payload = services.decode_token(refresh_token)
        email = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        user = services.get_user_by_email(db, email=email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        
        access_token_expires = timedelta(minutes=services.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = services.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email,
        }
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

@router.post("/logout")
async def logout(
    request: Request,
    current_user: models.User = Depends(services.get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Logout current user.
    """
    auth_header = request.headers.get("Authorization")
    if auth_header:
        token = auth_header.split(" ")[1]
        services.invalidate_token(db, token, current_user.id)
    
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(
    current_user: models.User = Depends(services.get_current_user)
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
async def update_user_me(
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(services.get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Update current user.
    """
    user = services.update_user(db, user_id=current_user.id, user_in=user_in)
    return user

@router.post("/password-reset", response_model=schemas.Msg)
async def reset_password(
    email: str = Body(..., embed=True),
    db: Session = Depends(get_db)
) -> Any:
    """
    Password recovery.
    """
    user = services.get_user_by_email(db, email=email)
    if not user:
        # Don't reveal that the user doesn't exist
        return {"msg": "Password reset email sent"}
    
    password_reset_token = services.generate_password_reset_token(email=email)
    services.send_reset_password_email(email=email, token=password_reset_token)
    return {"msg": "Password reset email sent"}

@router.post("/password-reset-confirm", response_model=schemas.Msg)
async def reset_password_confirm(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
) -> Any:
    """
    Reset password.
    """
    email = services.verify_password_reset_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token",
        )
    
    user = services.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    services.update_user_password(db, user_id=user.id, password=new_password)
    return {"msg": "Password updated successfully"}

@router.get("/sessions", response_model=List[schemas.SessionInfo])
async def get_user_sessions(
    current_user: models.User = Depends(services.get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Get all active sessions for current user.
    """
    sessions = services.get_user_sessions(db, user_id=current_user.id)
    return sessions

@router.delete("/sessions/{session_id}", response_model=schemas.Msg)
async def delete_session(
    session_id: str,
    current_user: models.User = Depends(services.get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delete a specific session.
    """
    session = services.get_session_by_id(db, session_id=session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )
    
    services.delete_session(db, session_id=session_id)
    return {"msg": "Session terminated successfully"}