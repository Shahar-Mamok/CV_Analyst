import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, Scissors, Zap, FileOutput, Download, Check, MessagesSquare, FileText, Trophy, Sparkles, ScanSearch, ArrowRightLeft, FileInput, Briefcase } from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'interview' | 'keywords'>('audit');
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  
  const itemsCount = result.criticalAdjustments.length;
  const checkedCount = checkedItems.size;
  const scoreBonus = Math.min(15, Math.round((checkedCount / Math.max(itemsCount, 1)) * 10)); 
  const currentScore = Math.min(100, result.matchScore + scoreBonus);

  const toggleCheck = (idx: number) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setCheckedItems(newSet);
  };

  const handleDownload = () => {
    const content = `AGENTIC CV ANALYSIS REPORT\nScore: ${result.matchScore}%\n\n${result.improvedSummary}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CV_Analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* Score Dashboard Card */}
      <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:opacity-75 transition-opacity duration-700"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-400 mb-3">
               <Trophy size={12} className="text-yellow-500" />
               Candidate Fit Analysis
             </div>
             <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                {currentScore >= 80 ? 'Excellent Match' : currentScore >= 60 ? 'Strong Potential' : 'Needs Optimization'}
             </h2>
             <p className="text-slate-400 text-sm max-w-md leading-relaxed">
               We've analyzed your semantic footprint against the job architecture. Follow the blueprint below to maximize your impact.
             </p>
          </div>

          {/* Circular Gauge */}
          <div className="relative w-32 h-32 shrink-0">
             <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 160 160">
               <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="transparent" />
               <circle cx="80" cy="80" r="70" stroke="url(#score-gradient)" strokeWidth="12" fill="transparent" 
                 strokeDasharray={440}
                 strokeDashoffset={440 - (440 * currentScore) / 100}
                 strokeLinecap="round"
                 className="transition-all duration-1000 ease-out"
               />
               <defs>
                 <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#6366f1" />
                   <stop offset="100%" stopColor="#a855f7" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
               <span className="text-3xl font-bold text-white tracking-tight">{currentScore}</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Score</span>
             </div>
          </div>
        </div>

        {/* Sub Scores */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
           <ScoreMetric label="Technical" score={result.subScores.technical} />
           <ScoreMetric label="Soft Skills" score={result.subScores.softSkills} />
           <ScoreMetric label="Experience" score={result.subScores.experience} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-900/60 rounded-xl border border-white/5 backdrop-blur-md max-w-lg mx-auto md:mx-0">
        <button 
           onClick={() => setActiveTab('audit')}
           className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2
           ${activeTab === 'audit' ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
           <FileText size={14} /> CV Audit
        </button>
        <button 
           onClick={() => setActiveTab('keywords')}
           className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2
           ${activeTab === 'keywords' ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
           <ScanSearch size={14} /> ATS Keywords
        </button>
        <button 
           onClick={() => setActiveTab('interview')}
           className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2
           ${activeTab === 'interview' ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300'}`}
        >
           <MessagesSquare size={14} /> Prep
        </button>
      </div>

      {/* Tab Content: AUDIT */}
      {activeTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Critical Adjustments */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-red-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
              <AlertTriangle size={14} /> Must Fix Before Applying
            </h3>
            <div className="space-y-3">
               {result.criticalAdjustments.map((item, idx) => (
                 <div 
                   key={idx} 
                   onClick={() => toggleCheck(idx)}
                   className={`
                     group flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                     ${checkedItems.has(idx) 
                       ? 'bg-red-900/10 border-transparent opacity-50' 
                       : 'bg-slate-900/40 border-slate-800 hover:border-red-500/30 hover:bg-slate-800/60'
                     }
                   `}
                 >
                    <div className={`
                      mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all
                      ${checkedItems.has(idx) ? 'bg-red-500 border-red-500 text-white' : 'border-slate-600 group-hover:border-red-400'}
                    `}>
                       {checkedItems.has(idx) && <Check size={12} strokeWidth={4} />}
                    </div>
                    <span className={`text-sm leading-relaxed ${checkedItems.has(idx) ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item}</span>
                 </div>
               ))}
               {result.criticalAdjustments.length === 0 && <p className="text-slate-500 text-sm italic pl-4">No critical issues found.</p>}
            </div>
          </div>

          {/* Noise Reduction */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50"></div>
             <h3 className="text-amber-400 font-bold flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
               <Scissors size={14} /> Shorten / Remove
             </h3>
             <ul className="space-y-4">
                {result.shortenRemove.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                     <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-2 shrink-0"></span>
                     {item}
                  </li>
                ))}
             </ul>
          </div>

          {/* Technical Guidance */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
             <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
               <Zap size={14} /> Technical Strategy
             </h3>
             <ul className="space-y-4">
                {result.technicalGuidance.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-2 shrink-0"></span>
                     {item}
                  </li>
                ))}
             </ul>
          </div>

          {/* Improved Summary - Hero Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-8 shadow-xl relative group">
             <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl border-b border-l border-emerald-500/30 flex items-center gap-2">
                <Sparkles size={12} /> AI REWRITTEN
             </div>
             
             <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
               <FileOutput size={14} /> Improved Summary
             </h3>
             
             <div className="text-slate-300 text-sm leading-7 font-medium font-sans bg-slate-950/30 p-6 rounded-2xl border border-white/5">
               "{result.improvedSummary}"
             </div>
          </div>
        </div>
      )}

      {/* Tab Content: KEYWORDS */}
      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 gap-6 animate-fade-in">
           
           {/* Header Info */}
           <div className="bg-fuchsia-900/10 border border-fuchsia-500/20 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-2 bg-fuchsia-500/20 rounded-lg text-fuchsia-400"><ScanSearch size={20} /></div>
              <div>
                 <h4 className="text-fuchsia-100 font-bold text-sm mb-1">Keyword Injection Generator</h4>
                 <p className="text-fuchsia-300/60 text-xs leading-relaxed">
                    ATS parsers are missing these high-value tokens in your profile. Use the precise phrasing below to increase your semantic match score.
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {result.keywordRecommendations?.map((rec, idx) => {
                let icon = <Sparkles size={18} />;
                let color = "text-slate-400";
                let bg = "bg-slate-500/10";
                let label = "Optimization";

                if (rec.actionType === 'SUMMARY_INJECTION') {
                    icon = <FileInput size={18} />;
                    color = "text-pink-400";
                    bg = "bg-pink-500/10";
                    label = "Summary Injection";
                } else if (rec.actionType === 'PROJECT_ADDITION') {
                    icon = <Briefcase size={18} />;
                    color = "text-cyan-400";
                    bg = "bg-cyan-500/10";
                    label = "Project Enhancement";
                } else if (rec.actionType === 'WORD_REPLACEMENT') {
                    icon = <ArrowRightLeft size={18} />;
                    color = "text-amber-400";
                    bg = "bg-amber-500/10";
                    label = "Vocabulary Upgrade";
                }

                return (
                    <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 ${bg.replace('/10', '/50')}`}></div>
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color}`}>
                                    {icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
                                    {label}
                                </span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-slate-950 border border-white/5 text-xs font-mono text-slate-300">
                                {rec.keyword}
                            </div>
                        </div>

                        <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                "{rec.specificSuggestion}"
                            </p>
                        </div>
                    </div>
                );
             })}
             {(!result.keywordRecommendations || result.keywordRecommendations.length === 0) && (
                 <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                     No keyword recommendations generated. Your CV might already be well-optimized!
                 </div>
             )}
           </div>
        </div>
      )}

      {/* Tab Content: INTERVIEW */}
      {activeTab === 'interview' && (
         <div className="grid gap-6 animate-fade-in">
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4">
               <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><MessagesSquare size={20} /></div>
               <div>
                  <h4 className="text-blue-100 font-bold text-sm mb-1">Strategic Interview Prep</h4>
                  <p className="text-blue-300/60 text-xs leading-relaxed">Our Agent has identified potential weak points in your application. Prepare for these targeted questions to flip the narrative.</p>
               </div>
            </div>

            {result.interviewPrep.map((prep, idx) => (
               <div key={idx} className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-white/5">
                       {idx + 1}
                     </div>
                     <h4 className="text-slate-200 font-semibold text-sm">{prep.question}</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 ml-9">
                     <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Context</div>
                        <p className="text-slate-400 text-xs leading-relaxed">{prep.context}</p>
                     </div>
                     <div className="bg-emerald-900/10 rounded-xl p-4 border border-emerald-500/10">
                        <div className="text-[10px] uppercase tracking-widest text-emerald-500/70 font-bold mb-2">Winning Answer Strategy</div>
                        <p className="text-emerald-100/70 text-xs leading-relaxed">{prep.sampleAnswer}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
      
      <div className="flex justify-center pt-8">
        <button onClick={handleDownload} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
           <Download size={14} /> Export Analysis Result
        </button>
      </div>
    </div>
  );
};

const ScoreMetric = ({ label, score }: { label: string, score: number }) => (
  <div className="flex flex-col items-center border-r border-white/5 last:border-0">
     <span className="text-[10px] uppercase text-slate-500 font-bold mb-1">{label}</span>
     <div className="text-xl font-bold text-white">{score}</div>
     <div className="w-12 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
       <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${score}%` }}></div>
     </div>
  </div>
);

export default ResultsView;