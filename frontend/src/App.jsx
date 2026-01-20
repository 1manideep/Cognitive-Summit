import React, { useState } from 'react';
import axios from 'axios';
import { Download, Search, Loader2, Link as LinkIcon, Lock, Menu, X, Check, Brain, ChevronRight, FileText, Send, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* Step Indicator Component */
const StepIndicator = ({ step, currentStep }) => {
  const steps = ['scraping', 'validating', 'strategizing', 'done'];
  const stepIndex = steps.indexOf(step);
  const currentIndex = steps.indexOf(currentStep);

  let status = 'pending';
  if (currentStep === step) status = 'processing';
  if (currentIndex > stepIndex || currentStep === 'done') status = 'completed';

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 w-full",
      status === 'processing' ? "bg-indigo-600/20 border-indigo-500/50" :
        status === 'completed' ? "bg-green-500/10 border-green-500/30" :
          "bg-slate-800/30 border-slate-700/30 opacity-50"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center border shrink-0",
        status === 'processing' ? "border-indigo-400 text-indigo-400 animate-pulse" :
          status === 'completed' ? "bg-green-500 border-green-500 text-white" :
            "border-slate-600 text-slate-600"
      )}>
        {status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'completed' && <Check className="h-4 w-4" />}
        {status === 'pending' && <span className="h-2 w-2 rounded-full bg-current" />}
      </div>
      <div>
        <h4 className={cn("text-sm font-medium", status === 'completed' ? "text-green-400" : "text-slate-200")}>
          {step === 'scraping' ? 'Agent 1: Visual Extractor' :
            step === 'validating' ? 'Agent 2: ICP Validator' :
              'Agent 3: The Strategist'}
        </h4>
        <p className="text-xs text-slate-400">
          {step === 'scraping' ? 'Scraping & Vision Processing' :
            step === 'validating' ? 'Enrichment & Scoring' :
              'Generating Revenue Battle Plan'}
        </p>
      </div>
    </div>
  );
};

