import React from 'react';
import { X, Brain, Send, FileText, MessageSquare, LinkIcon, Loader2 } from 'lucide-react';
import { cn } from './utils';

export const CompanyDetailModal = ({ isOpen, onClose, data, strategyData, strategyLoading, onGenerateStrategy, onOpenGmail }) => {
    if (!isOpen || !data) return null;

    const fitScore = data.Fit_Score || 0;
    const category = data.Category || "N/A";
    const product = data.Recommended_Product || "N/A";
    const reasoning = data.Reasoning || "N/A";
    const hook = data.Hook || "N/A";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
                className="relative bg-[#1E1B2E] border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 flex items-center justify-between z-10 rounded-t-2xl">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white rounded-xl p-4 shadow-lg flex items-center justify-center">
                            {data.Logo_Url ? (
                                <a
                                    href={data.Logo_Url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="max-w-full max-h-full flex items-center justify-center"
                                >
                                    <img
                                        src={data.Logo_Url}
                                        alt={data.Company}
                                        className="max-w-full max-h-full object-contain hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                </a>
                            ) : (
                                <div className="text-4xl font-bold text-gray-300">{data.Company?.charAt(0) || "?"}</div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{data.Company}</h2>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg",
                                    fitScore >= 8 ? "bg-green-500" : fitScore >= 5 ? "bg-yellow-500" : fitScore > 0 ? "bg-red-500" : "bg-gray-500"
                                )}>
                                    Fit Score: {fitScore > 0 ? `${fitScore}/10` : "N/A"}
                                </div>
                                {category !== "N/A" && (
                                    <div className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur">
                                        {category}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-6 w-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    {/* Generate Strategy Button */}
                    {!strategyData && (
                        <button
                            onClick={() => onGenerateStrategy(data)}
                            disabled={strategyLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50"
                        >
                            {strategyLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generating Sales Strategy...
                                </>
                            ) : (
                                <>
                                    <Brain className="h-5 w-5" />
                                    Generate Sales Strategy (Agent 3)
                                </>
                            )}
                        </button>
                    )}

                    {/* Agent 3 Results */}
                    {strategyData && (
                        <>
                            {/* Contacts */}
                            {strategyData.contacts && strategyData.contacts.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Send className="h-6 w-6 text-indigo-400" />
                                        Key Contacts ({strategyData.contacts.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {strategyData.contacts.map((contact, idx) => (
                                            <div key={idx} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 transition-colors">
                                                <p className="font-bold text-white text-lg">{contact.name}</p>
                                                <p className="text-slate-400 text-sm mb-3">{contact.title}</p>
                                                <div className="flex flex-col gap-2">
                                                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2">
                                                        <LinkIcon className="h-4 w-4" />
                                                        LinkedIn Profile
                                                    </a>
                                                    <p className="text-slate-300 text-sm">{contact.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Product Analysis */}
                            {strategyData.product_analysis && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Brain className="h-6 w-6 text-purple-400" />
                                        Why {strategyData.product_analysis.product}?
                                    </h3>
                                    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30 space-y-4">
                                        <p className="text-slate-200 leading-relaxed">{strategyData.product_analysis.why_perfect}</p>
                                        {strategyData.product_analysis.use_cases && (
                                            <div>
                                                <h4 className="font-semibold text-indigo-300 mb-2">Use Cases:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-slate-300">
                                                    {strategyData.product_analysis.use_cases.map((uc, idx) => <li key={idx}>{uc}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {strategyData.product_analysis.expected_roi && (
                                            <div>
                                                <h4 className="font-semibold text-green-400 mb-2">Expected ROI:</h4>
                                                <p className="text-slate-300">{strategyData.product_analysis.expected_roi}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Email Draft */}
                            {strategyData.email_draft && (
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <FileText className="h-6 w-6 text-green-400" />
                                        Email Draft
                                    </h3>
                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-400">To:</p>
                                            <p className="text-white font-medium">{strategyData.email_draft.to_name} ({strategyData.email_draft.to_email})</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Subject:</p>
                                            <p className="text-white font-semibold">{strategyData.email_draft.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400 mb-2">Body:</p>
                                            <div className="bg-white/5 rounded-lg p-4 text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {strategyData.email_draft.body}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onOpenGmail(strategyData.email_draft)}
                                            className="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Send className="h-5 w-5" />
                                            Open in Gmail
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Agent 2 Data (shown when no Agent 3 data) */}
                    {!strategyData && (
                        <>
                            {product !== "N/A" && (
                                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <Brain className="h-5 w-5 text-indigo-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-indigo-300">Recommended Product</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-white pl-13">{product}</p>
                                </div>
                            )}

                            {reasoning !== "N/A" && (
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="h-5 w-5" /> Analysis & Reasoning
                                    </h4>
                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                                        <p className="text-slate-300 leading-relaxed">{reasoning}</p>
                                    </div>
                                </div>
                            )}

                            {hook !== "N/A" && (
                                <div className="space-y-3">
                                    <h4 className="text-lg font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" /> Sales Hook
                                    </h4>
                                    <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30 border-l-4 border-l-purple-500">
                                        <p className="text-slate-200 leading-relaxed italic text-lg">"{hook}"</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-slate-700">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Source</p>
                            <p className="text-white font-medium">{data.Source || "Conference Sponsor Page"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
