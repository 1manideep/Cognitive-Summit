import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, Search, Loader2, Link as LinkIcon, Lock, Menu, X, Check, Brain, ChevronRight, FileText, Send, MessageSquare, ShieldCheck, ScanEye, ArrowDownCircle } from 'lucide-react';
// ... (keep imports)


import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CompanyDetailModal as StrategyModal } from './CompanyDetailModal';
import { HowItWorks } from './HowItWorks';
import { WhyChooseUs } from './WhyChooseUs';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* Horizontal Step Indicator with Progress Bar */
const StepIndicator = ({ step, currentStep }) => {
  const steps = ['scraping', 'validating', 'strategizing', 'done'];
  const stepIndex = steps.indexOf(step);
  const currentIndex = steps.indexOf(currentStep);

  let status = 'pending';
  if (currentStep === step) status = 'processing';
  if (currentIndex > stepIndex || currentStep === 'done') status = 'completed';

  const labels = {
    'scraping': 'Agent 1',
    'validating': 'Agent 2',
    'strategizing': 'Agent 3'
  };

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      {/* Icon/Checkmark */}
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
        status === 'processing' ? "border-indigo-400 bg-indigo-500/10" :
          status === 'completed' ? "bg-green-500 border-green-500" :
            "border-gray-600 bg-gray-800/30"
      )}>
        {status === 'completed' && <Check className="h-5 w-5 text-white" />}
        {status === 'processing' && <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />}
        {status === 'pending' && <span className="h-2 w-2 rounded-full bg-gray-500" />}
      </div>

      {/* Label */}
      <span className={cn(
        "text-xs font-medium transition-colors",
        status === 'completed' ? "text-green-400" :
          status === 'processing' ? "text-indigo-400" : "text-gray-500"
      )}>
        {labels[step]}
      </span>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className={cn(
          "h-full transition-all duration-500",
          status === 'completed' ? "w-full bg-green-500" :
            status === 'processing' ? "w-1/2 bg-indigo-500 animate-pulse" : "w-0"
        )} />
      </div>
    </div>
  );
};