/* Strategy Modal Component */
const StrategyModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1E1B2E] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-[#1E1B2E]/95 backdrop-blur border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Revenue Battle Plan
            </h3>
            <p className="text-sm text-slate-400 mt-1">Target: <span className="text-white font-medium">{data.Company}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Recommendation */}
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Check className="h-4 w-4" />
              </div>
              <h4 className="font-semibold text-indigo-300">Recommended Product</h4>
            </div>
            <p className="text-lg font-bold text-white pl-11">{data.Recommended_Product}</p>
          </div>

          {/* LinkedIn Outrech */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Send className="h-4 w-4" /> LinkedIn Request
            </h4>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-slate-300 text-sm leading-relaxed">
              {data.LinkedIn_Draft}
            </div>
          </div>

          {/* Elevator Pitch */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Elevator Pitch (30s)
            </h4>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-slate-300 text-sm leading-relaxed italic border-l-4 border-l-purple-500">
              "{data.Elevator_Pitch}"
            </div>
          </div>

          {/* Email Draft */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4" /> Follow-up Email
            </h4>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {data.Email_Draft}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [url, setUrl] = useState('https://fieldserviceusa.wbresearch.com/sponsors');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState('idle');
  const [data, setData] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const handleExtract = async () => {
    setLoading(true);
    setProgressStep('scraping');
    setError(null);
    setData(null);
    setDownloadLink(null);

    try {
      // Step 1: Scrape
      const scrapeResponse = await axios.post('http://localhost:8000/scrape', { url });

      setProgressStep('scraped'); // Agent 1 Done
      await new Promise(r => setTimeout(r, 600));

      setProgressStep('validating'); // Start Agent 2

      // Step 2: Validate
      const validateResponse = await axios.post('http://localhost:8000/validate', {
        filename: scrapeResponse.data.filename
      });

      // setData(validateResponse.data.data); // Show intermediate data?

      setProgressStep('strategizing'); // Start Agent 3

      // Step 3: Strategize
      const strategyResponse = await axios.post('http://localhost:8000/strategize', {
        filename: scrapeResponse.data.filename // Pass same filename, or updated one if you saved intermediate
      });

      setData(strategyResponse.data.data);
      setDownloadLink(`http://localhost:8000${strategyResponse.data.download_url}`);
      setProgressStep('done');

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during extraction flow');
      setProgressStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white font-sans overflow-x-hidden">

      {/* Background Gradient Effect - Cyberpunk/Purple */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 pt-6 px-6 lg:px-12">
        <nav className="flex items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1 items-center gap-2">
            <div className="bg-indigo-600/20 p-2 rounded-full border border-indigo-500/30">
              <Lock className="h-6 w-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Agent 1 <span className="text-slate-400 font-normal">Extractor</span></span>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">Features</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <button className="text-sm font-semibold text-white px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all">Login</button>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-7xl py-12 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-left animate-in fade-in slide-in-from-left-10 duration-1000">
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-tight">
                Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Logos</span>,<br />
                Together We Check.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400 max-w-lg">
                We offer a secure visual infrastructure to keep your leads connected. With advanced Vision AI and scrubbing protocols, we ensure your data is extracted reliably.
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

                {/* Progress Stepper - Shows when NOT idle and NO data yet */}
                {(progressStep !== 'idle' && !data) && (
                  <div className="flex flex-col gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <StepIndicator step="scraping" currentStep={progressStep} />
                    <StepIndicator step="validating" currentStep={progressStep} />
                    <StepIndicator step="strategizing" currentStep={progressStep} />
                  </div>
                )}


                <div className="mt-8">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-4">Trusted by 10k+ scrapers teams</p>
                  <div className="flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="h-6 w-20 bg-white/20 rounded"></div>
                    <div className="h-6 w-20 bg-white/20 rounded"></div>
                    <div className="h-6 w-20 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Image */}
            <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
              <img
                src="/hero.png"
                alt="3D Abstract Globe"
                className="w-full max-w-[600px] mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

          </div>

          {/* Results Section - Only visible when data exists */}
          {data && (
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-[#1E1B2E]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Extracted Sponsors</h2>
                    <p className="text-slate-400 text-sm">Found {data.length} companies from visual inspection</p>
                  </div>
                  {downloadLink && (
                    <a
                      href={downloadLink}
                      download
                      className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 hover:text-white transition-all border border-white/10"
                    >
                      <Download className="h-4 w-4" />
                      Download CSV
                    </a>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-700/50">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Company</th>
                        <th className="px-6 py-4 font-semibold">Fit Score</th>
                        <th className="px-6 py-4 font-semibold">Recommendation</th>
                        <th className="px-6 py-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 bg-[#1E1B2E]/50">
                      {data.slice(0, 10).map((item, idx) => (
                        <tr key={idx} className="hover:bg-indigo-900/10 transition-colors">
                          <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                            <div className="h-8 w-12 flex items-center justify-center bg-white rounded p-0.5 shrink-0">
                              <img src={item.Logo_Url} className="max-h-full max-w-full object-contain" />
                            </div>
                            {item.Company}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border",
                                item.Fit_Score >= 8 ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                  item.Fit_Score >= 5 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                    "bg-red-500/20 text-red-400 border-red-500/30"
                              )}>
                                {item.Fit_Score || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium">
                            {item.Recommended_Product && item.Recommended_Product !== 'N/A' ? (
                              <span className={cn("px-2 py-1 rounded border",
                                item.Recommended_Product === 'SparesGPT' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                  "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              )}>
                                {item.Recommended_Product}
                              </span>
                            ) : <span className="text-slate-500">Analysis pending or low fit</span>}
                          </td>
                          <td className="px-6 py-4">
                            {item.Fit_Score >= 4 ? (
                              <button
                                onClick={() => setSelectedStrategy(item)}
                                className="text-xs bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 group"
                              >
                                View Strategy <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-600 italic">Disqualified</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <StrategyModal
        isOpen={!!selectedStrategy}
        onClose={() => setSelectedStrategy(null)}
        data={selectedStrategy}
      />
    </div>
  );
}

export default App;
