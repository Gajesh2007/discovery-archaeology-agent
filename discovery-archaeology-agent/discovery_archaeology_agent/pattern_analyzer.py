"""Pattern analysis across multiple inventions."""
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from collections import defaultdict

from .models import InventionModel, PatternModel
from .schemas import PatternType, PatternAnalysis
from .openai_client import DiscoveryArchaeologyClient


class PatternAnalyzer:
    """Analyze patterns across multiple inventions."""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.client = DiscoveryArchaeologyClient()
    
    def analyze_all_patterns(self) -> List[PatternAnalysis]:
        """Analyze all patterns across all inventions in database."""
        
        # Get all inventions
        inventions = self.db.query(InventionModel).all()
        
        if len(inventions) < 2:
            return []  # Need at least 2 inventions for pattern analysis
        
        # Analyze each pattern type
        results = []
        for pattern_type in PatternType:
            analysis = self._analyze_pattern_type(inventions, pattern_type)
            if analysis:
                results.append(analysis)
        
        return results
    
    def _analyze_pattern_type(
        self, 
        inventions: List[InventionModel], 
        pattern_type: PatternType
    ) -> Optional[PatternAnalysis]:
        """Analyze a specific pattern type across inventions."""
        
        # Get inventions that have this pattern
        relevant_inventions = []
        for inv in inventions:
            if inv.patterns:
                for pattern in inv.patterns:
                    if pattern.pattern_type == pattern_type.value:
                        relevant_inventions.append(inv)
                        break
        
        if len(relevant_inventions) < 2:
            return None
        
        # Use LLM to find deeper connections
        invention_names = [inv.name for inv in relevant_inventions]
        pattern_data = self.client.find_pattern_across_inventions(
            invention_names, 
            pattern_type
        )
        
        # Update or create pattern in database
        pattern_model = self.db.query(PatternModel).filter(
            PatternModel.pattern_type == pattern_type.value
        ).first()
        
        if not pattern_model:
            pattern_model = PatternModel(
                pattern_type=pattern_type.value,
                description=pattern_data.get("pattern_description", ""),
                insights=pattern_data.get("insights", ""),
                examples=pattern_data.get("examples", [])
            )
            self.db.add(pattern_model)
        else:
            pattern_model.description = pattern_data.get("pattern_description", pattern_model.description)
            pattern_model.insights = pattern_data.get("insights", pattern_model.insights)
            pattern_model.examples = pattern_data.get("examples", pattern_model.examples)
        
        # Ensure all relevant inventions are linked
        for inv in relevant_inventions:
            if inv not in pattern_model.inventions:
                pattern_model.inventions.append(inv)
        
        self.db.commit()
        
        return PatternAnalysis(
            pattern_type=pattern_type,
            description=pattern_model.description,
            inventions=invention_names,
            examples=pattern_model.examples or [],
            insights=pattern_model.insights
        )
    
    def find_common_themes(self) -> Dict[str, List[str]]:
        """Find common themes across all inventions."""
        
        themes = defaultdict(list)
        inventions = self.db.query(InventionModel).all()
        
        for inv in inventions:
            # Check serendipity moments
            if inv.serendipity_moments:
                for moment in inv.serendipity_moments:
                    if "accident" in moment.lower():
                        themes["Accidental Discoveries"].append(inv.name)
                    if "fail" in moment.lower():
                        themes["Failures Leading to Success"].append(inv.name)
            
            # Check prerequisites
            if inv.critical_prerequisites:
                themes["Built on Prerequisites"].append(inv.name)
            
            # Check objective blindness
            if inv.objective_blindness_examples:
                themes["Missed Initial Opportunities"].append(inv.name)
        
        # Remove duplicates
        for theme in themes:
            themes[theme] = list(set(themes[theme]))
        
        return dict(themes)
    
    def get_innovation_timeline(self) -> List[Dict]:
        """Create a timeline of innovations showing connections."""
        
        inventions = self.db.query(InventionModel).order_by(InventionModel.year).all()
        
        timeline = []
        for inv in inventions:
            if inv.year:
                timeline.append({
                    "year": inv.year,
                    "invention": inv.name,
                    "key_discovery": inv.discoveries[0].title if inv.discoveries else "Unknown",
                    "pattern_count": len(inv.patterns),
                    "prerequisite_count": len(inv.critical_prerequisites) if inv.critical_prerequisites else 0
                })
        
        return timeline