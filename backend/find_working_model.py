import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

key = os.getenv("GEMINI_API_KEY_2")
genai.configure(api_key=key)

print("Testing different models with your API key...\n")

models_to_test = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-flash-latest',
    'gemini-pro'
]

for model_name in models_to_test:
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say 'works'")
        print(f"✅ {model_name}: WORKS - {response.text.strip()}")
        break  # Stop at first working model
    except Exception as e:
        error_msg = str(e)[:150]
        if "404" in error_msg:
            print(f"❌ {model_name}: Model not found")
        elif "429" in error_msg or "quota" in error_msg.lower():
            print(f"❌ {model_name}: Quota/rate limit issue")
        else:
            print(f"❌ {model_name}: {error_msg}")
