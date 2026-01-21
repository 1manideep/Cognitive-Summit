# Cognitive Summit - Agentic Lead Scouting Platform

**Cognitive Summit** is an autonomous AI agent system designed to transform how Field Service companies scout, validate, and engage with potential prospects. Instead of manual data entry, this platform uses a multi-agent architecture to "see" conference websites, "think" about prospect fit, and "act" by generating strategic outreach.

## 🚀 Architecture Overview

The system is built on a **3-Agent Pipeline**:

1.  **Agent 1: Vision Scraper ("The Eyes")**
    *   **Tech**: `Crawl4AI`, Playwright, GPT-4o Vision.
    *   **Role**: Navigates to conference sponsorship pages (e.g., Field Service USA), auto-scrolls to trigger lazy loading, and visually identifies company logos to extract valid leads.

2.  **Agent 2: ICP Validator ("The Brain")**
    *   **Tech**: Python `ThreadPoolExecutor`, OpenAI GPT-4o, DuckDuckGo Search.
    *   **Role**: Takes raw leads and validates them against an Ideal Customer Profile (ICP) rubric (Industry, Scale, Tech Stack). It uses parallel processing (4x keys) to enrich data via live web searches.

3.  **Agent 3: Revenue Strategist ("The Closer")**
    *   **Tech**: Google Gemini Flash, Background Threads.
    *   **Role**: For high-fit leads, it autonomously researches decision makers (LinkedIn/Email), generates a specific product value proposition, and drafts a personalized email.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
*   **Backend**: FastAPI (Python), Pandas, Async/Await.
*   **Infrastructure**: Cloudflare Tunnel (exposing local agents to the web), PM2 (process management).
*   **AI Models**: GPT-4o (Reasoning/Vision), Gemini Flash (Strategy).

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js & npm
*   Python 3.9+
*   API Keys for OpenAI and Google Gemini.

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```ini
OPENAI_API_KEY=sk-...
OPENAI_API_KEY_2=sk-... (Optional for parallel speed)
GEMINI_API_KEY=AIza...
```

Run the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`. It connects to the backend at `http://localhost:8000` (or your Cloudflare URL if configured).

---

## ⚡ Usage

1.  **Start the Scrape**:
    *   Enter a conference URL (e.g., `https://fieldserviceusa.wbresearch.com/sponsors`) in the dashboard.
    *   Click **"Extract Data"**.
    *   *Agent 1* will open a headless browser and start identifying companies suitable for the pipeline.

2.  **Validation Loop**:
    *   The system automatically passes extracted companies to *Agent 2*.
    *   You will see a live progress bar as "Vision" turns into "Validation".
    *   Companies are scored (1-10) based on their fit for products like "Predictive Spare Parts" or "Agentic AI".

3.  **View Strategy**:
    *   Click on any card with a high fit score.
    *   *Agent 3* (running in the background) will present a detailed **Battle Plan**:
        *   **Why them?**: Specific operational pain points.
        *   **Who to contact**: Verified decision makers.
        *   **What to say**: A drafted, ready-to-send email.

4.  **Download**:
    *   **"List of ICP companies"**: Get the raw validated list.
    *   **"Detailed Report"**: Download the full strategic dossier including emails and contact info.

---

## 📂 Project Structure

```
├── backend/
│   ├── main.py             # FastAPI entry point & orchestration
│   ├── agent1.py           # Vision Scraper logic
│   ├── agent2.py           # ICP Validator logic
│   ├── agent3.py           # Strategy Generator logic
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main Dashboard UI
│   │   ├── HowItWorks.jsx  # Architecture visualization
│   │   └── WhyChooseUs.jsx # Pitch deck / ROI page
│   └── public/             # Static assets
└── README.md               # You are here
```

---

## 🛡️ License

Private Assessment Code - All Rights Reserved.
