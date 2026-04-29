/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../constants.ts';
import { PricingPlan } from '../types.ts';

interface LandingPageProps {
  plans: PricingPlan[];
  onSelectPlan: (plan: PricingPlan) => void;
  onLogin: (email: string, pass: string) => boolean;
}

export default function LandingPage({ plans, onSelectPlan, onLogin }: LandingPageProps & { key?: string }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(loginEmail, loginPass)) {
      setLoginError(true);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans">
      {/* Header */}
      <header className="h-20 border-b border-border bg-surface flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-lg shadow-primary/20">N</div>
          <div className="font-extrabold text-2xl text-primary tracking-tighter">NEXUS.IO</div>
        </div>
        
        <form onSubmit={handleLoginSubmit} className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 border border-border rounded-lg overflow-hidden focus-within:border-primary transition-colors">
            <div className="pl-3 py-2 text-text-muted">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input 
              type="email" 
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="px-3 py-2 bg-transparent text-xs focus:outline-none w-40"
            />
            <div className="pl-3 py-2 text-text-muted border-l border-border flex items-center relative">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="relative flex items-center">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="px-3 py-2 bg-transparent text-xs focus:outline-none w-40 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 text-text-muted hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-opacity-90 transition-all shadow-md shadow-primary/10"
          >
            Login
          </button>
          {loginError && (
            <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse absolute -bottom-6 right-10">
              Invalid credentials
            </span>
          )}
        </form>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold tracking-tight mb-6"
          >
            Choose your workspace power
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Flexible plans designed for teams of every size. Scale your organization with confidence on our high-performance infrastructure.
          </motion.p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pb-32 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative p-8 rounded-xl border bg-surface transition-all duration-300 flex flex-col ${
                  plan.isPopular 
                    ? 'border-primary ring-1 ring-primary shadow-xl scale-105 z-10' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ring-4 ring-bg">
                    Most Popular
                  </span>
                )}
                
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-text-main">${plan.price}</span>
                    <span className="text-text-muted font-medium">/mo</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-text-muted">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectPlan(plan)}
                  id={`cta-${plan.id}`}
                  className={`w-full py-4 rounded-lg font-bold tracking-tight transition-all text-sm ${
                    plan.isPopular
                      ? 'bg-primary text-white hover:bg-opacity-90 shadow-lg shadow-primary/20'
                      : 'border border-border text-text-main hover:border-primary bg-transparent text-text-muted hover:text-primary'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Social Proof/Banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 p-8 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-6"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">✨</div>
            <div>
              <div className="font-bold text-sm text-text-main">Enterprise coming soon</div>
              <div className="text-xs text-text-muted">Need custom features or higher limits? Contact our sales team for a custom quote.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Rail */}
      <footer className="h-16 border-t border-border flex items-center px-10 bg-surface overflow-hidden">
        <div className="flex gap-16 text-[10px] uppercase tracking-[0.3em] font-black text-slate-300 whitespace-nowrap animate-infinite-scroll">
          <span>Nexus Subscription System</span>
          <span>Global Access</span>
          <span>Secure Payments</span>
          <span>Enterprise Ready</span>
          <span>24/7 Support</span>
          <span>Nexus Subscription System</span>
          <span>Global Access</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes infiniteScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infiniteScroll 40s linear infinite;
          width: max-content;
        }
      `}} />
    </div>
  );
}
