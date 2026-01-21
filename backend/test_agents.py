import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

# Test Agent 2 with sample company
print("Testing Agent 2...")
from agent2 import ICPValidator

validator = ICPValidator()

sample_company = {
    "Company": "SAP",
    "Source": "Test",
    "Logo_Url": "https://example.com/sap.png"
}

try:
    # Test enrichment
    context = validator.enrich_company("SAP")
    print(f"✅ Enrichment works: {context[:100]}...")
    
    # Test analysis
    analysis = validator.analyze_company("SAP", "Field Service Leader", context, 0)
    if analysis:
        data = json.loads(analysis)
        print(f"✅ Agent 2 Analysis works!")
        print(f"   Fit Score: {data.get('fit_score')}")
        print(f"   Category: {data.get('category')}")
        print(f"   Product: {data.get('recommended_product')}")
    else:
        print("❌ Agent 2 Analysis failed - returned None")
except Exception as e:
    print(f"❌ Agent 2 Error: {e}")

print("\n" + "="*60 + "\n")

# Test Agent 3
print("Testing Agent 3...")
from agent3 import StrategyGenerator

strategist = StrategyGenerator()

sample_enriched = {
    "Company": "SAP",
    "Fit_Score": 9,
    "Category": "High Fit",
    "Recommended_Product": "ResolveGPT",
    "Reasoning": "Test reasoning",
    "Hook": "Test hook"
}

try:
    strategy = strategist.generate_single_strategy(sample_enriched)
    if strategy:
        print(f"✅ Agent 3 works!")
        print(f"   Contacts found: {len(strategy.get('contacts', []))}")
        print(f"   Email subject: {strategy.get('email_draft', {}).get('subject', 'N/A')}")
    else:
        print("❌ Agent 3 failed - returned None")
except Exception as e:
    print(f"❌ Agent 3 Error: {e}")
    import traceback
    traceback.print_exc()
