import React from 'react';
import { Clock, TrendingUp, DollarSign, Zap, CheckCircle2, XCircle } from 'lucide-react';

export const WhyChooseUs = ({ onClose }) => {
    return (
        <div className="w-full relative z-10 pb-10 text-white font-sans animate-in fade-in duration-300">

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Hero / Title */}
                <div className="text-center mb-24 animate-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
                        <TrendingUp className="w-4 h-4" /> The ROI of Autonomy
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 mb-8 leading-tight drop-shadow-2xl">
                        The Cost of<br />Manual Scouting
                    </h1>
                    <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                        The traditional SDR model is broken. Paying humans to perform robotic data entry is inefficient, expensive, and unscalable. <span className="text-white font-medium">It's time to automate.</span>
                    </p>
                </div>

                {/* 3 Key Hard Truths */}
                <div className="grid md:grid-cols-3 gap-8 mb-32">
                    {/* Truth 1: Cost */}
                    <div className="bg-gradient-to-b from-[#1E1B2E] to-[#131120] border border-slate-700/50 p-10 rounded-[2rem] hover:border-indigo-500/50 transition-all duration-300 group hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-2">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500/20 transition-colors ring-1 ring-indigo-500/20">
                            <DollarSign className="w-9 h-9 text-indigo-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">80% Cost Reduction</h3>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            A traditional SDR costs <strong>$4k - $6k/mo</strong>
                            <sup className="ml-1">
                                <a href="https://www.glassdoor.com/Salaries/sales-development-representative-salary-SRCH_KO0,30.htm" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">[1]</a>
                            </sup>.
                            An autonomous agent works 24/7 for a fraction of that. You save <strong>~$200k</strong> over 3 years per head.
                        </p>
                    </div>

                    {/* Truth 2: Time Waste */}
                    <div className="bg-gradient-to-b from-[#1E1B2E] to-[#131120] border border-slate-700/50 p-10 rounded-[2rem] hover:border-purple-500/50 transition-all duration-300 group hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] hover:-translate-y-2">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-500/20 transition-colors ring-1 ring-purple-500/20">
                            <Clock className="w-9 h-9 text-purple-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Reclaim 72% of Time</h3>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            SDRs spend <strong>72%</strong> of their week on non-selling tasks like data entry
                            <sup className="ml-1">
                                <a href="https://www.salesforce.com/news/stories/state-of-sales-report-2023/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer transition-colors">[2]</a>
                            </sup>.
                            Agents handle the busywork instantly, letting humans focus on closing.
                        </p>
                    </div>

                    {/* Truth 3: Volume & Speed */}
                    <div className="bg-gradient-to-b from-[#1E1B2E] to-[#131120] border border-slate-700/50 p-10 rounded-[2rem] hover:border-blue-500/50 transition-all duration-300 group hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:-translate-y-2">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-colors ring-1 ring-blue-500/20">
                            <Zap className="w-9 h-9 text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">5x Lead Volume</h3>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Agents don't sleep. While an SDR validates 50 leads/day, our system validates <strong>250+</strong>. Response times drop to seconds
                            <sup className="ml-1">
                                <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors">[3]</a>
                            </sup>.
                        </p>
                    </div>
                </div>

                {/* The Comparison Table */}
                <div className="mb-32 animate-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">The Hard Numbers</h2>
                        <p className="text-gray-400">Comparing manual human effort vs. autonomous execution</p>
                    </div>

                    <div className="relative">
                        {/* Glow effect behind table */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 blur-3xl -z-10" />

                        <div className="overflow-hidden rounded-[2rem] border border-slate-700/50 bg-[#1E1B2E]/50 backdrop-blur-xl shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 bg-white/5">
                                        <th className="p-8 text-gray-300 font-medium text-lg">Metric</th>
                                        <th className="p-8 text-red-300 font-bold w-1/3 text-xl">Manual SDR Team</th>
                                        <th className="p-8 text-green-400 font-bold w-1/3 text-xl bg-green-500/5">Cognitive Summit Agents</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50 text-lg">
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-8 text-gray-300">
                                            Monthly Cost (per head)
                                            <sup className="ml-1">
                                                <a href="https://www.glassdoor.com/Salaries/sales-development-representative-salary-SRCH_KO0,30.htm" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">[1]</a>
                                            </sup>
                                        </td>
                                        <td className="p-8 text-red-200">$5,000+</td>
                                        <td className="p-8 text-green-300 font-semibold bg-green-500/5">~ $800</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-8 text-gray-300">
                                            Active Selling Time
                                            <sup className="ml-1">
                                                <a href="https://www.salesforce.com/news/stories/state-of-sales-report-2023/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer transition-colors">[2]</a>
                                            </sup>
                                        </td>
                                        <td className="p-8 text-red-200">28% (3 hrs/day)</td>
                                        <td className="p-8 text-green-300 font-semibold bg-green-500/5">100% (24 hrs/day)</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-8 text-gray-300">
                                            Lead Validation Speed
                                            <sup className="ml-1">
                                                <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors">[3]</a>
                                            </sup>
                                        </td>
                                        <td className="p-8 text-red-200">5-10 mins / lead</td>
                                        <td className="p-8 text-green-300 font-semibold bg-green-500/5">Seconds</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-8 text-gray-300">Scalability</td>
                                        <td className="p-8 text-red-200">Linear (Hire & Train)</td>
                                        <td className="p-8 text-green-300 font-semibold bg-green-500/5">Instant (Spin up Agents)</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-8 text-gray-300">Human Error Rate</td>
                                        <td className="p-8 text-red-200">High (Fatigue/Boredom)</td>
                                        <td className="p-8 text-green-300 font-semibold bg-green-500/5">Zero</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Final Pitch / Bottom Section */}
                <div className="text-center bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-500/30 rounded-[3rem] p-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] group-hover:bg-purple-500/30 transition-colors duration-500" />

                    <div className="relative z-10">
                        <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">Stop Buying Lists.<br />Start Building Pipeline.</h2>
                        <p className="text-2xl text-gray-200 max-w-3xl mx-auto mb-12 font-light">
                            Your competitors are already automating. Don't let manual data entry act as a bottleneck to your revenue growth.
                        </p>
                        <button onClick={onClose} className="bg-white text-indigo-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl">
                            Explore the Platform
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
