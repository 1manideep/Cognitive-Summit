import os
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv
from duckduckgo_search import DDGS
import time
import json

load_dotenv()

# Configure Gemini with Pro model for better reasoning
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')  # Using flash-latest as 1.5-pro doesn't exist

class StrategyGenerator:
    def __init__(self):
        self.ddgs = DDGS()
    
    def find_contacts(self, company):
        """
        Search for key decision makers at the company.
        """
        print(f"Searching for contacts at {company}...")
        try:
            # Search for decision makers
            query = f"{company} VP Field Service OR CTO OR Head of Operations OR Director Service linkedin"
            results = self.ddgs.text(query, max_results=5)
            
            if results:
                context = " ".join([r['body'] for r in results])
                return context
        except Exception as e:
            print(f"Contact search failed for {company}: {e}")
        
        return "No contact information found."
    
    def generate_strategy(self, row_data):
        """
        Generates comprehensive sales strategy with contacts, analysis, and email.
        """
        company = row_data.get('Company', 'Unknown')
        fit_score = row_data.get('Fit_Score', 0)
        category = row_data.get('Category', 'N/A')
        recommended_product = row_data.get('Recommended_Product', 'N/A')
        reasoning = row_data.get('Reasoning', '')
        hook = row_data.get('Hook', '')
        
        # Don't waste tokens on bad leads
        if fit_score < 4:
            return None
        
        # Find contacts
        contact_context = self.find_contacts(company)
        
        prompt = f"""
You are Agent 3, the "Revenue Strategist" for Ascendo AI.

**Company Analysis:**
Company: {company}
Fit Score: {fit_score}/10
Category: {category}
Agent 2 Recommendation: {recommended_product}
Agent 2 Reasoning: {reasoning}
Agent 2 Hook: {hook}

**Contact Research:**
{contact_context}

**Ascendo AI Products:**
- **ResolveGPT**: Turns manuals/logs into instant troubleshooting game plans. Reduces MTTR by 30%.
- **SparesGPT**: Predicts part failures to protect SLAs and reduce inventory risk. Saves 20% on inventory costs.
- **PreventGPT**: Uses sentiment and patterns to predict escalations before they happen. Reduces escalations by 40%.

**Your Tasks:**

1. **Find Decision Makers** (UP TO 10 people, ONLY if you can find BOTH LinkedIn AND email):
   Based on the contact research above, identify key decision makers at {company}.
   Focus on: VP Field Service, CTO, Head of Operations, Director of Service, VP Customer Success
   CRITICAL: Only include contacts where you found BOTH a LinkedIn profile AND can determine their email.
   For each contact provide:
   - Name (must be a real name found in research)
   - Title (their actual job title)
   - LinkedIn URL (must be a real LinkedIn URL found, not guessed)
   - Email (verified pattern or found email, not just guessed)
   
   If you cannot find both LinkedIn AND email for a person, DO NOT include them.
   Return UP TO 10 contacts maximum, prioritizing senior decision makers.

2. **Detailed Product Analysis**:
   Build on Agent 2's recommendation of {recommended_product}.
   Provide:
   - Why this product is perfect for {company} (2-3 paragraphs)
   - 3 specific use cases based on their industry
   - Expected ROI and impact metrics
   - How it compares to alternatives

3. **Draft Personalized Email**:
   Create a compelling email to the primary contact.
   Include:
   - Subject line (specific, compelling, under 60 chars)
   - Email body (3-4 paragraphs):
     * Hook: Reference their specific industry challenge
     * Value: How {recommended_product} solves it with specific metrics
     * Proof: Brief use case or customer success story
     * CTA: Clear next step (e.g., "15-minute demo")
   - Tone: Professional but conversational, not salesy

**Output Format (JSON):**
{{
    "contacts": [
        {{
            "name": "John Doe",
            "title": "VP of Field Service",
            "linkedin": "https://linkedin.com/in/johndoe",
            "email": "john.doe@{company.lower().replace(' ', '')}.com"
        }}
    ],
    "product_analysis": {{
        "product": "{recommended_product}",
        "why_perfect": "Multi-paragraph explanation...",
        "use_cases": [
            "Use case 1 with specific details",
            "Use case 2 with specific details",
            "Use case 3 with specific details"
        ],
        "expected_roi": "Specific metrics and timeframe...",
        "competitive_edge": "How Ascendo stands out..."
    }},
    "email_draft": {{
        "subject": "Subject line here",
        "body": "Email body here...",
        "to_name": "John Doe",
        "to_email": "john.doe@company.com"
    }}
}}
"""
        
        try:
            response = model.generate_content(
                prompt, 
                generation_config={"response_mime_type": "application/json"}
            )
            return response.text
        except Exception as e:
            print(f"Agent 3 failed for {company}: {e}")
            return None
    
    def generate_single_strategy(self, company_data):
        """
        Generate strategy for a single company (for API endpoint).
        """
        strategy_json = self.generate_strategy(company_data)
        
        if not strategy_json:
            return None
        
        try:
            data = json.loads(strategy_json)
            return data
        except Exception as e:
            print(f"Failed to parse Agent 3 response: {e}")
            return None
    
    def process_strategy(self, input_csv, output_csv):
        """
        Process strategies for all companies in a file (batch mode).
        """
        if not os.path.exists(input_csv):
            print("No enriched file found for strategy generation.")
            return None

        print(f"Strategizing for {input_csv}...")
        df = pd.read_excel(input_csv) if input_csv.endswith('.xlsx') else pd.read_csv(input_csv)
        
        results = []
        
        for index, row in df.iterrows():
            row_dict = row.to_dict()
            
            # Rate limit handling
            time.sleep(2)  # Slower for Pro model
            
            strategy_data = self.generate_single_strategy(row_dict)
            
            if strategy_data:
                # Flatten the data for Excel
                row_dict['Contacts'] = json.dumps(strategy_data.get('contacts', []))
                row_dict['Product_Analysis'] = json.dumps(strategy_data.get('product_analysis', {}))
                row_dict['Email_Subject'] = strategy_data.get('email_draft', {}).get('subject', 'N/A')
                row_dict['Email_Body'] = strategy_data.get('email_draft', {}).get('body', 'N/A')
                row_dict['Email_To'] = strategy_data.get('email_draft', {}).get('to_email', 'N/A')
            
            results.append(row_dict)
            print(f"Strategy generated for {row_dict.get('Company')}")

        # Save Result
        new_df = pd.DataFrame(results)
        new_df.to_excel(output_csv, index=False)
        print(f"Saved battle plan to {output_csv}")
        return output_csv

if __name__ == "__main__":
    strategist = StrategyGenerator()
    # Test with sample data
    # strategist.process_strategy("enriched_mock.xlsx", "battle_plan.xlsx")
