## Discovery Archaeology Agent

**What it does:**  
An AI agent that reverse-engineers the true origins of inventions by uncovering the chain of serendipitous discoveries, failed experiments, and unintended consequences that made them possible.

**Core Features:**
- **Deep Discovery Mapping**: Input any invention and trace back through the web of prerequisites, accidents, and adjacent discoveries that enabled it
- **Pattern Recognition**: Identifies recurring themes across breakthroughs (e.g., discoveries from failures, cross-domain accidents, unexpected observations)
- **Serendipity Analysis**: Highlights crucial moments where progress came from pursuing something entirely different
- **Objective Blindness Detection**: Shows how rigid goals often missed the real breakthroughs happening at the periphery

**Key Insights It Reveals:**
- Why the microwave exists because of a melted chocolate bar
- How computers emerged from vacuum tube experiments with different aims
- The hidden prerequisites that had to exist decades before the "invention"
- Why the most transformative discoveries couldn't have been planned

**Output Format:**
Visual timeline + narrative showing the meandering path from unrelated discoveries to final invention, with pattern analysis across multiple inventions showing how greatness emerges from exploration, not planning.

## Tech Stack

- Don't work on Frontend yet, but keep the APIs to ping it
- Use Poetry (Python) 
- Use Langchain
- Use OpenAI O3 (o3-2025-04-16) for getting all this information, make sure you use structured outputs
- Store in SQLite Database, the outputs

## More Details

- User should input the invention name
- We should query the LLM to get the explaination, reasonings, breakthrough, connections, etc as we discussed before
- It should get connected map of everything with explaination and stories (will be shown on frontend)
- Discovery Timeline

