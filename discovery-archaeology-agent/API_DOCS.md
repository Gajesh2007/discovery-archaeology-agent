# Discovery Archaeology Agent API Documentation

## Base URL
```
http://localhost:8000
```

## Endpoints

### 1. Analyze Invention
Analyze the origin story of an invention.

**POST** `/inventions/analyze`

Request Body:
```json
{
  "invention_name": "Microwave Oven",
  "focus_areas": ["accidents", "failed experiments"]  // optional
}
```

Response:
```json
{
  "analysis": {
    "invention_name": "Microwave Oven",
    "invention_year": 1945,
    "summary": "...",
    "discoveries": [...],
    "connections": [...],
    "patterns_identified": ["ACCIDENTAL", "CROSS_DOMAIN"],
    "serendipity_moments": [...],
    "critical_prerequisites": [...],
    "narrative": "...",
    "key_lesson": "..."
  },
  "id": 1,
  "created_at": "2024-01-01T00:00:00"
}
```

### 2. List Inventions
Get all analyzed inventions.

**GET** `/inventions`

Response:
```json
[
  {
    "id": 1,
    "name": "Microwave Oven",
    "year": 1945,
    "summary": "...",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

### 3. Get Specific Invention
Get detailed analysis of a specific invention.

**GET** `/inventions/{invention_id}`

Response: Same as POST /inventions/analyze

### 4. Get Patterns
Get all identified patterns across inventions.

**GET** `/patterns`

Response:
```json
[
  {
    "pattern_type": "ACCIDENTAL",
    "description": "...",
    "inventions": ["Microwave Oven", "Penicillin"],
    "examples": [...],
    "insights": "..."
  }
]
```

### 5. Analyze Patterns
Analyze patterns across all inventions in database.

**POST** `/patterns/analyze`

Response: List of pattern analyses

### 6. Get Common Themes
Get common themes across inventions.

**GET** `/patterns/themes`

Response:
```json
{
  "Accidental Discoveries": ["Microwave Oven", "X-ray"],
  "Failures Leading to Success": ["Post-it Notes"],
  "Built on Prerequisites": ["Computer"],
  "Missed Initial Opportunities": ["Telephone"]
}
```

### 7. Get Innovation Timeline
Get chronological timeline of innovations.

**GET** `/patterns/timeline`

Response:
```json
[
  {
    "year": 1928,
    "invention": "Penicillin",
    "key_discovery": "Mold contamination",
    "pattern_count": 3,
    "prerequisite_count": 2
  }
]
```

### 8. Health Check
Check API health status.

**GET** `/health`

Response:
```json
{
  "status": "healthy"
}
```

## Error Responses

All endpoints may return error responses in the format:
```json
{
  "detail": "Error message"
}
```

Common HTTP status codes:
- 200: Success
- 404: Not found
- 500: Server error