from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import os
from dotenv import load_dotenv
from typing import List, Optional
import logging

# Import modules
from api.auth.routes import router as auth_router
from api.crm.routes import router as crm_router
from api.import.routes import router as import_router
from api.seo.routes import router as seo_router
from api.sync.routes import router as sync_router
from api.tracking.routes import router as tracking_router
from api.winners.routes import router as winners_router
from api.analytics.routes import router as analytics_router
from api.support.routes import router as support_router
from api.legal.routes import router as legal_router
from api.social.routes import router as social_router

from database import get_db, Base, engine
from config import settings

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("dropflow")

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="DropFlow Pro API",
    description="Backend API for DropFlow Pro dropshipping platform",
    version="2.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(crm_router, prefix="/api/crm", tags=["CRM"])
app.include_router(import_router, prefix="/api/import", tags=["Import"])
app.include_router(seo_router, prefix="/api/seo", tags=["SEO"])
app.include_router(sync_router, prefix="/api/sync", tags=["Sync"])
app.include_router(tracking_router, prefix="/api/tracking", tags=["Tracking"])
app.include_router(winners_router, prefix="/api/winners", tags=["Winners"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(support_router, prefix="/api/support", tags=["Support"])
app.include_router(legal_router, prefix="/api/legal", tags=["Legal"])
app.include_router(social_router, prefix="/api/social", tags=["Social"])

@app.get("/", tags=["Health"])
async def root():
    return {"message": "Welcome to DropFlow Pro API", "version": "2.0.0"}

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)