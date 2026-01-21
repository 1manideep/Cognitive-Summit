import os
import sys
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()

print("Testing Agent 2 with OpenAI...\n")

from agent2 import ICPValidator

validator = ICPValidator()

sample_company = {
    "Company": "SAP",
    "Source": "Test",
    "Logo_Url": "https://example.com/sap.png"
}

try:
    # Test enrichment
    print("1. Testing enrichment...")
    context = validator.enrich_company("SAP")
    print(f"✅ Enrichment works: {context[:100]}...")
    
    # Test analysis
    print("\n2. Testing analysis...")
    analysis = validator.analyze_company("SAP", "Test", context, 0)
    if analysis:
        data = json.loads(analysis)
        print(f"✅ Agent 2 Analysis works!")
        print(f"   Fit Score: {data.get('fit_score')}")
        print(f"   Category: {data.get('category')}")
        print(f"   Product: {data.get('recommended_product')}")
        print(f"   Reasoning: {data.get('reasoning')[:100]}...")
    else:
        print("❌ Agent 2 Analysis failed - returned None")
        
except Exception as e:
    print(f"❌ Agent 2 Error: {e}")
    import traceback
    traceback.print_exc()
