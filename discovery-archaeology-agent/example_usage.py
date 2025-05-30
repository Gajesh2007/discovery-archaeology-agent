"""Example usage of the Discovery Archaeology Agent."""
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up environment if not already done
if not os.getenv("OPENAI_API_KEY"):
    print("Please set OPENAI_API_KEY in your .env file")
    exit(1)

# Import after env is loaded
import requests
import json


def analyze_invention(invention_name: str):
    """Analyze an invention and display results."""
    
    print(f"\n🔍 Analyzing '{invention_name}'...")
    
    response = requests.post(
        "http://localhost:8000/inventions/analyze",
        json={"invention_name": invention_name}
    )
    
    if response.status_code == 200:
        data = response.json()
        analysis = data["analysis"]
        
        print(f"\n📖 Summary: {analysis['summary']}")
        print(f"\n🎯 Key Lesson: {analysis['key_lesson']}")
        
        print(f"\n⚡ Serendipity Moments ({len(analysis['serendipity_moments'])}):")
        for moment in analysis['serendipity_moments'][:3]:
            print(f"  • {moment}")
        
        print(f"\n🔗 Critical Prerequisites ({len(analysis['critical_prerequisites'])}):")
        for prereq in analysis['critical_prerequisites'][:3]:
            print(f"  • {prereq}")
        
        print(f"\n📊 Patterns Identified:")
        for pattern in analysis['patterns_identified']:
            print(f"  • {pattern}")
        
        print(f"\n💡 Discoveries in Chain: {len(analysis['discoveries'])}")
        
        # Show the actual discoveries
        if analysis['discoveries']:
            print(f"\n🔗 Discovery Chain:")
            for i, discovery in enumerate(analysis['discoveries'], 1):  # Show all discoveries
                year_str = f" ({discovery['year']})" if discovery['year'] else ""
                print(f"  {i}. {discovery['title']}{year_str}")
                print(f"     {discovery['description'][:120]}...")
                if discovery['discovery_type']:
                    print(f"     Type: {discovery['discovery_type']}")
                print()
        
        return data["id"]
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
        return None


def main():
    """Run example analysis."""
    
    print("Discovery Archaeology Agent - Example Usage")
    print("=" * 50)
    
    # Check if API is running
    try:
        health = requests.get("http://localhost:8000/health")
        if health.status_code != 200:
            print("❌ API is not running. Please start it with: poetry run python run.py")
            return
    except:
        print("❌ API is not running. Please start it with: poetry run python run.py")
        return
    
    # Example inventions to analyze
    inventions = [
        "Microwave Oven",
        "Penicillin",
        "Post-it Notes",
        "X-ray"
    ]
    
    print("\n🚀 Starting analysis of famous inventions...")
    
    # Analyze each invention
    invention_ids = []
    for invention in inventions:
        inv_id = analyze_invention(invention)
        if inv_id:
            invention_ids.append(inv_id)
        time.sleep(2)  # Be nice to the API
    
    # Get all inventions
    print("\n\n📚 All Analyzed Inventions:")
    inventions_response = requests.get("http://localhost:8000/inventions")
    if inventions_response.status_code == 200:
        for inv in inventions_response.json():
            print(f"  • {inv['name']} (ID: {inv['id']})")
    
    # Get patterns
    print("\n\n🔄 Common Patterns:")
    patterns_response = requests.get("http://localhost:8000/patterns")
    if patterns_response.status_code == 200:
        for pattern in patterns_response.json():
            print(f"\n  Pattern: {pattern['pattern_type']}")
            print(f"  Found in: {', '.join(pattern['inventions'])}")
            print(f"  Insight: {pattern['insights'][:100]}...")
    
    # Analyze patterns if we have multiple inventions
    if len(invention_ids) >= 2:
        print("\n\n🔬 Analyzing patterns across inventions...")
        analyze_response = requests.post("http://localhost:8000/patterns/analyze")
        if analyze_response.status_code == 200:
            print("✅ Pattern analysis complete!")
    
    # Get themes
    print("\n\n🎨 Common Themes:")
    themes_response = requests.get("http://localhost:8000/patterns/themes")
    if themes_response.status_code == 200:
        themes = themes_response.json()
        for theme, inventions in themes.items():
            if inventions:
                print(f"  • {theme}: {', '.join(inventions)}")


if __name__ == "__main__":
    main()