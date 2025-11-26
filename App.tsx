import React, { useState, useEffect } from 'react';
import AgentVisualizer from './components/AgentVisualizer';
import InputSection from './components/InputSection';
import ResultsView from './components/ResultsView';
import HistoryDrawer from './components/HistoryDrawer';
import ChatInterface from './components/ChatInterface';
import { AgentStatus, AnalysisResult, SavedAnalysis } from './types';
import { analyzeCVWithGemini } from './services/geminiService';
import { getSavedAnalyses, saveAnalysisToStorage, deleteAnalysisFromStorage } from './services/storage';
import { Sparkles, ShieldCheck, History } from 'lucide-react';

const App: React.FC = () => {
  // App State
  const [cvText, setCvText] = useState('');
  const [jobText, setJobText] = useState('');
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  // Load history on mount
  useEffect(() => {
    setSavedAnalyses(getSavedAnalyses());
  }, []);

  const runAnalysis = async () => {
    setStatus(AgentStatus.VALIDATING);
    setResult(null);

    // Phase 1: Frontend Validation Simulation
    await new Promise(r => setTimeout(r, 800));
    
    if (cvText.length < 50 || jobText.length < 50) {
       setStatus(AgentStatus.IDLE);
       alert("Please ensure both CV and Job Description have sufficient content.");
       return;
    }

    // Phase 2: Backend Processing Simulation
    setStatus(AgentStatus.EXTRACTING);
    await new Promise(r => setTimeout(r, 1000));
    
    // Phase 3: AI Analysis
    setStatus(AgentStatus.ANALYZING);
    
    try {
      const analysisData = await analyzeCVWithGemini(cvText, jobText);
      setResult(analysisData);
      setStatus(AgentStatus.COMPLETE);

    } catch (error) {
      console.error(error);
      setStatus(AgentStatus.ERROR);
    }
  };

  const handleSaveAnalysis = (category: string, title: string) => {
    if (!result) return;
    const newSave: SavedAnalysis = {
      id: crypto.randomUUID(),
      category,
      title,
      date: new Date().toISOString(),
      cvText,
      jobText,
      result
    };
    saveAnalysisToStorage(newSave);
    setSavedAnalyses(getSavedAnalyses());
  };

  const handleLoadAnalysis = (item: SavedAnalysis) => {
    setCvText(item.cvText);
    setJobText(item.jobText);
    setResult(item.result);
    setStatus(AgentStatus.COMPLETE);
    setIsHistoryOpen(false);
    
    // Scroll to results
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteAnalysis = (id: string) => {
    const updated = deleteAnalysisFromStorage(id);
    setSavedAnalyses(updated);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col relative overflow-x-hidden font-['Outfit']">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none z-0" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => {
               setStatus(AgentStatus.IDLE);
               setResult(null);
               setCvText('');
               setJobText('');
            }}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="text-white relative z-10" size={20} fill="currentColor" fillOpacity={0.2} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-xl tracking-tight text-white leading-tight group-hover:text-indigo-200 transition-colors">
                CV Architect
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Agentic AI Core</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-xs font-medium text-slate-400">Secure Session</span>
            </div>
            
            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

            <button 
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all relative"
                title="Saved Analyses"
            >
                <History size={20} />
                {savedAnalyses.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
                )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 py-10 relative z-10 flex flex-col gap-10">
        
        {/* Section 1: Input */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <InputSection 
            cvText={cvText} 
            setCvText={setCvText} 
            jobText={jobText} 
            setJobText={setJobText} 
            onAnalyze={runAnalysis}
            isProcessing={status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETE && status !== AgentStatus.ERROR}
          />
        </section>

        {/* Section 2: Visualizer (Only show when active or done) */}
        {(status !== AgentStatus.IDLE) && (
          <section className="animate-in fade-in zoom-in-95 duration-500">
            <AgentVisualizer status={status} />
          </section>
        )}

        {/* Section 3: Results */}
        {result && (
           <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
             <ResultsView result={result} onSave={handleSaveAnalysis} />
           </section>
        )}
        
        <footer className="text-center py-10 text-slate-600 text-xs">
          <p>&copy; 2025 Agentic CV Architect. Powered by Gemini 2.5 Flash & Gemini 3 Pro.</p>
        </footer>

      </main>

      <HistoryDrawer 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        savedItems={savedAnalyses}
        onLoad={handleLoadAnalysis}
        onDelete={handleDeleteAnalysis}
      />

      {/* Chat Interface */}
      <ChatInterface cvText={cvText} jobText={jobText} />

    </div>
  );
};

export default App;
