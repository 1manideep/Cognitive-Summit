import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

key = os.getenv("GEMINI_API_KEY_2")
genai.configure(api_key=key)

print("Testing Agent 2 prompt with gemini-flash-latest...\n")

model = genai.GenerativeModel('gemini-flash-latest')

test_prompt = """
You are the Lead Solutions Engineer at Ascendo AI. 

**Our Platform Value:** We break down data silos to provide "Agentic Intelligence" for technical teams. 
We specialize in:
- **ResolveGPT:** Turning manuals/logs into instant troubleshooting game plans.
- **SparesGPT:** Predicting part failures to protect SLAs and reduce inventory risk.
- **PreventGPT:** Using sentiment and patterns to predict escalations before they happen.

**Lead Analysis:**
Company: SAP
Industry Context: SAP is a German multinational software company that develops enterprise software to manage business operations and customer relations. They provide field service management solutions for complex industries.

**Evaluation Instructions:**
1. **Analyze Technical Depth:** Does this company manage complex, high-stakes hardware (e.g., Medical, Energy, Industrial)?
2. **Identify Pain Points:** Do they likely struggle with long onboarding times or "tribal knowledge" loss?
3. **Product Fit:** Which specific Ascendo product (Resolve, Spares, or Prevent) solves their #1 problem?

**Required JSON Output:**
{
    "fit_score": 1-10,
    "category": "High Fit / Moderate Fit / Competitor / Out of Profile",
    "recommended_product": "ResolveGPT | SparesGPT | PreventGPT",
    "reasoning": "Step-by-step logic explaining the score based on their technical complexity.",
    "hook": "A 'product-led' hook (e.g., 'Since you manage [Asset], our [Product] can reduce your downtime by X...')"
}
"""

try:
    response = model.generate_content(test_prompt, generation_config={"response_mime_type": "application/json"})
    print("✅ SUCCESS! Agent 2 is working!\n")
    print("Raw Response:")
    print(response.text)
    print("\n" + "="*60 + "\n")
    
    # Parse JSON
    data = json.loads(response.text)
    print("Parsed Results:")
    print(f"  Fit Score: {data.get('fit_score')}")
    print(f"  Category: {data.get('category')}")
    print(f"  Product: {data.get('recommended_product')}")
    print(f"  Reasoning: {data.get('reasoning')[:100]}...")
    print(f"  Hook: {data.get('hook')[:100]}...")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
