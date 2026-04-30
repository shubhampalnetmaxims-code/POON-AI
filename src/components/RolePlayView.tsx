/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Send, 
  Loader2, 
  ChevronLeft, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ChatMessage, RolePlayScenario, UploadedPDF } from '../types.ts';
import { ROLE_PLAY_SCENARIOS } from '../constants.ts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function RolePlayView({ scenarios, pdfs, disabled = false }: { scenarios: RolePlayScenario[], pdfs: UploadedPDF[], disabled?: boolean }) {
  const [selectedScenario, setSelectedScenario] = useState<RolePlayScenario | null>(null);
  
  if (disabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-12 text-center font-sans">
        <div className="w-20 h-20 bg-gray-200 text-gray-400 rounded-2xl flex items-center justify-center mb-8">
          <MessageSquare className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-text-main mb-4">Simulation Access Restricted</h2>
        <p className="text-text-muted max-w-sm font-bold text-sm leading-relaxed">
          Dynamic role-play simulations are restricted for your current profile. Please consult your executive dashboard or contact system administration for neural entitlement.
        </p>
      </div>
    );
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [completedScores, setCompletedScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('nexus_roleplay_scores');
    return saved ? JSON.parse(saved) : {};
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('nexus_roleplay_scores', JSON.stringify(completedScores));
  }, [completedScores]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startScenario = (scenario: RolePlayScenario) => {
    setSelectedScenario(scenario);
    setMessages([{ role: 'model', text: scenario.initialMessage }]);
    setIsFinished(false);
    setFeedback(null);
    setScore(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isFinished || !selectedScenario) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const pdfContext = selectedScenario.pdfSource 
      ? pdfs.find(p => p.name === selectedScenario.pdfSource)?.extractedContext 
      : null;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: updatedMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are playing a role in a corporate leadership simulation. 
          Scenario: ${selectedScenario.title}
          Context: ${selectedScenario.description}
          ${pdfContext ? `\n\nREQUIRED GROUNDING KNOWLEDGE (You MUST base your responses on These specific organizational rules/policies): \n${pdfContext}` : ''}
          
          Your Role: You are the person the user is talking to in the scenario. Stay in character.
          
          GOAL FOR THE USER: The user needs to reach a satisfactory resolution (e.g., de-escalation, compromise, moving forward).
          
          END CONDITION: If the user provides a truly excellent, professional, and strategic response that would reasonably resolve the simulation (especially if they correctly apply knowledge from the grounding provided above), you should break character slightly at the very end of your response by adding a special token [RESOLUTION_SUCCESS] followed by a score from 0-100 and then 2-3 sentences of feedback on why their approach worked.
          
          Format for success: [RESOLUTION_SUCCESS][SCORE:85] Feedback text here...
          
          Otherwise, stay in character and react realistically (defensively, skeptically, etc.) until they get it right.`,
        }
      });

      const responseText = response.text || '';
      
      if (responseText.includes('[RESOLUTION_SUCCESS]')) {
        const [chatContent, rest] = responseText.split('[RESOLUTION_SUCCESS]');
        const scoreMatch = rest.match(/\[SCORE:(\d+)\]/);
        const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : 80;
        const feedbackContent = rest.replace(/\[SCORE:\d+\]/, '').trim();
        
        setMessages(prev => [...prev, { role: 'model', text: chatContent.trim() }]);
        setFeedback(feedbackContent);
        setScore(extractedScore);
        setIsFinished(true);
        setCompletedScores(prev => ({
          ...prev,
          [selectedScenario.id]: Math.max(prev[selectedScenario.id] || 0, extractedScore)
        }));
      } else {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error('Gemini Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "The simulation encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedScenario) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Scenario Header */}
        <div className="p-6 border-b border-border bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedScenario(null)}
              className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  selectedScenario.category === 'Conflict' ? 'bg-red-50 text-red-600' :
                  selectedScenario.category === 'Crisis' ? 'bg-orange-50 text-orange-600' :
                  selectedScenario.category === 'Negotiation' ? 'bg-blue-50 text-blue-600' :
                  selectedScenario.category === 'Ethics' ? 'bg-purple-50 text-purple-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {selectedScenario.category}
                </span>
                <h3 className="font-black text-lg tracking-tight text-text-main">{selectedScenario.title}</h3>
              </div>
              <p className="text-xs text-text-muted font-medium">{selectedScenario.description}</p>
            </div>
          </div>
          {isFinished && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Resolution Achieved</span>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-12 space-y-6"
        >
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

            {feedback && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 p-8 rounded-3xl mt-10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-green-700">
                    <Target className="w-6 h-6" />
                    <h4 className="font-black text-lg">Coach Analysis</h4>
                  </div>
                  {score !== null && (
                    <div className="bg-white px-4 py-2 rounded-xl border border-green-200 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block leading-none mb-1">Accuracy Score</span>
                      <span className="text-2xl font-black text-green-600 leading-none">{score}%</span>
                    </div>
                  )}
                </div>
                <p className="text-green-800 text-sm leading-relaxed font-medium italic">
                  "{feedback}"
                </p>
                <button 
                  onClick={() => setSelectedScenario(null)}
                  className="mt-6 px-6 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-green-700 transition-colors"
                >
                  Return to Library
                </button>
              </motion.div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border p-6 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-xs text-text-muted font-bold uppercase tracking-widest italic">Simulation processing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        {!isFinished && (
          <div className="p-8 bg-gray-50 border-t border-border">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response to the situation..."
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
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50/30">
      <div className="p-12 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-4xl font-black tracking-tight text-text-main mb-4">Leadership Role Plays</h2>
          <p className="text-text-muted font-medium text-lg max-w-2xl">
            Test your executive intuition in high-stakes corporate scenarios. Each simulation is powered by AI to react realistically to your decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <motion.div 
              key={scenario.id}
              whileHover={{ y: -5 }}
              onClick={() => startScenario(scenario)}
              className="bg-white border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  scenario.category === 'Conflict' ? 'bg-red-50 text-red-600' :
                  scenario.category === 'Crisis' ? 'bg-orange-50 text-orange-600' :
                  scenario.category === 'Negotiation' ? 'bg-blue-50 text-blue-600' :
                  scenario.category === 'Ethics' ? 'bg-purple-50 text-purple-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  {scenario.category}
                </span>
                <div className="w-10 h-10 bg-gray-50 group-hover:bg-primary/10 text-text-muted group-hover:text-primary rounded-xl flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors">{scenario.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
                {scenario.description}
              </p>
              {completedScores[scenario.id] !== undefined && (
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex-grow bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completedScores[scenario.id]}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{completedScores[scenario.id]}% Accuracy</span>
                </div>
              )}
              <div className="pt-6 border-t border-gray-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted">
                <AlertCircle className="w-3.5 h-3.5" />
                {completedScores[scenario.id] !== undefined ? 'Improve your score' : 'High Stakes Simulation'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
