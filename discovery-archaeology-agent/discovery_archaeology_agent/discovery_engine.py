"""Core discovery engine for analyzing invention origins."""
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
import uuid

from .schemas import (
    InventionAnalysis, InventionRequest, InventionResponse,
    PatternAnalysis, PatternType, Discovery, Connection, DiscoveryType
)
from .models import (
    InventionModel, DiscoveryModel, ConnectionModel, PatternModel
)
from .openai_client import DiscoveryArchaeologyClient
from .database import get_db


class DiscoveryEngine:
    """Core engine for discovering invention origins."""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.client = DiscoveryArchaeologyClient()
    
    def analyze_invention(self, request: InventionRequest) -> InventionResponse:
        """Analyze an invention and store results in database."""
        
        # Check if invention already exists in database
        existing = self.db.query(InventionModel).filter(
            InventionModel.name == request.invention_name
        ).first()
        
        if existing:
            # Return existing analysis
            return self._model_to_response(existing)
        
        # Get analysis from OpenAI
        analysis = self.client.analyze_invention(
            invention_name=request.invention_name,
            focus_areas=request.focus_areas
        )
        
        # Store in database
        invention_model = self._save_analysis(analysis)
        
        # Update patterns
        self._update_patterns(invention_model, analysis)
        
        return self._model_to_response(invention_model)
    
    def get_invention(self, invention_id: int) -> Optional[InventionResponse]:
        """Get a specific invention analysis."""
        invention = self.db.query(InventionModel).filter(
            InventionModel.id == invention_id
        ).first()
        
        if invention:
            return self._model_to_response(invention)
        return None
    
    def list_inventions(self) -> List[Dict]:
        """List all analyzed inventions."""
        inventions = self.db.query(InventionModel).all()
        return [
            {
                "id": inv.id,
                "name": inv.name,
                "year": inv.year,
                "summary": inv.summary,
                "created_at": inv.created_at
            }
            for inv in inventions
        ]
    
    def get_patterns(self) -> List[PatternAnalysis]:
        """Get all identified patterns across inventions."""
        patterns = self.db.query(PatternModel).all()
        return [
            PatternAnalysis(
                pattern_type=PatternType(p.pattern_type),
                description=p.description,
                inventions=[inv.name for inv in p.inventions],
                examples=p.examples or [],
                insights=p.insights
            )
            for p in patterns
        ]
    
    def _save_analysis(self, analysis: InventionAnalysis) -> InventionModel:
        """Save invention analysis to database."""
        
        # Create invention model
        invention = InventionModel(
            name=analysis.invention_name,
            year=analysis.invention_year,
            summary=analysis.summary,
            narrative=analysis.narrative,
            key_lesson=analysis.key_lesson,
            serendipity_moments=analysis.serendipity_moments,
            critical_prerequisites=analysis.critical_prerequisites,
            objective_blindness_examples=analysis.objective_blindness_examples,
            pattern_explanations=analysis.pattern_explanations
        )
        
        # Create discovery models
        discovery_map = {}  # Map discovery titles to models for connections
        
        for disc in analysis.discoveries:
            discovery_model = DiscoveryModel(
                year=disc.year,
                title=disc.title,
                description=disc.description,
                discovery_type=disc.discovery_type.value,
                original_goal=disc.original_goal,
                actual_outcome=disc.actual_outcome,
                significance=disc.significance,
                location=disc.location,
                discoverers=disc.discoverers
            )
            invention.discoveries.append(discovery_model)
            
            # Generate ID if not provided
            disc_id = disc.id or str(uuid.uuid4())
            discovery_map[disc_id] = discovery_model
        
        # Save to get IDs
        self.db.add(invention)
        self.db.flush()
        
        # Create connections
        for conn in analysis.connections:
            if conn.from_discovery_id in discovery_map and conn.to_discovery_id in discovery_map:
                connection = ConnectionModel(
                    from_discovery_id=discovery_map[conn.from_discovery_id].id,
                    to_discovery_id=discovery_map[conn.to_discovery_id].id,
                    relationship_type=conn.relationship_type,
                    description=conn.description
                )
                self.db.add(connection)
        
        self.db.commit()
        self.db.refresh(invention)
        
        return invention
    
    def _update_patterns(self, invention: InventionModel, analysis: InventionAnalysis):
        """Update pattern analysis with new invention."""
        
        for pattern_type in analysis.patterns_identified:
            # Check if pattern exists
            pattern = self.db.query(PatternModel).filter(
                PatternModel.pattern_type == pattern_type.value
            ).first()
            
            if not pattern:
                # Create new pattern
                pattern = PatternModel(
                    pattern_type=pattern_type.value,
                    description=f"Pattern: {pattern_type.value}",
                    insights="",
                    examples=[]
                )
                self.db.add(pattern)
            
            # Add invention to pattern
            if invention not in pattern.inventions:
                pattern.inventions.append(invention)
            
            # Update examples if we have pattern explanations
            if pattern_type.value in analysis.pattern_explanations:
                if not pattern.examples:
                    pattern.examples = []
                
                pattern.examples.append({
                    "invention": invention.name,
                    "explanation": analysis.pattern_explanations[pattern_type.value]
                })
        
        self.db.commit()
    
    def _model_to_response(self, invention: InventionModel) -> InventionResponse:
        """Convert database model to response schema."""
        
        # Reconstruct discoveries
        discoveries = []
        for disc in invention.discoveries:
            discoveries.append(Discovery(
                id=str(disc.id),
                year=disc.year,
                title=disc.title,
                description=disc.description,
                discovery_type=DiscoveryType(disc.discovery_type),
                original_goal=disc.original_goal,
                actual_outcome=disc.actual_outcome,
                significance=disc.significance,
                location=disc.location,
                discoverers=disc.discoverers or []
            ))
        
        # Reconstruct connections
        connections = []
        for disc in invention.discoveries:
            for conn in disc.connections_from:
                connections.append(Connection(
                    from_discovery_id=str(conn.from_discovery_id),
                    to_discovery_id=str(conn.to_discovery_id),
                    relationship_type=conn.relationship_type,
                    description=conn.description
                ))
        
        # Reconstruct patterns
        patterns = [PatternType(p.pattern_type) for p in invention.patterns]
        
        analysis = InventionAnalysis(
            invention_name=invention.name,
            invention_year=invention.year,
            summary=invention.summary,
            discoveries=discoveries,
            connections=connections,
            patterns_identified=patterns,
            pattern_explanations=invention.pattern_explanations or {},
            serendipity_moments=invention.serendipity_moments or [],
            critical_prerequisites=invention.critical_prerequisites or [],
            objective_blindness_examples=invention.objective_blindness_examples or [],
            narrative=invention.narrative,
            key_lesson=invention.key_lesson
        )
        
        return InventionResponse(
            analysis=analysis,
            id=invention.id,
            created_at=invention.created_at
        )