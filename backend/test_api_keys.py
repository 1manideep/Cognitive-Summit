import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Test all API keys with correct model
api_keys = [
    ("GEMINI_API_KEY", os.getenv("GEMINI_API_KEY")),
    ("GEMINI_API_KEY_2", os.getenv("GEMINI_API_KEY_2")),
    ("GEMINI_API_KEY_3", os.getenv("GEMINI_API_KEY_3"))
]

for key_name, key_value in api_keys:
    if not key_value:
        print(f"❌ {key_name}: NOT SET")
        continue
    
    try:
        genai.configure(api_key=key_value)
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Say 'API key works!'")
        print(f"✅ {key_name}: VALID - Response: {response.text.strip()}")
    except Exception as e:
        print(f"❌ {key_name}: INVALID - Error: {str(e)[:150]}")
