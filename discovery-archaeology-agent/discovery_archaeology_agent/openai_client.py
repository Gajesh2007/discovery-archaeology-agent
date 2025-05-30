"""OpenAI O3 integration with structured outputs."""
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from typing import Optional
import json

from .schemas import InventionAnalysis, Discovery, Connection, DiscoveryType, PatternType
from .config import settings


class DiscoveryArchaeologyClient:
    """Client for analyzing invention origins using OpenAI O3."""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.openai_model,
            api_key=settings.openai_api_key,
            max_tokens=16000
        )
        
        # Create parser for structured output
        self.parser = PydanticOutputParser(pydantic_object=InventionAnalysis)
        
        # Create the analysis prompt
        self.analysis_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a Discovery Archaeology Agent that reverse-engineers the true origins of inventions.
Your goal is to uncover the chain of serendipitous discoveries, failed experiments, and unintended consequences that made inventions possible.

Focus on:
1. Accidental discoveries (like the microwave from a melted chocolate bar)
2. Failed experiments that led to unexpected successes
3. Cross-domain accidents where pursuing one goal revealed something entirely different
4. Hidden prerequisites - technologies/discoveries that had to exist first
5. Moments where rigid goals caused people to miss the real breakthroughs

IMPORTANT: When identifying patterns, be SELECTIVE and SPECIFIC. Only identify patterns that are clearly and strongly evident in the invention's history. Not every invention will exhibit every pattern type. It's better to identify 2-3 strong patterns than to force all patterns to fit.

Pattern Guidelines:
- accident_to_innovation: Only if a clear accident directly led to the breakthrough
- failure_to_success: Only if a genuine failure was converted to success
- wrong_goal_right_result: Only if pursuing one goal led to a completely different valuable outcome
- unexpected_observation: Only if an observation that wasn't anticipated became crucial
- cross_pollination: Only if knowledge from unrelated fields was essential
- prerequisite_chain: Only if there's a clear chain of required prior technologies

Be critical and evidence-based. If a pattern isn't clearly present, don't include it.

{format_instructions}

Provide a comprehensive analysis that tells the meandering story of how the invention actually came to be, not the simplified version typically told."""),
            ("human", """Analyze the invention: {invention_name}

{focus_prompt}

Remember to:
- Include specific dates, people, and locations when known
- Highlight the unexpected and accidental nature of discoveries
- Show how failures and mistakes led to breakthroughs
- Identify patterns that recur across innovation history
- Emphasize how the final invention couldn't have been planned""")
        ])
    
    def analyze_invention(self, invention_name: str, focus_areas: Optional[list] = None) -> InventionAnalysis:
        """Analyze an invention's true origins."""
        
        # Build focus prompt if specific areas requested
        focus_prompt = ""
        if focus_areas:
            focus_prompt = f"Pay special attention to: {', '.join(focus_areas)}"
        
        # Format the prompt with parser instructions
        formatted_prompt = self.analysis_prompt.format_messages(
            invention_name=invention_name,
            focus_prompt=focus_prompt,
            format_instructions=self.parser.get_format_instructions()
        )
        
        # Get response from LLM
        response = self.llm.invoke(formatted_prompt)
        
        # Parse the response into structured data
        try:
            # Try to parse the response content
            analysis = self.parser.parse(response.content)
            return analysis
        except Exception as e:
            # If parsing fails, try to extract JSON from the response
            try:
                # Look for JSON in the response
                content = response.content
                start_idx = content.find('{')
                end_idx = content.rfind('}') + 1
                if start_idx != -1 and end_idx > start_idx:
                    json_str = content[start_idx:end_idx]
                    data = json.loads(json_str)
                    return InventionAnalysis(**data)
            except:
                raise ValueError(f"Failed to parse LLM response: {e}")
    
    def find_pattern_across_inventions(self, inventions: list[str], pattern_type: PatternType) -> dict:
        """Find a specific pattern across multiple inventions."""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are analyzing multiple inventions to identify recurring patterns in innovation.
Focus on finding examples of the {pattern_type} pattern across the given inventions."""),
            ("human", """Analyze these inventions for the {pattern_type} pattern:
{inventions_list}

For each invention, provide:
1. A specific example of this pattern
2. How it manifested in that invention's history
3. The impact it had on the final innovation

Return a JSON object with:
- pattern_description: Overall description of this pattern
- examples: List of {{"invention": "name", "example": "description", "impact": "result"}}
- insights: What this pattern teaches about innovation""")
        ])
        
        formatted_prompt = prompt.format_messages(
            pattern_type=pattern_type.value,
            inventions_list="\n".join(f"- {inv}" for inv in inventions)
        )
        
        response = self.llm.invoke(formatted_prompt)
        
        try:
            # Parse JSON response
            content = response.content
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = content[start_idx:end_idx]
                return json.loads(json_str)
        except:
            return {
                "pattern_description": "Failed to analyze pattern",
                "examples": [],
                "insights": "Analysis failed"
            }