import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Test with a valid key
key = os.getenv("GEMINI_API_KEY_2")
if key:
    genai.configure(api_key=key)
    
    print("Available models:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"  - {model.name}")
