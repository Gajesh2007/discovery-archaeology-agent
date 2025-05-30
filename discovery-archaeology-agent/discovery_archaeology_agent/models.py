"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


# Association table for many-to-many relationship between inventions and patterns
invention_patterns = Table(
    'invention_patterns',
    Base.metadata,
    Column('invention_id', Integer, ForeignKey('inventions.id')),
    Column('pattern_id', Integer, ForeignKey('patterns.id'))
)


class InventionModel(Base):
    """Database model for inventions."""
    __tablename__ = "inventions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    year = Column(Integer, nullable=True)
    summary = Column(Text)
    narrative = Column(Text)
    key_lesson = Column(Text)
    
    # JSON fields for complex data
    serendipity_moments = Column(JSON)
    critical_prerequisites = Column(JSON)
    objective_blindness_examples = Column(JSON)
    pattern_explanations = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    discoveries = relationship("DiscoveryModel", back_populates="invention", cascade="all, delete-orphan")
    patterns = relationship("PatternModel", secondary=invention_patterns, back_populates="inventions")


class DiscoveryModel(Base):
    """Database model for individual discoveries."""
    __tablename__ = "discoveries"
    
    id = Column(Integer, primary_key=True, index=True)
    invention_id = Column(Integer, ForeignKey("inventions.id"))
    
    year = Column(Integer, nullable=True)
    title = Column(String)
    description = Column(Text)
    discovery_type = Column(String)
    original_goal = Column(Text, nullable=True)
    actual_outcome = Column(Text)
    significance = Column(Text)
    location = Column(String, nullable=True)
    
    # JSON field for discoverers list
    discoverers = Column(JSON)
    
    # Relationship
    invention = relationship("InventionModel", back_populates="discoveries")
    
    # Connections
    connections_from = relationship("ConnectionModel", foreign_keys="ConnectionModel.from_discovery_id", back_populates="from_discovery", cascade="all, delete-orphan")
    connections_to = relationship("ConnectionModel", foreign_keys="ConnectionModel.to_discovery_id", back_populates="to_discovery", cascade="all, delete-orphan")


class ConnectionModel(Base):
    """Database model for connections between discoveries."""
    __tablename__ = "connections"
    
    id = Column(Integer, primary_key=True, index=True)
    from_discovery_id = Column(Integer, ForeignKey("discoveries.id"))
    to_discovery_id = Column(Integer, ForeignKey("discoveries.id"))
    relationship_type = Column(String)
    description = Column(Text)
    
    # Relationships
    from_discovery = relationship("DiscoveryModel", foreign_keys=[from_discovery_id], back_populates="connections_from")
    to_discovery = relationship("DiscoveryModel", foreign_keys=[to_discovery_id], back_populates="connections_to")


class PatternModel(Base):
    """Database model for innovation patterns."""
    __tablename__ = "patterns"
    
    id = Column(Integer, primary_key=True, index=True)
    pattern_type = Column(String, unique=True, index=True)
    description = Column(Text)
    insights = Column(Text)
    
    # JSON field for examples
    examples = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    inventions = relationship("InventionModel", secondary=invention_patterns, back_populates="patterns")