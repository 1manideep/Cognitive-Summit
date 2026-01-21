import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

# Test with the second key which showed quota error
key = os.getenv("GEMINI_API_KEY_2")
print(f"Testing key: {key[:20]}...")

try:
    genai.configure(api_key=key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    # Test with the exact prompt from Agent 2
    test_prompt = """
You are the Lead Solutions Engineer at Ascendo AI. 

**Our Platform Value:** We break down data silos to provide "Agentic Intelligence" for technical teams. 
We specialize in:
- **ResolveGPT:** Turning manuals/logs into instant troubleshooting game plans.
- **SparesGPT:** Predicting part failures to protect SLAs and reduce inventory risk.
- **PreventGPT:** Using sentiment and patterns to predict escalations before they happen.

**Lead Analysis:**
Company: SAP
Industry Context: SAP is a German multinational software company that develops enterprise software to manage business operations and customer relations.

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
    
    response = model.generate_content(test_prompt, generation_config={"response_mime_type": "application/json"})
    print("\n✅ SUCCESS! Response:")
    print(response.text)
    
    # Try to parse the JSON
    data = json.loads(response.text)
    print(f"\n✅ Parsed JSON successfully!")
    print(f"Fit Score: {data.get('fit_score')}")
    print(f"Category: {data.get('category')}")
    print(f"Product: {data.get('recommended_product')}")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
