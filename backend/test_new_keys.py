import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

print("Testing all three new API keys...\n")

keys = [
    ("GEMINI_API_KEY", os.getenv("GEMINI_API_KEY")),
    ("GEMINI_API_KEY_2", os.getenv("GEMINI_API_KEY_2")),
    ("GEMINI_API_KEY_3", os.getenv("GEMINI_API_KEY_3"))
]

for key_name, key_value in keys:
    try:
        genai.configure(api_key=key_value)
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content("Say 'works'")
        print(f"✅ {key_name}: WORKS - {response.text.strip()}")
    except Exception as e:
        print(f"❌ {key_name}: FAILED - {str(e)[:100]}")
