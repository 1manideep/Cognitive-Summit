import os
import pandas as pd
import google.generativeai as genai
from duckduckgo_search import DDGS
from dotenv import load_dotenv
import time

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.0-flash-exp')

class ICPValidator:
    def __init__(self):
        self.ddgs = DDGS()
        
    def enrich_company(self, company_name):
        """
        Searches for the company's "About" or "Services" page to get a description.
        """
        print(f"Searching for {company_name}...")
        try:
            results = self.ddgs.text(f"{company_name} company about services", max_results=3)
            if results:
                # Combine snippets
                context = " ".join([r['body'] for r in results])
                return context
        except Exception as e:
            print(f"Search failed for {company_name}: {e}")
        return "No information found."

    def analyze_company(self, company, person_role, context):
        """
        Uses Gemini to score the fit and generate a hook.
        """
        prompt = f"""
        You are Agent 2, the "Intelligence Officer" for Ascendo AI.
        
        **Ascendo AI ICP:** 
        An agentic AI platform that helps Field Service teams solve technical issues instantly.
        Good Fit: Companies with high volume of complex field repairs (Medical Devices, Industrial HVAC, Energy, Manufacturing).
        Bad Fit: Simple consumer products, retail, software-only companies without field ops.

        **Target:**
        Company: {company}
        Person/Role: {person_role}
        Context from Search: {context}

        **Task:**
        1. Fit Score (1-10): Rate how well this company fits Ascendo's ICP. 10 = Complex Machinery/High Service Needs.
        2. Reasoning: One sentence explaining the score.
        3. Hook: A personalized one-sentence sales hook connecting Ascendo's AI ("instantly synthesized manuals/logs") to their specific business.

        **Output Format (JSON):**
        {{
            "fit_score": 0,
            "reasoning": "...",
            "hook": "..."
        }}
        """
        
        try:
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            return response.text
        except Exception as e:
            print(f"Gemini failed for {company}: {e}")
            return None

    def process_leads(self, input_csv="leads.csv", output_csv="validated_leads.csv"):
        if not os.path.exists(input_csv):
            print("No input file found.")
            return

        print(f"Processing {input_csv}...")
        df = pd.read_excel(input_csv) if input_csv.endswith('.xlsx') else pd.read_csv(input_csv)
        
        results = []
        
        for index, row in df.iterrows():
            company = row.get('Company', 'Unknown')
            # For this scraper, we might not have 'Person', so we focus on Company
            person_role = "Field Service Leader" 
            
            context = self.enrich_company(company)
            
            # Rate limit handling (basic)
            time.sleep(1)
            
            analysis_json = self.analyze_company(company, person_role, context)
            
            fit_score = 0
            reasoning = "N/A"
            hook = "N/A"
            
            if analysis_json:
                import json
                try:
                    data = json.loads(analysis_json)
                    fit_score = data.get('fit_score', 0)
                    reasoning = data.get('reasoning', 'N/A')
                    hook = data.get('hook', 'N/A')
                except:
                    pass
            
            results.append({
                **row.to_dict(),
                "Fit_Score": fit_score,
                "Reasoning": reasoning,
                "Hook": hook
            })

            print(f"Processed {company}: Score {fit_score}")

        # Save Result
        new_df = pd.DataFrame(results)
        
        # Sort by Score High -> Low
        new_df = new_df.sort_values(by="Fit_Score", ascending=False)
        
        new_df.to_excel(output_csv, index=False)
        print(f"Saved enriched leads to {output_csv}")
        return output_csv

if __name__ == "__main__":
    validator = ICPValidator()
    # Mock data for testing if run directly
    # validator.process_leads("leads_mock.xlsx", "processed_mock.xlsx")
