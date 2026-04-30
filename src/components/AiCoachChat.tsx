/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, MessageSquare, Loader2, Minimize2, Plus } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AiCoachChat({ inline = false, disabled = false }: { inline?: boolean, disabled?: boolean }) {
  const [sessions, setSessions] = useState<{id: string, title: string, messages: ChatMessage[]}[]>(() => {
    const saved = localStorage.getItem('nexus_chat_sessions');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'New Strategic Discussion', messages: [] }];
  });
  
  if (disabled) {
    if (inline) {
      return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-12 text-center font-sans">
          <div className="w-20 h-20 bg-gray-200 text-gray-400 rounded-2xl flex items-center justify-center mb-8">
            <Bot className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-text-main mb-4">Neural Access Restricted</h2>
          <p className="text-text-muted max-w-sm font-bold text-sm leading-relaxed">
            Your organization has restricted AI coaching capabilities for this account. Please connect with your HR administrator to provision neural access.
          </p>
        </div>
      );
    }
    return null;
  }

  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(inline);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  useEffect(() => {
    localStorage.setItem('nexus_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeSessionId]);

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'New Coaching Session',
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    
    // Update title if it's the first message
    let newTitle = activeSession.title;
    if (messages.length === 0) {
      newTitle = input.length > 30 ? input.substring(0, 30) + '...' : input;
    }

    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { ...s, title: newTitle, messages: updatedMessages } 
        : s
    ));
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: updatedMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are a professional certified executive coach with over 20 years of experience. Your goal is to provide high-level leadership coaching, strategic advice, and professional guidance. Be encouraging but firm, insightful, and always maintain a professional tone. \n\nIMPORTANT: Format your responses with Markdown for clarity. Use bullet points for lists, bold for emphasis, and clear headings if needed. Provide structured feedback that is easy for a busy executive to scan and understand. Help the user navigate complex business challenges, leadership dilemmas, and career growth.",
        }
      });

      const aiMessage: ChatMessage = { role: 'model', text: response.text || 'I apologize, but I am unable to respond at this moment.' };
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...updatedMessages, aiMessage] } 
          : s
      ));
    } catch (error) {
      console.error('Gemini Error:', error);
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...updatedMessages, { role: 'model', text: "I encountered an error. Please try again later." }] } 
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  if (inline) {
    return (
      <div className="h-full flex bg-white overflow-hidden">
        {/* Chat Sidebar */}
        <div className="w-80 border-r border-border flex flex-col bg-gray-50/50">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-black text-xs uppercase tracking-widest text-text-muted">Coach History</h3>
            <button 
              onClick={createNewSession}
              className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {sessions.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  activeSessionId === s.id 
                    ? 'bg-white border-primary shadow-sm text-primary' 
                    : 'border-transparent text-text-muted hover:bg-white hover:border-border hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold truncate">{s.title}</span>
                </div>
                {s.messages.length > 0 && (
                  <p className="text-[10px] mt-1 opacity-60 font-medium truncate ml-7">
                    {s.messages[s.messages.length - 1].text.substring(0, 40)}...
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col relative">
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight text-text-main">{activeSession.title}</h3>
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">24/7 Leadership Intelligence</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-12 space-y-6 bg-white"
          >
            {messages.length === 0 && (
              <div className="text-center py-20 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h4 className="font-black text-text-main text-2xl mb-4 tracking-tight">Ready for a breakthrough?</h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  Describe a current leadership challenge, a team dynamic, or a strategic goal. As your executive coach, I'll help you find the optimal path forward.
                </p>
              </div>
            )}
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-6 rounded-3xl text-sm leading-relaxed shadow-sm [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-black ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none font-medium' 
                      : 'bg-surface border border-border text-text-main rounded-tl-none'
                  }`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-border p-6 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-xs text-text-muted font-bold uppercase tracking-widest italic">Coach is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="p-8 bg-gray-50/50 border-t border-border backdrop-blur-md">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message your executive coach... (e.g. 'How do I handle a team conflict?')"
                  className="w-full pl-6 pr-16 py-5 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 p-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center mt-4 text-text-muted font-bold uppercase tracking-widest opacity-50">
                Nexus AI Coaching can provide strategic advice but human discretion is advised
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300 ${isExpanded ? 'w-[500px] h-[700px]' : 'w-16 h-16'}`}>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex-grow bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">AI Executive Coach</h3>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">24/7 Professional Guidance</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 px-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-text-main text-sm mb-2">Ready to lead?</h4>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Start a conversation about your leadership challenges or strategic goals. I'm here to coach you through them.
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-black ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-border text-text-main rounded-tl-none'
                  }`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-text-muted font-medium italic">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-border">
              <div className="relative flex items-center gap-2">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for leadership advice..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Bot className="w-8 h-8 relative z-10" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
