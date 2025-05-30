"""Pydantic schemas for structured data validation."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DiscoveryType(str, Enum):
    """Types of discoveries that can lead to inventions."""
    ACCIDENTAL = "accidental"
    FAILED_EXPERIMENT = "failed_experiment"
    CROSS_DOMAIN = "cross_domain"
    PREREQUISITE = "prerequisite"
    SERENDIPITOUS = "serendipitous"
    OBSERVATION = "observation"


class PatternType(str, Enum):
    """Recurring patterns in invention histories."""
    FAILURE_TO_SUCCESS = "failure_to_success"
    WRONG_GOAL_RIGHT_RESULT = "wrong_goal_right_result"
    UNEXPECTED_OBSERVATION = "unexpected_observation"
    CROSS_POLLINATION = "cross_pollination"
    PREREQUISITE_CHAIN = "prerequisite_chain"
    ACCIDENT_TO_INNOVATION = "accident_to_innovation"


class Discovery(BaseModel):
    """A single discovery or event in the invention's history."""
    id: Optional[str] = None
    year: Optional[int] = Field(None, description="Year of the discovery")
    title: str = Field(..., description="Brief title of the discovery")
    description: str = Field(..., description="Detailed description of what happened")
    discoverers: List[str] = Field(default_factory=list, description="People involved")
    discovery_type: DiscoveryType = Field(..., description="Type of discovery")
    original_goal: Optional[str] = Field(None, description="What was originally being pursued")
    actual_outcome: str = Field(..., description="What actually happened")
    significance: str = Field(..., description="Why this was important for the final invention")
    location: Optional[str] = Field(None, description="Where this discovery occurred")


class Connection(BaseModel):
    """Connection between discoveries."""
    from_discovery_id: str
    to_discovery_id: str
    relationship_type: str = Field(..., description="How these discoveries are connected")
    description: str = Field(..., description="Explanation of the connection")


class InventionAnalysis(BaseModel):
    """Complete analysis of an invention's origins."""
    invention_name: str = Field(..., description="Name of the invention")
    invention_year: Optional[int] = Field(None, description="Year the invention was completed")
    summary: str = Field(..., description="Brief summary of the invention")
    
    # Chain of discoveries
    discoveries: List[Discovery] = Field(..., description="All discoveries that led to this invention")
    connections: List[Connection] = Field(default_factory=list, description="How discoveries connect")
    
    # Pattern analysis
    patterns_identified: List[PatternType] = Field(..., description="Patterns found in this invention's history")
    pattern_explanations: Dict[str, str] = Field(..., description="Explanations for each pattern")
    
    # Key insights
    serendipity_moments: List[str] = Field(..., description="Key moments of serendipity")
    critical_prerequisites: List[str] = Field(..., description="Technologies/knowledge that had to exist first")
    objective_blindness_examples: List[str] = Field(..., description="Examples where rigid goals missed opportunities")
    
    # Overall narrative
    narrative: str = Field(..., description="The complete story of how this invention came to be")
    key_lesson: str = Field(..., description="Main lesson about innovation from this invention")


class InventionRequest(BaseModel):
    """Request to analyze an invention."""
    invention_name: str = Field(..., description="Name of the invention to analyze")
    focus_areas: Optional[List[str]] = Field(None, description="Specific aspects to focus on")


class InventionResponse(BaseModel):
    """Response with invention analysis."""
    analysis: InventionAnalysis
    id: int
    created_at: datetime
    
    
class PatternAnalysis(BaseModel):
    """Cross-invention pattern analysis."""
    pattern_type: PatternType
    description: str
    inventions: List[str] = Field(..., description="Inventions that exhibit this pattern")
    examples: List[Dict[str, str]] = Field(..., description="Specific examples from each invention")
    insights: str = Field(..., description="What this pattern teaches about innovation")