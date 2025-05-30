# Discovery Archaeology Agent

An AI agent that reverse-engineers the true origins of inventions by uncovering the chain of serendipitous discoveries, failed experiments, and unintended consequences that made them possible.

## Features

- **Deep Discovery Mapping**: Trace back through the web of prerequisites, accidents, and adjacent discoveries
- **Pattern Recognition**: Identify recurring themes across breakthroughs
- **Serendipity Analysis**: Highlight crucial moments where progress came from pursuing something entirely different
- **Objective Blindness Detection**: Show how rigid goals often missed the real breakthroughs

## Setup

1. Install dependencies:
```bash
poetry install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to the `.env` file

## Running the Application

```bash
poetry run python run.py
```

Or using uvicorn directly:
```bash
poetry run uvicorn discovery_archaeology_agent.api:app --reload
```

## API Endpoints

- `POST /inventions/analyze` - Analyze a new invention
- `GET /inventions` - List all analyzed inventions
- `GET /inventions/{id}` - Get specific invention analysis
- `GET /patterns` - Get identified patterns
- `POST /patterns/analyze` - Analyze patterns across inventions
- `GET /patterns/themes` - Get common themes
- `GET /patterns/timeline` - Get innovation timeline

## Example Usage

```python
import requests

# Analyze the microwave oven
response = requests.post("http://localhost:8000/inventions/analyze", json={
    "invention_name": "Microwave Oven"
})

print(response.json())
```