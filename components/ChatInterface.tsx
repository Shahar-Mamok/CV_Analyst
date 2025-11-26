import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Minimize2 } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createChatSession } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatInterfaceProps {
  cvText: string;
  jobText: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ cvText, jobText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello. I am Agent Architect. I can help you refine your resume or prepare for interviews. How can I assist you today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // Initialize chat on open if not exists
  useEffect(() => {
    if (isOpen && !chatInstance) {
      try {
        const chat = createChatSession({ cvText, jobText });
        setChatInstance(chat);
      } catch (e) {
        console.error("Failed to init chat", e);
      }
    }
  }, [isOpen, cvText, jobText]); // Re-init if context changes significantly? Maybe just keep session open.

  const handleSend = async () => {
    if (!inputText.trim() || !chatInstance) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const result = await chatInstance.sendMessageStream({ message: userMsg.text });
      
      let fullResponse = '';
      const responseId = (Date.now() + 1).toString();
      
      // Add placeholder for stream
      setMessages(prev => [...prev, { id: responseId, role: 'model', text: '' }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullResponse += text;
        
        setMessages(prev => 
            prev.map(msg => msg.id === responseId ? { ...msg, text: fullResponse } : msg)
        );
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I encountered an error connecting to the neural network. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl shadow-indigo-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group
            ${isOpen ? 'bg-slate-800 text-slate-400 rotate-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="fill-current" />}
        
        {/* Notification Dot */}
        {!isOpen && messages.length > 1 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#030712]"></span>
        )}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-8 z-40 w-[90vw] md:w-[400px] max-h-[600px] h-[80vh] flex flex-col bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 origin-bottom-right
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Bot size={18} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-100 text-sm">Agent Architect</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-emerald-400 font-medium">Online • Gemini 3 Pro</span>
                    </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <Minimize2 size={18} />
            </button>
        </div>

        {/* Messages Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/50">
            {messages.map((msg, idx) => (
                <div 
                    key={msg.id} 
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
                        ${msg.role === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-indigo-500/10 text-indigo-400'}
                    `}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    
                    <div className={`
                        max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                        ${msg.role === 'user' 
                            ? 'bg-slate-800 text-slate-200 rounded-tr-sm' 
                            : 'bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/5 text-slate-300 rounded-tl-sm shadow-sm'}
                    `}>
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {isTyping && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                        <Bot size={14} />
                    </div>
                    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-white/5">
            <div className="relative flex items-end gap-2 bg-slate-950/50 border border-white/10 rounded-xl p-2 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your CV..."
                    className="w-full max-h-32 bg-transparent border-0 text-slate-200 text-sm placeholder:text-slate-600 focus:ring-0 resize-none py-2 px-2 custom-scrollbar"
                    rows={1}
                    style={{ minHeight: '40px' }}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || isTyping}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-[1px]"
                >
                    {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
            <div className="mt-2 flex justify-center">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <Sparkles size={10} />
                    <span>AI-generated responses can be inaccurate.</span>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
