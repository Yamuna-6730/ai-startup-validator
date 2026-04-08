import sys
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)

# Add server directory to path
sys.path.append(os.getcwd())

from services.ai_service import analyze_startup_idea

def test_ai():
    print("Testing AI Service (Modern HF Router + OpenAI Client)...")
    title = "AI Startup Validator"
    description = "A platform that validates startup ideas."
    
    try:
        result = analyze_startup_idea(title, description)
        if result:
            print("Success! AI Analysis generated:")
            print(f"Problem: {result.problem}")
            print(f"Market: {result.market}")
            print(f"Profitability: {result.profitability_score}")
        else:
            print("Failed to generate AI Analysis. Check if model is loading.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_ai()
