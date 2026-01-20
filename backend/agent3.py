import os
import pandas as pd
import google.generativeai as genai
from dotenv import load_dotenv
import time
import json

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.0-flash-exp')

class StrategyGenerator:
    def __init__(self):
        pass

    def generate_strategy(self, row_data):
        """
        Generates the 'Triple Threat' outreach and product mapping.
        """
        company = row_data.get('Company', 'Unknown')
        fit_score = row_data.get('Fit_Score', 0)
        reasoning = row_data.get('Reasoning', '')
        hook = row_data.get('Hook', '')
        
        # Don't waste tokens on bad leads
        if fit_score < 4:
            return None

        prompt = f"""
        You are Agent 3, the "Revenue Strategist" for Ascendo AI.
        
        **Context:**
        Target Company: {company}
        Ascendo Fit Score: {fit_score}/10
        Reasoning: {reasoning}
        Agent 2 Hook: {hook}
        
        **Ascendo Products:**
        1. **ResolveGPT**: For technician knowledge gaps, tribal knowledge synthesis, troubleshooting.
        2. **SparesGPT**: For spare parts prediction, inventory delays, supply chain issues.
        
        **Task:**
        1. **Product Map**: Choose EITHER SparesGPT or ResolveGPT based on the company nature (e.g. manufacturing/logistics -> Spares; service/support -> Resolve).
        2. **Triple Threat Outreach**:
            - **LinkedIn**: Short, casual connection request (max 300 chars).
            - **Pitch**: 30-second elevator pitch script for a conference floor meeting.
            - **Email**: Value-driven follow-up email draft.
            
        **Output Format (JSON):**
        {{
            "recommended_product": "SparesGPT" or "ResolveGPT",
            "linkedin_draft": "...",
            "elevator_pitch": "...",
            "email_draft": "..."
        }}
        """
        
        try:
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            return response.text
        except Exception as e:
            print(f"Agent 3 failed for {company}: {e}")
            return None

    def process_strategy(self, input_csv, output_csv):
        if not os.path.exists(input_csv):
            print("No enriched file found for strategy generation.")
            return None

        print(f"Strategizing for {input_csv}...")
        df = pd.read_excel(input_csv) if input_csv.endswith('.xlsx') else pd.read_csv(input_csv)
        
        results = []
        
        for index, row in df.iterrows():
            row_dict = row.to_dict()
            
            # Rate limit handling
            time.sleep(1)
            
            strategy_json = self.generate_strategy(row_dict)
            
            rec_product = "N/A"
            linkedin = "N/A"
            pitch = "N/A"
            email = "N/A"
            
            if strategy_json:
                try:
                    data = json.loads(strategy_json)
                    rec_product = data.get('recommended_product', 'N/A')
                    linkedin = data.get('linkedin_draft', 'N/A')
                    pitch = data.get('elevator_pitch', 'N/A')
                    email = data.get('email_draft', 'N/A')
                except:
                    pass
            
            results.append({
                **row_dict,
                "Recommended_Product": rec_product,
                "LinkedIn_Draft": linkedin,
                "Elevator_Pitch": pitch,
                "Email_Draft": email
            })
            
            print(f"Strategy generated for {row_dict.get('Company')}")

        # Save Result
        new_df = pd.DataFrame(results)
        new_df.to_excel(output_csv, index=False)
        print(f"Saved battle plan to {output_csv}")
        return output_csv

if __name__ == "__main__":
    strategist = StrategyGenerator()
    # strategist.process_strategy("enriched_mock.xlsx", "battle_plan.xlsx")
