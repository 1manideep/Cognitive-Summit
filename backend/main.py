from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import os
import uuid
from agent1 import run_scrape
from agent2 import ICPValidator
from agent3 import StrategyGenerator
import math

# In-memory cache for Agent 3 strategies
strategy_cache = {}

def sanitize_data(data):
    """Remove NaN and Infinity values from data to make it JSON compliant"""
    if isinstance(data, dict):
        return {k: sanitize_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif isinstance(data, float):
        if math.isnan(data) or math.isinf(data):
            return 0
        return data
    return data


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidateRequest(BaseModel):
    filename: str

class ExtractRequest(BaseModel):
    url: str

class StrategyRequest(BaseModel):
    company_data: dict

@app.post("/scrape")
async def scrape_leads(request: ExtractRequest):
    try:
        # Run Agent 1: Scraper
        scraped_data = await run_scrape(request.url)
        
        if not scraped_data:
            return {"message": "No data found", "data": []}

        # Create DataFrame from Agent 1
        df = pd.DataFrame(scraped_data)
        
        # Save Agent 1 raw output
        raw_filename = f"leads_raw_{uuid.uuid4()}.xlsx"
        raw_filepath = os.path.join(os.getcwd(), raw_filename)
        df.to_excel(raw_filepath, index=False)
        
        return {
            "message": "Agent 1 Scraping Successful", 
            "filename": raw_filename,
            "data": scraped_data
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate")
async def validate_leads(request: ValidateRequest):
    try:
        raw_filepath = os.path.join(os.getcwd(), request.filename)
        
        if not os.path.exists(raw_filepath):
             raise HTTPException(status_code=404, detail="Raw leads file not found for validation")

        # Run Agent 2: Trigger Validation
        validator = ICPValidator()
        enriched_filename = f"leads_enriched_{uuid.uuid4()}.xlsx"
        enriched_filepath = os.path.join(os.getcwd(), enriched_filename)
        
        # We need to process from the file we just saved
        final_filepath = validator.process_leads(raw_filepath, enriched_filepath)
        final_filename = os.path.basename(final_filepath)
        
        # Read back the enriched data to send to frontend
        enriched_df = pd.read_excel(final_filepath)
        enriched_data = enriched_df.to_dict(orient='records')
        enriched_data = sanitize_data(enriched_data)  # Clean NaN/Infinity values
        
        # Start Agent 3 in background (sorted by fit score, best first)
        import threading
        from agent3 import StrategyGenerator
        
        def run_agent3_background(enriched_data_list):
            """Run Agent 3 in background for all companies, sorted by fit score."""
            try:
                print("Starting background Agent 3 processing...")
                strategist = StrategyGenerator()
                
                # Sort by fit score (highest first)
                sorted_companies = sorted(
                    enriched_data_list, 
                    key=lambda x: x.get('Fit_Score', 0), 
                    reverse=True
                )
                
                # Process each company and cache results
                for company_data in sorted_companies:
                    if company_data.get('Fit_Score', 0) >= 4:  # Only process decent fits
                        strategy = strategist.generate_single_strategy(company_data)
                        if strategy:
                            # Cache in memory for instant retrieval
                            company_name = company_data.get('Company')
                            strategy_cache[company_name] = strategy
                            print(f"Cached strategy for {company_name}")
                
                print("Background Agent 3 processing complete!")
            except Exception as e:
                print(f"Background Agent 3 error: {e}")
        
        # Start background thread
        bg_thread = threading.Thread(target=run_agent3_background, args=(enriched_data,))
        bg_thread.daemon = True
        bg_thread.start()
        
        return {
            "message": "Agent 2 Validation Successful",
            "data": enriched_data,
            "download_url": f"/download/{final_filename}"
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_file(filename: str):
    filepath = os.path.join(os.getcwd(), filename)
    if os.path.exists(filepath):
        return FileResponse(filepath, filename=filename)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/download-comprehensive/{filename}")
async def download_comprehensive(filename: str):
    """
    Download a comprehensive CSV with all Agent 2 and Agent 3 data.
    Includes: Company, Logo_Url, Fit_Score, Category, Recommended_Product, 
    Reasoning, Hook, Contacts (names, titles, emails, LinkedIn), 
    Product Analysis, Email Draft
    """
    try:
        filepath = os.path.join(os.getcwd(), filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Read the enriched data
        df = pd.read_excel(filepath)
        
        # Add Agent 3 data from cache
        comprehensive_data = []
        for _, row in df.iterrows():
            company_name = row.get('Company')
            row_dict = row.to_dict()
            
            # Check if we have Agent 3 data for this company
            if company_name in strategy_cache:
                strategy = strategy_cache[company_name]
                
                # Add contacts as comma-separated strings
                if 'contacts' in strategy and strategy['contacts']:
                    contacts_list = []
                    for contact in strategy['contacts']:
                        contact_str = f"{contact.get('name', '')} ({contact.get('title', '')}) - {contact.get('email', '')} | {contact.get('linkedin', '')}"
                        contacts_list.append(contact_str)
                    row_dict['Key_Contacts'] = "; ".join(contacts_list)
                else:
                    row_dict['Key_Contacts'] = ""
                
                # Add product analysis
                if 'product_analysis' in strategy:
                    pa = strategy['product_analysis']
                    row_dict['Product_Analysis_Product'] = pa.get('product', '')
                    row_dict['Product_Analysis_Why'] = pa.get('why_perfect', '')
                    row_dict['Product_Analysis_Use_Cases'] = "; ".join(pa.get('use_cases', []))
                    row_dict['Product_Analysis_ROI'] = pa.get('expected_roi', '')
                else:
                    row_dict['Product_Analysis_Product'] = ""
                    row_dict['Product_Analysis_Why'] = ""
                    row_dict['Product_Analysis_Use_Cases'] = ""
                    row_dict['Product_Analysis_ROI'] = ""
                
                # Add email draft
                if 'email_draft' in strategy:
                    ed = strategy['email_draft']
                    row_dict['Email_To_Name'] = ed.get('to_name', '')
                    row_dict['Email_To_Email'] = ed.get('to_email', '')
                    row_dict['Email_Subject'] = ed.get('subject', '')
                    row_dict['Email_Body'] = ed.get('body', '')
                else:
                    row_dict['Email_To_Name'] = ""
                    row_dict['Email_To_Email'] = ""
                    row_dict['Email_Subject'] = ""
                    row_dict['Email_Body'] = ""
            else:
                # No Agent 3 data available
                row_dict['Key_Contacts'] = ""
                row_dict['Product_Analysis_Product'] = ""
                row_dict['Product_Analysis_Why'] = ""
                row_dict['Product_Analysis_Use_Cases'] = ""
                row_dict['Product_Analysis_ROI'] = ""
                row_dict['Email_To_Name'] = ""
                row_dict['Email_To_Email'] = ""
                row_dict['Email_Subject'] = ""
                row_dict['Email_Body'] = ""
            
            comprehensive_data.append(row_dict)
        
        # Create comprehensive DataFrame
        comprehensive_df = pd.DataFrame(comprehensive_data)
        
        # Save to a new file
        comprehensive_filename = filename.replace('.xlsx', '_comprehensive.xlsx')
        comprehensive_filepath = os.path.join(os.getcwd(), comprehensive_filename)
        comprehensive_df.to_excel(comprehensive_filepath, index=False)
        
        return FileResponse(comprehensive_filepath, filename=comprehensive_filename)
    
    except Exception as e:
        print(f"Error creating comprehensive download: {e}")
        raise HTTPException(status_code=500, detail=str(e))


from agent3 import StrategyGenerator

@app.post("/strategize-single")
async def strategize_single_company(request: StrategyRequest):
    """
    Generate strategy for a single company (checks cache first for instant response).
    """
    try:
        company_name = request.company_data.get('Company')
        
        # Check cache first
        if company_name in strategy_cache:
            print(f"Returning cached strategy for {company_name}")
            return {
                "message": "Agent 3 Strategy Retrieved (cached)",
                "data": strategy_cache[company_name]
            }
        
        # If not cached, generate now
        print(f"Generating new strategy for {company_name}")
        strategist = StrategyGenerator()
        strategy_data = strategist.generate_single_strategy(request.company_data)
        
        if not strategy_data:
            raise HTTPException(status_code=500, detail="Failed to generate strategy")
        
        # Cache for future requests
        strategy_cache[company_name] = strategy_data
        
        return {
            "message": "Agent 3 Strategy Generated",
            "data": strategy_data
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/strategize")
async def strategize_leads(request: ValidateRequest):
    try:
        enriched_filepath = os.path.join(os.getcwd(), request.filename)
        
        if not os.path.exists(enriched_filepath):
             raise HTTPException(status_code=404, detail="Enriched leads file not found for strategy")

        # Run Agent 3: Trigger Strategy
        strategist = StrategyGenerator()
        plan_filename = f"battle_plan_{uuid.uuid4()}.xlsx"
        plan_filepath = os.path.join(os.getcwd(), plan_filename)
        
        final_filepath = strategist.process_strategy(enriched_filepath, plan_filepath)
        final_filename = os.path.basename(final_filepath)
        
        # Read back data
        plan_df = pd.read_excel(final_filepath)
        plan_data = plan_df.to_dict(orient='records')
        
        return {
            "message": "Agent 3 Strategy Generated",
            "data": plan_data,
            "download_url": f"/download/{final_filename}"
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
