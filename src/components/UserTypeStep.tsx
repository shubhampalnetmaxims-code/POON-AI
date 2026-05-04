/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { User, Building2, ArrowLeft, ArrowRight } from 'lucide-react';

interface UserTypeStepProps {
  onSelect: (type: 'individual' | 'organization') => void;
  onBack: () => void;
}

export default function UserTypeStep({ onSelect, onBack }: UserTypeStepProps) {
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
            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">02</span>
            <span className="text-primary font-bold">Account Type</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center font-bold">03</span>
            <span>Registration</span>
          </div>
        </div>
        <div className="w-24"></div>
      </header>

      <main className="flex-grow flex items-center justify-center p-12">
        <div className="max-w-4xl w-full">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-12 text-xs uppercase tracking-widest font-bold w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
          </button>

          <div className="text-center mb-16">
            <h1 className="text-5xl font-black tracking-tighter mb-4 text-text-main italic uppercase">Choose Your Path</h1>
            <p className="text-text-muted font-bold max-w-lg mx-auto">Select the environment that best fits your leadership journey.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TypeCard 
              icon={<User className="w-8 h-8" />}
              title="Individual"
              description="Personal leadership growth. Access all AI features for yourself with seamless personal billing."
              onClick={() => onSelect('individual')}
            />
            <TypeCard 
              icon={<Building2 className="w-8 h-8" />}
              title="Organization"
              description="Enterprise-grade deployment. Manage multiple executives, team simulations, and corporate billing."
              onClick={() => onSelect('organization')}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function TypeCard({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-surface border-4 border-black p-10 rounded-2xl cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col text-left group"
    >
      <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black transition-colors">
        {icon}
      </div>
      <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic italic">{title}</h3>
      <p className="text-text-muted font-bold text-sm leading-relaxed mb-10 flex-grow">
        {description}
      </p>
      <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
        Select Path <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}
