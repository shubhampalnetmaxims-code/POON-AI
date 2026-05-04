/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Shield } from 'lucide-react';

interface IndividualOnboardingStepProps {
  onComplete: (email: string, pass: string) => void;
  onBack: () => void;
}

export default function IndividualOnboardingStep({ onComplete, onBack }: IndividualOnboardingStepProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(email, password);
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans flex flex-col">
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-10 shrink-0">
        <div className="font-extrabold text-xl text-primary tracking-tighter">NEXUS.IO</div>
        <div className="flex gap-6 text-sm font-medium text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold font-black">✓</span>
            <span className="text-primary font-medium">Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">✓</span>
            <span className="text-primary font-medium">Type</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">03</span>
            <span className="text-primary font-bold">Registration</span>
          </div>
        </div>
        <div className="w-24"></div>
      </header>

      <main className="flex-grow flex items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface border-4 border-black p-12 rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-10 text-[10px] uppercase tracking-widest font-black w-fit"
          >
            <ArrowLeft className="w-3 h-3" />
            Switch Account Type
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Create Account</h2>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Personal Identity</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="p-4 bg-indigo-50 border-2 border-primary/20 rounded-xl flex items-start gap-4 mb-4">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-primary/80 leading-relaxed uppercase tracking-tighter">
                Your data is encrypted with AES-256 standard. Neural access tokens are rotated every 24 hours for security.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-primary text-white rounded-xl font-black uppercase tracking-widest italic flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Continue to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
