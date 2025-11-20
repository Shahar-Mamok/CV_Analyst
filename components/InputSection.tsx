import React, { useState, useCallback } from 'react';
import { FileText, Briefcase, Upload, Loader2, AlertCircle, X, CheckCircle2, Wand2 } from 'lucide-react';
import { extractTextFromFile } from '../utils/fileHelpers';

interface InputSectionProps {
  cvText: string;
  setCvText: (text: string) => void;
  jobText: string;
  setJobText: (text: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  cvText,
  setCvText,
  jobText,
  setJobText,
  onAnalyze,
  isProcessing
}) => {
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    setIsFileLoading(true);
    setUploadError(null);

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length === 0) {
        throw new Error("File appears to be empty or unreadable.");
      }
      setCvText(text);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
      setUploadError((err as Error).message || "Failed to process file");
      setFileName(null);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = ''; // Reset input so same file can be selected again if needed
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing && !isFileLoading) {
        setIsDragging(true);
    }
  }, [isProcessing, isFileLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing || isFileLoading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
        if (file.type === 'application/pdf' || 
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            file.name.endsWith('.pdf') || 
            file.name.endsWith('.docx')) {
            await processFile(file);
        } else {
            setUploadError("Unsupported file type. Please drop a PDF or DOCX.");
        }
    }
  }, [isProcessing, isFileLoading]);

  const handleClear = () => {
      setCvText('');
      setJobText('');
      setFileName(null);
      setUploadError(null);
  };

  const isValid = cvText.length > 50 && jobText.length > 50;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Card 1: CV Input */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-1 transition-all hover:border-white/10 shadow-xl shadow-black/20">
        <div className="bg-[#050a15]/60 rounded-[20px] p-5 flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-sm font-semibold tracking-wide flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                 <FileText size={16} />
              </div>
              CV / Resume Content
            </label>
            {cvText.length > 0 && (
               <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-white/5">
                 {cvText.length} chars
               </div>
            )}
          </div>

          {/* Textarea */}
          <textarea
            className="w-full h-32 bg-transparent border-0 text-slate-300 text-sm placeholder:text-slate-600 focus:ring-0 resize-none leading-relaxed"
            placeholder="Paste raw text here or drop your resume below..."
            value={cvText}
            onChange={(e) => {
                setCvText(e.target.value);
                if (!e.target.value) setFileName(null);
            }}
            disabled={isProcessing || isFileLoading}
          />

          {/* Upload Zone (Drag & Drop) */}
          <div 
            className="relative group"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="cv-upload"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              disabled={isProcessing || isFileLoading}
            />
            <label 
              htmlFor="cv-upload"
              className={`
                relative flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 border-dashed transition-all cursor-pointer
                ${isDragging 
                    ? 'bg-indigo-500/10 border-indigo-500 scale-[1.01]' 
                    : fileName 
                        ? 'bg-emerald-500/5 border-emerald-500/30' 
                        : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 hover:border-indigo-500/50'
                }
              `}
            >
                {isFileLoading ? (
                    <Loader2 size={24} className="animate-spin text-indigo-400" />
                ) : fileName ? (
                    <CheckCircle2 size={24} className="text-emerald-400" />
                ) : (
                    <Upload size={24} className={`transition-colors ${isDragging ? 'text-indigo-400' : 'text-slate-500'}`} />
                )}
                
                <div className="text-center">
                    <span className={`text-xs font-medium block mb-1 ${fileName ? 'text-emerald-300' : isDragging ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-200'}`}>
                    {isFileLoading 
                        ? 'Parsing document...' 
                        : fileName 
                            ? fileName 
                            : isDragging 
                                ? 'Drop file here to upload' 
                                : 'Drop PDF / DOCX here or click to browse'
                    }
                    </span>
                    {!fileName && !isFileLoading && !isDragging && (
                        <span className="text-[10px] text-slate-600">
                            Supports PDF & DOCX (Text Extraction)
                        </span>
                    )}
                </div>
            </label>
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle size={14} />
              {uploadError}
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Job Description */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-1 transition-all hover:border-white/10 shadow-xl shadow-black/20">
        <div className="bg-[#050a15]/60 rounded-[20px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-sm font-semibold tracking-wide flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                 <Briefcase size={16} />
              </div>
              Target Job Description
            </label>
            {jobText.length > 0 && (
               <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-white/5">
                 {jobText.length} chars
               </div>
            )}
          </div>

          <textarea
            className="w-full h-32 bg-transparent border-0 text-slate-300 text-sm placeholder:text-slate-600 focus:ring-0 resize-none leading-relaxed"
            placeholder="Paste the full job requirements here..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-4 pt-2">
        {(cvText || jobText) && (
            <button
                onClick={handleClear}
                disabled={isProcessing}
                className="px-5 rounded-xl font-medium text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
                Clear
            </button>
        )}
        <button
            onClick={onAnalyze}
            disabled={isProcessing || !isValid || isFileLoading}
            className={`
            flex-1 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300
            flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group
            ${isProcessing || !isValid || isFileLoading
                ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:scale-[1.01] active:scale-[0.99]'
            }
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            {isProcessing ? (
                <>
                   <Loader2 size={16} className="animate-spin text-white/70" />
                   <span>Initializing Agents...</span>
                </>
            ) : (
                <>
                   <Wand2 size={16} className="text-indigo-100" />
                   <span>Run Architect</span>
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;