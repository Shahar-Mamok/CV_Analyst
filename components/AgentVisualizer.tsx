import React, { useEffect, useState } from 'react';
import { User, Database, CheckCircle2, Loader2, Server, Code2, Search } from 'lucide-react';
import { AgentStatus } from '../types';

interface AgentVisualizerProps {
  status: AgentStatus;
}

const loadingMessages = {
  [AgentStatus.VALIDATING]: [
    "MEASURING_CONTENT_DENSITY",
    "VERIFYING_FILE_INTEGRITY",
    "CHECKING_FORMAT_COMPLIANCE",
  ],
  [AgentStatus.EXTRACTING]: [
    "PARSING_SEMANTIC_LAYERS",
    "MAPPING_SKILL_VECTORS",
    "STRUCTURING_UNSTRUCTURED_DATA",
  ],
  [AgentStatus.ANALYZING]: [
    "RUNNING_GAP_ANALYSIS",
    "SIMULATING_ATS_PARSER",
    "CALCULATING_FIT_SCORE",
    "GENERATING_STRATEGY",
  ]
};

const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ status }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    setMessageIndex(0);
    if (status === AgentStatus.VALIDATING || status === AgentStatus.EXTRACTING || status === AgentStatus.ANALYZING) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % (loadingMessages[status]?.length || 1));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [status]);

  const currentMessage = loadingMessages[status as keyof typeof loadingMessages]?.[messageIndex] || "";

  return (
    <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Nodes Container */}
        <div className="flex justify-between items-center w-full max-w-md px-2 mb-10">
          <AgentNode
            icon={<Code2 size={20} />}
            label="FRONTEND"
            isActive={status === AgentStatus.VALIDATING}
            isDone={status !== AgentStatus.IDLE && status !== AgentStatus.VALIDATING}
          />
          <Connector isActive={status !== AgentStatus.IDLE && status !== AgentStatus.VALIDATING} />
          <AgentNode
            icon={<Server size={20} />}
            label="BACKEND"
            isActive={status === AgentStatus.EXTRACTING}
            isDone={status === AgentStatus.ANALYZING || status === AgentStatus.COMPLETE}
          />
          <Connector isActive={status === AgentStatus.ANALYZING || status === AgentStatus.COMPLETE} />
          <AgentNode
            icon={<Search size={20} />}
            label="ANALYST"
            isActive={status === AgentStatus.ANALYZING}
            isDone={status === AgentStatus.COMPLETE}
          />
        </div>
        
        {/* HUD Status Text */}
        <div className="h-8 flex items-center justify-center w-full">
            {(status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETE && status !== AgentStatus.ERROR) && (
               <div className="flex flex-col items-center gap-1 animate-fade-in">
                 <div className="flex items-center gap-2 text-indigo-400">
                    <Loader2 size={12} className="animate-spin" />
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase animate-pulse">{currentMessage}</span>
                 </div>
                 <div className="w-32 h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-progress w-full origin-left"></div>
                 </div>
               </div>
            )}
            {status === AgentStatus.COMPLETE && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Analysis Complete</span>
                </div>
            )}
            {status === AgentStatus.ERROR && (
                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/20">SYSTEM ERROR</span>
            )}
        </div>
      </div>
    </div>
  );
};

const AgentNode = ({ icon, label, isActive, isDone }: { icon: React.ReactNode, label: string, isActive: boolean, isDone: boolean }) => (
  <div className="flex flex-col items-center gap-4 relative">
    <div className={`
      w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 relative
      ${isDone 
        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
        : isActive 
            ? 'bg-indigo-600 border border-indigo-400 text-white shadow-[0_0_40px_rgba(99,102,241,0.6)] scale-110' 
            : 'bg-slate-800 border border-slate-700 text-slate-600'
      }
    `}>
      {isActive && <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20"></div>}
      {isDone ? <CheckCircle2 size={22} /> : icon}
    </div>
    <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-indigo-300' : isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
      {label}
    </span>
  </div>
);

const Connector = ({ isActive }: { isActive: boolean }) => (
  <div className="flex-1 h-[1px] bg-slate-800 mx-2 relative">
    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-1000 ease-out origin-left ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
    {isActive && <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse"></div>}
  </div>
);

export default AgentVisualizer;