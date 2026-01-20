from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import os
import uuid
from scraper import run_scrape

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

from agent3 import StrategyGenerator

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