function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'https://dealer-webshots-cam-mud.trycloudflare.com';
  const [url, setUrl] = useState('https://fieldserviceusa.wbresearch.com/sponsors');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressStep, setProgressStep] = useState('idle');
  const [downloadLink, setDownloadLink] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [strategyData, setStrategyData] = useState(null);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showWhyChooseUs, setShowWhyChooseUs] = useState(false);
  const resultsRef = useRef(null);

  // Auto-scroll to results when data appears
  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  const handleGenerateStrategy = async (companyData) => {
    setStrategyLoading(true);
    try {
      const response = await axios.post(`${API_URL}/strategize-single`, {
        company_data: companyData
      });
      setStrategyData(response.data.data);
    } catch (err) {
      console.error('Strategy generation failed:', err);
      setError('Failed to generate strategy');
    } finally {
      setStrategyLoading(false);
    }
  };

  const openGmail = (emailData) => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailData.to_email)}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    window.open(gmailUrl, '_blank');
  };

  const handleExtract = async () => {
    setLoading(true);
    setProgressStep('scraping');
    setError(null);
    setData(null);
    setDownloadLink(null);

    try {
      // Step 1: Scrape
      const scrapeResponse = await axios.post(`${API_URL}/scrape`, { url: url });

      if (!scrapeResponse.data.filename) {
        throw new Error("No leads found on this page. The scraper successfully ran but could not detect any sponsor logos.");
      }

      // Show Agent 1 results immediately
      setData(scrapeResponse.data.data);
      setDownloadLink(`${API_URL}/download/${scrapeResponse.data.filename}`);

      setProgressStep('scraped'); // Agent 1 Done
      await new Promise(r => setTimeout(r, 600));

      setProgressStep('validating'); // Start Agent 2

      // Step 2: Validate
      const validateResponse = await axios.post(`${API_URL}/validate`, {
        filename: scrapeResponse.data.filename
      }, {
        timeout: 300000 // 5 minutes for Agent 2 to process all companies
      });

      // Sort by Fit_Score (high to low) before displaying
      const sortedData = validateResponse.data.data.sort((a, b) => {
        const scoreA = a.Fit_Score || 0;
        const scoreB = b.Fit_Score || 0;
        return scoreB - scoreA; // Descending order
      });

      // Show Agent 2 results (sorted by fit score)
      setData(sortedData);
      // Use download_url if provided, otherwise construct from filename
      const downloadFile = validateResponse.data.download_url || `/download/${validateResponse.data.filename || scrapeResponse.data.filename}`;
      setDownloadLink(`${API_URL}${downloadFile}`);

      setProgressStep('strategizing'); // Start Agent 3

      // Step 3: Strategize (COMMENTED OUT - too slow/unstable for now)
      // const strategyResponse = await axios.post('https://dealer-webshots-cam-mud.trycloudflare.com/strategize', {
      //   filename: scrapeResponse.data.filename
      // });
      // setData(strategyResponse.data.data);
      // setDownloadLink(`https://dealer-webshots-cam-mud.trycloudflare.com${strategyResponse.data.download_url}`);

      // Skip Agent 3 for now - just mark as done after Agent 2
      await new Promise(r => setTimeout(r, 1000));
      setProgressStep('done');

    } catch (err) {
      console.error(err);
      const detailedError = err.response?.data?.detail
        ? JSON.stringify(err.response.data.detail)
        : err.message;
      setError(detailedError || 'An error occurred during extraction flow');
      setProgressStep('idle');
    } finally {
      setLoading(false);
    }
  };

  const showLanding = !showHowItWorks && !showWhyChooseUs;

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white font-sans overflow-x-hidden">

      {/* Background Gradient Effect - Cyberpunk/Purple */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full z-[50] bg-transparent pt-6 pb-6 px-6 lg:px-12 transition-all duration-300 pointer-events-auto">
        <nav className="flex items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1 items-center gap-4">
            <button
              onClick={() => { setShowHowItWorks(false); setShowWhyChooseUs(false); }}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <img src="/logo_v5.png" alt="Logo" className="h-12 w-auto" />
              <span className="text-xl font-bold tracking-tight text-white">Cognitive Summit</span>
            </button>
            <span className="text-gray-600 mx-2">|</span>
            <a href="https://manideep.info/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold tracking-tight text-gray-400 hover:text-white transition-colors">Manideep</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-12">
            <button
              onClick={() => {
                setShowWhyChooseUs(true);
                setShowHowItWorks(false);
              }}
              className={cn(
                "text-sm font-semibold leading-6 transition-colors cursor-pointer",
                showWhyChooseUs ? "text-white" : "text-gray-300 hover:text-white"
              )}
            >
              Why Choose Us
            </button>
            <button
              onClick={() => {
                setShowHowItWorks(true);
                setShowWhyChooseUs(false);
              }}
              className={cn(
                "text-sm font-semibold leading-6 transition-colors cursor-pointer",
                showHowItWorks ? "text-white" : "text-gray-300 hover:text-white"
              )}
            >
              How It Works
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-24 pb-10 min-h-screen flex flex-col">

        {/* LANDING PAGE CONTENT */}
        {showLanding && (
          <div className="relative isolate px-6 pt-6 lg:px-8">
            <div className="mx-auto max-w-7xl py-6 sm:py-10 lg:py-12 grid lg:grid-cols-[1.3fr_1fr] gap-4 items-center">

              {/* Left Content */}
              <div className="text-left animate-in fade-in slide-in-from-left-10 duration-1000 lg:pl-16">
                <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 sm:text-[5rem] mb-6 leading-tight">
                  Agentic Lead Scouting &<br />ICP Validation
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-400 max-w-lg">
                  Automated conference extraction and strategic outreach orchestration for the Field Service community.
                </p>

                <div className="mt-10 flex flex-col gap-6 sm:max-w-md">
                  {/* Input Box Styled like the buttons */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
                    <div className="relative flex items-center bg-[#1E1B2E] rounded-xl p-1.5 border border-slate-700/50 shadow-2xl">
                      <Search className="ml-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Conference Sponsor URL..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-sm px-3"
                      />
                      <button
                        onClick={handleExtract}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Extract Data'}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-400 px-2">{error}</p>}

                  {/* Horizontal Progress Indicators */}
                  {progressStep !== 'idle' && (
                    <div className="flex items-center gap-4 mt-6 px-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <StepIndicator step="scraping" currentStep={progressStep} />
                      <StepIndicator step="validating" currentStep={progressStep} />
                      <StepIndicator step="strategizing" currentStep={progressStep} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content - Feature Blocks */}
              <div className="flex flex-col gap-8 mt-8 lg:mt-0">
                {/* Block 1 */}
                <div className="flex items-start gap-6 animate-slide-up delay-100">
                  <span className="font-mono text-5xl font-bold text-white leading-none mt-1">1</span>
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-400 mb-2 tracking-tight">Automated Lead Extraction</h3>
                    <div className="text-base text-gray-400 leading-relaxed font-light">
                      <p className="mb-2">Agent 1 (Vision Scraper).</p>
                      <p>Directly pulls company lists and logos from the Field Service USA conference website, transforming raw visual data into structured leads.</p>
                    </div>
                  </div>
                </div>

                {/* Block 2 */}
                <div className="flex items-start gap-6 animate-slide-up delay-300">
                  <span className="font-mono text-5xl font-bold text-white leading-none mt-1">2</span>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-2 tracking-tight">Multi-Agent ICP Validation</h3>
                    <div className="text-base text-gray-400 leading-relaxed font-light">
                      <p className="mb-2">Agent 2 (ICP Validator).</p>
                      <p>Independent agents analyze extracted leads against a 4-factor rubric (Industry, Scale, Tech-Stack, Title) to validate fit and generate strategic reasoning.</p>
                    </div>
                  </div>
                </div>

                {/* Block 3 */}
                <div className="flex items-start gap-6 animate-slide-up delay-500">
                  <span className="font-mono text-5xl font-bold text-white leading-none mt-1">3</span>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400 mb-2 tracking-tight">Orchestrated Agent Communication</h3>
                    <div className="text-base text-gray-400 leading-relaxed font-light">
                      <p className="mb-2">Agent 3 (Strategy Generator).</p>
                      <p>A seamless pipeline where agents "talk" to each other—passing validated lead data to a copywriter agent for instant, personalized email generation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {data && (
              <div ref={resultsRef} className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="bg-[#1E1B2E]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Extracted Sponsors</h2>
                      <p className="text-slate-400 text-sm">Found {data.length} companies from visual inspection</p>
                    </div>
                    {downloadLink && (
                      <div className="flex gap-3">
                        <a
                          href={downloadLink}
                          download="List of ICP companies.xlsx"
                          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 hover:text-white transition-all border border-white/10"
                        >
                          <Download className="h-4 w-4" />
                          Download Basic CSV
                        </a>
                        <a
                          href={downloadLink.replace('/download/', '/download-comprehensive/')}
                          download="Detailed Report.xlsx"
                          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all border border-purple-500/50 shadow-lg"
                        >
                          <Download className="h-4 w-4" />
                          Download Full Report
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {data.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedStrategy(item)}
                        className="group relative bg-white rounded-xl p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500"
                      >
                        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg p-3">
                          {item.Logo_Url ? (
                            <img
                              src={item.Logo_Url}
                              alt={item.Company}
                              className="max-w-full max-h-full object-contain hover:opacity-80 transition-opacity"
                            />
                          ) : (
                            <div className="text-4xl font-bold text-gray-300">{item.Company?.charAt(0) || "?"}</div>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.Company}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg",
                            item.Fit_Score >= 8 ? "bg-green-500" :
                              item.Fit_Score >= 5 ? "bg-yellow-500" :
                                item.Fit_Score > 0 ? "bg-red-500" : "bg-gray-500"
                          )}>
                            {item.Fit_Score > 0 ? `${item.Fit_Score}/10` : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Pages */}
        {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
        {showWhyChooseUs && <WhyChooseUs onClose={() => setShowHowItWorks(false)} />}

      </main>

      {/* Modal */}
      <StrategyModal
        isOpen={!!selectedStrategy}
        onClose={() => {
          setSelectedStrategy(null);
          setStrategyData(null);
        }}
        data={selectedStrategy}
        strategyData={strategyData}
        strategyLoading={strategyLoading}
        onGenerateStrategy={handleGenerateStrategy}
        onOpenGmail={openGmail}
      />

      <footer className="relative w-full z-[50] bg-transparent py-4 text-center text-gray-500 text-sm pointer-events-none">
        &copy; All rights reserved Manideep
      </footer>
    </div>
  );
}

export default App;
