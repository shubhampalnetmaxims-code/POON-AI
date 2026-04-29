/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Mail, MapPin, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { OrganizationDetails, PricingPlan } from '../types.ts';

interface OnboardingStepProps {
  plans: PricingPlan[];
  onComplete: (details: OrganizationDetails) => void;
  onBack: () => void;
}

export default function OnboardingStep({ plans, onComplete, onBack }: OnboardingStepProps & { key?: string }) {
  const [formData, setFormData] = useState<OrganizationDetails>({
    name: '',
    email: '',
    billingAddress: '',
    employeeCount: '1-10'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-10 shrink-0">
        <div className="font-extrabold text-xl text-primary tracking-tighter">NEXUS.IO</div>
        <div className="flex gap-6 text-sm font-medium text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold font-black">✓</span>
            <span className="text-primary font-medium">Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">02</span>
            <span className="text-primary font-bold">Organization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] flex items-center justify-center font-bold">03</span>
            <span>Payment</span>
          </div>
        </div>
        <div className="w-24"></div>
      </header>

      <main className="flex-grow flex items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl w-full grid md:grid-cols-2 bg-surface rounded-2xl overflow-hidden shadow-xl border border-border"
        >
          {/* Left Visual side */}
          <div className="bg-indigo-50 p-12 flex flex-col justify-center">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-8 text-xs uppercase tracking-widest font-bold w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Plan
            </button>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Set up your workspace</h2>
            <p className="text-text-muted leading-relaxed mb-8">Establish your organization's identity and billing details to get started with your new plan.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-text-main font-semibold">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px]">✨</div>
                Custom branded environment
              </div>
              <div className="flex items-center gap-3 text-sm text-text-main font-semibold">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px]">🔒</div>
                Identity management & SSO
              </div>
            </div>
          </div>

          {/* Right Form side */}
          <div className="p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Organization Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    placeholder="e.g. Acme Industries"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Admin Email</label>
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="admin@nexus.io"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Billing Address</label>
                  <textarea 
                    required
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Street Address, City, Zip"
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Employees</label>
                  <select 
                    required
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                  >
                    <option value="1-10">1 - 10 employees</option>
                    <option value="11-50">11 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>
              </div>

              <button
                id="onboarding-next"
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-lg font-bold tracking-tight text-sm mt-4 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                Launch Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
