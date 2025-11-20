import React, { useState, useMemo } from 'react';
import { X, Trash2, ChevronRight, History, FolderOpen, ChevronDown, CalendarClock, ArrowRight } from 'lucide-react';
import { SavedAnalysis } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedAnalysis[];
  onLoad: (item: SavedAnalysis) => void;
  onDelete: (id: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, savedItems, onLoad, onDelete }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Group items by Category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SavedAnalysis[]> = {};
    savedItems.forEach(item => {
      const cat = item.category || "Uncategorized";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [savedItems]);

  const toggleFolder = (category: string) => {
    const newSet = new Set(expandedFolders);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedFolders(newSet);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-xs bg-[#0f172a] border-l border-white/10 shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col font-['Outfit'] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <History size={20} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">My Analysis</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center">
              <History size={48} className="mb-4 opacity-20" />
              <p className="text-sm">No saved archives.</p>
              <p className="text-xs mt-2 text-slate-600">Save your analysis to see it cataloged here.</p>
            </div>
          ) : (
            Object.keys(groupedItems).map((category) => {
               const isExpanded = expandedFolders.has(category);
               const items = groupedItems[category];
               
               return (
                 <div key={category} className="bg-slate-900/30 rounded-xl overflow-hidden border border-white/5 transition-all duration-300">
                    {/* Folder Header */}
                    <button 
                        onClick={() => toggleFolder(category)}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${isExpanded ? 'bg-white/5 text-indigo-300' : 'hover:bg-white/5 text-slate-300'}`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                             <FolderOpen size={16} className={isExpanded ? 'text-indigo-400' : 'text-slate-500'} />
                             <span className="text-sm font-medium truncate">{category}</span>
                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{items.length}</span>
                        </div>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {/* Folder Items (Accordion Content) */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-black/20 p-2 space-y-1">
                            {items.map(item => (
                                <div key={item.id} className="group flex flex-col gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 relative">
                                    <div 
                                        onClick={() => {
                                            onLoad(item);
                                            onClose();
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-medium text-slate-200">{item.title}</span>
                                            <span className={`text-[10px] font-bold ${item.result.matchScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {item.result.matchScore}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                            <CalendarClock size={10} />
                                            {new Date(item.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                        }}
                                        className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
               );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;