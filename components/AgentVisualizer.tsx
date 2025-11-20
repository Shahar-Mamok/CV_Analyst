import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Server, Code2, Search, BrainCircuit } from 'lucide-react';
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
    <div className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      {/* Inject Custom Styles for Beam Animation */}
      <style>{`
        @keyframes beam-flow {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-beam {
          animation: beam-flow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Background Grid & Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Nodes Container */}
        <div className="flex justify-between items-center w-full max-w-md px-4 mb-12 relative">
            {/* Connecting Line Background */}
            <div className="absolute left-10 right-10 h-[2px] bg-slate-800 -z-10 top-[28px]"></div>

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
                icon={<BrainCircuit size={20} />}
                label="ANALYST"
                isActive={status === AgentStatus.ANALYZING}
                isDone={status === AgentStatus.COMPLETE}
            />
        </div>
        
        {/* HUD Status Text */}
        <div className="h-10 flex items-center justify-center w-full">
            {(status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETE && status !== AgentStatus.ERROR) && (
               <div className="flex flex-col items-center gap-2 animate-fade-in">
                 <div className="flex items-center gap-3 text-indigo-400">
                    <Loader2 size={14} className="animate-spin text-indigo-500" />
                    <span className="text-[11px] font-mono tracking-[0.25em] uppercase animate-pulse text-indigo-300 shadow-indigo-500/50 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                        {currentMessage}
                    </span>
                 </div>
                 <div className="w-48 h-0.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-shimmer-slide w-1/2"></div>
                 </div>
               </div>
            )}
            {status === AgentStatus.COMPLETE && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-in zoom-in-90 duration-300">
                    <CheckCircle2 size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Analysis Complete</span>
                </div>
            )}
            {status === AgentStatus.ERROR && (
                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    SYSTEM ERROR
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

const AgentNode = ({ icon, label, isActive, isDone }: { icon: React.ReactNode, label: string, isActive: boolean, isDone: boolean }) => (
  <div className="flex flex-col items-center gap-4 relative group">
    {/* Outer Glow Ring for Active State */}
    {isActive && (
        <div className="absolute top-0 w-14 h-14 rounded-full border-t border-l border-indigo-500/60 animate-[spin_3s_linear_infinite] z-0 scale-125"></div>
    )}
    
    <div className={`
      w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative z-10
      ${isDone 
        ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
        : isActive 
            ? 'bg-indigo-950/80 border border-indigo-400 text-white shadow-[0_0_40px_rgba(99,102,241,0.5)] scale-110' 
            : 'bg-slate-900 border border-slate-800 text-slate-600'
      }
    `}>
      {isActive && (
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping opacity-30"></div>
      )}
      
      {isDone ? <CheckCircle2 size={22} className="animate-in zoom-in duration-300" /> : icon}
    </div>
    
    <span className={`
        text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 absolute -bottom-8 whitespace-nowrap
        ${isActive 
            ? 'text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.5)]' 
            : isDone 
                ? 'text-emerald-400' 
                : 'text-slate-600'
        }
    `}>
      {label}
    </span>
  </div>
);

const Connector = ({ isActive }: { isActive: boolean }) => (
  <div className="flex-1 h-[2px] mx-2 relative overflow-hidden rounded-full bg-slate-800/50">
    {/* Base fill when traversed */}
    <div className={`
        absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 
        transition-transform duration-700 ease-out origin-left
        ${isActive ? 'scale-x-100' : 'scale-x-0'}
    `} />

    {/* Animated Beam Particle */}
    {isActive && (
      <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-beam opacity-0 blur-[2px]"></div>
    )}
  </div>
);

export default AgentVisualizer;
