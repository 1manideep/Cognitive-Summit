import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

print("Testing Gemini API keys with paid tier...\n")

keys = [
    ("GEMINI_API_KEY", os.getenv("GEMINI_API_KEY")),
    ("GEMINI_API_KEY_2", os.getenv("GEMINI_API_KEY_2")),
    ("GEMINI_API_KEY_3", os.getenv("GEMINI_API_KEY_3"))
]

for key_name, key_value in keys:
    if not key_value:
        print(f"❌ {key_name}: NOT SET")
        continue
    
    try:
        genai.configure(api_key=key_value)
        
        # Try gemini-flash-latest
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content("Say 'API key works!'")
        print(f"✅ {key_name}: WORKS with gemini-flash-latest")
        print(f"   Response: {response.text.strip()}")
        
        # Check if it's actually a paid key by looking at the response
        print(f"   Usage metadata: {response.usage_metadata if hasattr(response, 'usage_metadata') else 'N/A'}")
        
    except Exception as e:
        error_str = str(e)
        if "429" in error_str or "quota" in error_str.lower():
            print(f"❌ {key_name}: QUOTA ERROR")
            print(f"   Error: {error_str[:200]}")
        elif "404" in error_str:
            print(f"❌ {key_name}: MODEL NOT FOUND")
        else:
            print(f"❌ {key_name}: ERROR - {error_str[:150]}")
    print()
