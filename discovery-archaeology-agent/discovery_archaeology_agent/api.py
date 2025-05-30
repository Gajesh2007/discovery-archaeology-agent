"""FastAPI application and endpoints."""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict

from .database import get_db, init_db
from .discovery_engine import DiscoveryEngine
from .pattern_analyzer import PatternAnalyzer
from .schemas import (
    InventionRequest, InventionResponse, PatternAnalysis
)
from .config import settings


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI agent that reverse-engineers the true origins of inventions"
)

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    init_db()


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running"
    }


@app.post("/inventions/analyze", response_model=InventionResponse)
async def analyze_invention(
    request: InventionRequest,
    db: Session = Depends(get_db)
):
    """Analyze an invention's origins."""
    try:
        engine = DiscoveryEngine(db)
        result = engine.analyze_invention(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/inventions", response_model=List[Dict])
async def list_inventions(db: Session = Depends(get_db)):
    """List all analyzed inventions."""
    engine = DiscoveryEngine(db)
    return engine.list_inventions()


@app.get("/inventions/{invention_id}", response_model=InventionResponse)
async def get_invention(
    invention_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific invention analysis."""
    engine = DiscoveryEngine(db)
    result = engine.get_invention(invention_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Invention not found")
    
    return result


@app.get("/patterns", response_model=List[PatternAnalysis])
async def get_patterns(db: Session = Depends(get_db)):
    """Get all identified patterns across inventions."""
    engine = DiscoveryEngine(db)
    return engine.get_patterns()


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/patterns/analyze")
async def analyze_patterns(db: Session = Depends(get_db)):
    """Analyze patterns across all inventions."""
    analyzer = PatternAnalyzer(db)
    patterns = analyzer.analyze_all_patterns()
    return patterns


@app.get("/patterns/themes")
async def get_common_themes(db: Session = Depends(get_db)):
    """Get common themes across inventions."""
    analyzer = PatternAnalyzer(db)
    themes = analyzer.find_common_themes()
    return themes


@app.get("/patterns/timeline")
async def get_innovation_timeline(db: Session = Depends(get_db)):
    """Get timeline of innovations."""
    analyzer = PatternAnalyzer(db)
    timeline = analyzer.get_innovation_timeline()
    return timeline