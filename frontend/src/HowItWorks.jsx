import React from 'react';
import { ArrowRight, Database, Brain, Mail, Search, Code, Shield, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';


// ... (keep props)

export const HowItWorks = ({ onClose }) => {


    return (
        <div className="w-full relative z-10 pb-10 fade-in slide-in-from-bottom-4 duration-700">

            <div className="max-w-6xl mx-auto px-6">
                {/* Page Title */}
                <div className="relative py-8 mb-12 border-b border-white/5">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                            How It Works
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            A deep dive into the agentic architecture powering intelligent lead generation
                        </p>
                    </div>
                </div>

                {/* Detailed Process Breakdown (Stacked) */}
                <div className="relative">

                    {/* Step 1: Vision Scraper */}
                    <div className="sticky top-48 min-h-[80vh] pt-8 bg-[#0F0A1E] rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] z-10">
                        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                            {/* Left: Visual (Code Block) */}
                            <div className="flex-1 w-full order-last lg:order-first">
                                <div className="bg-[#1E1B2E] rounded-xl p-6 border border-slate-700/50 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        <span className="ml-2 text-xs text-gray-500 font-mono">agent_1_output.json</span>
                                    </div>
                                    <pre className="font-mono text-xs text-indigo-300 overflow-x-auto">
                                        {`{
  "company": "TechFlow Systems",
  "logo_url": "https://techflow.io/logo.png",
  "source": "Sponsor Banner",
  "confidence": 0.98,
  "metadata": {
    "detected_at": "Booth 42",
    "event": "SaaStr Annual"
  }
}`}
                                    </pre>

                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                                        <Search className="h-3 w-3" />
                                        <span>Crawl4AI + GPT-4o Vision</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Number + Title + Text */}
                            <div className="flex-1 text-left">
                                <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-300 opacity-50">01</span>
                                <h3 className="text-4xl font-bold text-white mt-2 mb-6">Autonomous Vision Scraper</h3>

                                <h4 className="text-xl font-semibold text-indigo-400 mb-2">Input: Conference URL</h4>
                                <p className="text-lg text-gray-400 leading-relaxed mb-6">
                                    The process begins when you provide a conference URL. Agent 1 deploys a headless browser to "see" the website just like a human would.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 mt-1">
                                            <Zap className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium">Visual Extraction</h5>
                                            <p className="text-sm text-gray-500">Identifies logos and company names from sponsor banners, grids, and carousels using GPT-4o Vision.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 mt-1">
                                            <Shield className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium">Bypass Detection</h5>
                                            <p className="text-sm text-gray-500">Auto-scrolls and lazy-loads content to capture hidden sponsors, simulating natural user behavior.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Step 2: ICP Validator */}
                    <div className="sticky top-56 min-h-[80vh] pt-8 bg-[#0F0A1E] rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] z-20">
                        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                            {/* Left: Visual (The Rubric) */}
                            <div className="flex-1 w-full order-last lg:order-first">
                                {/* The Rubric Table (Miniaturized) */}
                                <div className="bg-[#1E1B2E] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl p-1">
                                    <div className="p-4 bg-slate-900/50 border-b border-slate-700/50 flex justify-between items-center rounded-t-lg">
                                        <span className="text-sm font-semibold text-white">Scoring Matrix</span>
                                        <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-mono">Pass: &gt; 5/10</span>
                                    </div>
                                    <table className="w-full text-left text-sm">
                                        <tbody className="divide-y divide-slate-800 text-gray-400">
                                            <tr className="bg-white/5">
                                                <td className="p-3 text-purple-300">Industry</td>
                                                <td className="p-3 font-mono">40%</td>
                                                <td className="p-3">Field Service / Mfg</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 text-purple-300">Scale</td>
                                                <td className="p-3 font-mono">30%</td>
                                                <td className="p-3">Enterprise Size</td>
                                            </tr>
                                            <tr className="bg-white/5">
                                                <td className="p-3 text-purple-300">Tech</td>
                                                <td className="p-3 font-mono">20%</td>
                                                <td className="p-3">Cloud/SaaS Stack</td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 text-purple-300">Role</td>
                                                <td className="p-3 font-mono">10%</td>
                                                <td className="p-3">C-Suite / VP</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6 flex gap-3 flex-wrap justify-center">
                                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">DuckDuckGo Search</span>
                                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">LinkedIn Scraping</span>
                                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">GPT-4o Reasoning</span>
                                </div>
                            </div>

                            {/* Right: Number + Title + Text */}
                            <div className="flex-1 text-left">
                                <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300 opacity-50">02</span>
                                <h3 className="text-4xl font-bold text-white mt-2 mb-6">Algorithmic Validator</h3>

                                <h4 className="text-xl font-semibold text-purple-400 mb-2">Process: Enrichment & Scoring</h4>
                                <p className="text-lg text-gray-400 leading-relaxed mb-6">
                                    Agent 2 takes the raw list and enriches each company with real-time data. It applies a strict 4-factor rubric to filter out noise.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-purple-500/10 mt-1">
                                            <Brain className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium">Parallel Processing</h5>
                                            <p className="text-sm text-gray-500">Uses 4 concurrent API threads to validate hundreds of leads in minutes, not hours.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-purple-500/10 mt-1">
                                            <AlertTriangle className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium">Hallucination Guardrails</h5>
                                            <p className="text-sm text-gray-500">Only data verified across multiple sources (LinkedIn + Company Site) affects the score.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Step 3: Strategy Generator */}
                    <div className="sticky top-64 min-h-[80vh] pt-8 bg-[#0F0A1E] rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] z-30">
                        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                            {/* Left: Visual / Details */}
                            <div className="flex-1 w-full order-last lg:order-first">
                                {/* Visual Content: Email Card */}
                                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-2xl relative">
                                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Subject</div>
                                            <div className="text-sm font-bold text-gray-800">Scaling field ops at [Company]</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                                        <div className="h-2 w-full bg-gray-100 rounded"></div>
                                        <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
                                        <div className="p-3 bg-blue-50 rounded-lg mt-3 border border-blue-100">
                                            <p className="text-xs text-blue-800 italic">"Based on your recent expansion into manufacturing..."</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">1-Click</div>
                                        <div className="text-xs text-blue-300">Draft Export</div>
                                    </div>
                                    <div className="w-px bg-blue-500/30"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">&lt; 2s</div>
                                        <div className="text-xs text-blue-300">Generation Time</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Number + Title + Text */}
                            <div className="flex-1 text-left">
                                <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 opacity-50">03</span>
                                <h3 className="text-4xl font-bold text-white mt-2 mb-6">Strategy & Hand-off</h3>

                                <h4 className="text-xl font-semibold text-blue-400 mb-2">Output: Actionable Intelligence</h4>
                                <p className="text-lg text-gray-400 leading-relaxed mb-6">
                                    The final mile. Agent 3 synthesizes all gathered intelligence into a personalized outreach strategy and a ready-to-send email draft.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-blue-500/10 mt-1">
                                            <Zap className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium">Gemini Flash Speed</h5>
                                            <p className="text-sm text-gray-500">Leverages Google's low-latency model to generate strategies instantly as you scroll.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-blue-500/10 mt-1">
                                            <Database className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-white font-medium">CRM Ready</h5>
                                            <p className="text-sm text-gray-500">Exports include Name, Title, Email, Phone, and the generated strategy field mapped to your CRM.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Architecture Diagram (Stacked as 4th Card) - Image Only */}
                    <div className="sticky top-72 min-h-[40vh] pt-8 bg-[#0F0A1E] rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] z-40">
                        <div className="max-w-6xl mx-auto px-6 text-center">
                            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                                <img
                                    src="/arc.png"
                                    alt="Full Agentic Architecture"
                                    className="w-full h-auto rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Spacer for scroll */}
                    <div className="h-[50vh]"></div>
                </div>
            </div>
        </div>
    );
};
