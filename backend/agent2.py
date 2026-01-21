import os
import pandas as pd
from openai import OpenAI
from duckduckgo_search import DDGS
from dotenv import load_dotenv
import time
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json
from functools import lru_cache

load_dotenv()

# Configure multiple OpenAI API keys for parallel processing
openai_keys = [
    os.getenv("OPENAI_API_KEY"),
    os.getenv("OPENAI_API_KEY_2"),
    os.getenv("OPENAI_API_KEY_3"),
    os.getenv("OPENAI_API_KEY_4")
]
openai_keys = [key for key in openai_keys if key]  # Filter out None values

# Create OpenAI clients for each API key
clients = [OpenAI(api_key=key) for key in openai_keys]

# In-memory cache for DuckDuckGo search results
search_cache = {}

class ICPValidator:
    def __init__(self):
        self.ddgs = DDGS()
        self.clients = clients
        self.current_client_index = 0
        
    def get_next_client(self):
        """Round-robin through OpenAI clients for load balancing."""
        client = self.clients[self.current_client_index % len(self.clients)]
        self.current_client_index += 1
        return client
        
    def enrich_company(self, company_name):
        """
        Dual-source enrichment with caching: searches for technical complexity and product support signals.
        """
        # Check cache first
        cache_key = f"enrich_{company_name}"
        if cache_key in search_cache:
            print(f"Using cached search for {company_name}")
            return search_cache[cache_key]
        
        print(f"Searching for {company_name}...")
        context_parts = []
        
        try:
            # Query 1: Focus on complexity and services
            query1 = f"{company_name} technical field service maintenance operations"
            results1 = self.ddgs.text(query1, max_results=2)
            if results1:
                context_parts.extend([r['body'] for r in results1])
            
            # Query 2: Look for specific product lines
            query2 = f"{company_name} complex equipment manufacturing product support"
            results2 = self.ddgs.text(query2, max_results=2)
            if results2:
                context_parts.extend([r['body'] for r in results2])
                
        except Exception as e:
            print(f"Search failed for {company_name}: {e}")
        
        result = " ".join(context_parts) if context_parts else f"{company_name} company information not found."
        
        # Cache the result
        search_cache[cache_key] = result
        
        return result
    
    def analyze_company(self, company, source, context, index):
        """
        Uses OpenAI GPT-4 to analyze company fit.
        """
        # Get the next available client (round-robin)
        client = self.get_next_client()
        
        prompt = f"""
You are the Lead Solutions Engineer at Ascendo AI. 

**Our Platform Value:** We focus on moving from reactive to predictive service with "Agentic Intelligence."
We specialize in:
- **Predictive Spare Parts & Logistics Planning**: Optimizing inventory across depots to meet SLAs and reduce "firefighting."
- **Agentic AI for Service Engineers**: An "AI coworker" that automates workflows and guides field engineers through complex troubleshooting.
- **Autonomous Self-Service AI Agents**: No-code agents for websites/apps that let customers resolve issues independently.
- **Predictive Churn & Escalation Analytics**: Identifying patterns to flag at-risk accounts early and improve retention.
- **Enterprise Knowledge Intelligence**: Synthesizing unstructured data (Slack, logs) into "Governed Knowledge" for faster resolution.

**Lead Analysis:**
Company: {company}
Industry Context: {context}

**Evaluation Instructions:**
1. **Analyze Technical Depth:** Does this company manage complex, high-stakes hardware?
2. **Identify Pain Points:** Do they struggle with parts, tribal knowledge, or high ticket volume?
3. **Product Fit:** Which of the 5 Ascendo products solves their #1 problem?

**Required JSON Output:**
{{
    "fit_score": 1-10,
    "category": "High Fit / Moderate Fit / Competitor / Out of Profile",
    "recommended_product": "Predictive Spare Parts | Agentic AI for Engineers | Autonomous Self-Service | Predictive Churn Analytics | Enterprise Knowledge Intelligence",
    "reasoning": "Step-by-step logic explaining the score and product choice.",
    "hook": "A 'product-led' hook (e.g., 'Since you manage inventory, our Predictive Logistics can...')"
}}
"""
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a sales intelligence analyst. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI failed for {company}: {e}")
            return None
    
    def process_single_lead(self, row_dict, index):
        """
        Process a single lead with enrichment and analysis.
        """
        company = row_dict.get('Company', 'Unknown')
        source = row_dict.get('Source', 'Unknown')
        
        # Enrich (with caching)
        context = self.enrich_company(company)
        
        # Analyze
        analysis_json = self.analyze_company(company, source, context, index)
        
        # Parse results
        fit_score = 0
        category = "N/A"
        recommended_product = "N/A"
        reasoning = "N/A"
        hook = "N/A"
        
        if analysis_json:
            try:
                data = json.loads(analysis_json)
                fit_score = data.get('fit_score', 0)
                category = data.get('category', 'N/A')
                recommended_product = data.get('recommended_product', 'N/A')
                reasoning = data.get('reasoning', 'N/A')
                hook = data.get('hook', 'N/A')
            except Exception as e:
                print(f"Failed to parse JSON for {company}: {e}")
        
        print(f"Processed {company}: Score {fit_score}")
        
        return {
            **row_dict,
            "Fit_Score": fit_score,
            "Category": category,
            "Recommended_Product": recommended_product,
            "Reasoning": reasoning,
            "Hook": hook
        }
    
    def process_leads(self, input_csv, output_csv):
        """
        Process all leads from input CSV using parallel processing with multiple API keys.
        """
        if not os.path.exists(input_csv):
            print("No raw file found for validation.")
            return None
        
        print(f"Validating leads from {input_csv}...")
        df = pd.read_excel(input_csv) if input_csv.endswith('.xlsx') else pd.read_csv(input_csv)
        
        # Process in parallel using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=len(self.clients)) as executor:
            # Submit all tasks
            futures = []
            for index, row in df.iterrows():
                row_dict = row.to_dict()
                future = executor.submit(self.process_single_lead, row_dict, index)
                futures.append(future)
                # Small delay to avoid overwhelming the API
                time.sleep(0.1)
            
            # Collect results
            results = [future.result() for future in futures]
        
        # Save results
        new_df = pd.DataFrame(results)
        new_df.to_excel(output_csv, index=False)
        print(f"Saved enriched leads to {output_csv}")
        
        return output_csv

if __name__ == "__main__":
    validator = ICPValidator()
    # validator.process_leads("raw_mock.xlsx", "enriched_mock.xlsx")
