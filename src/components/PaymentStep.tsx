/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { PricingPlan } from '../types.ts';

interface PaymentStepProps {
  plan: PricingPlan;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PaymentStep({ plan, onBack, onSuccess }: PaymentStepProps & { key?: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-10 shrink-0">
        <div className="font-extrabold text-xl text-primary tracking-tighter">NEXUS.IO</div>
        <div className="flex gap-6 text-sm font-medium text-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold font-black">✓</span>
            <span>Plans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold font-black">✓</span>
            <span>Organization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">03</span>
            <span className="text-primary font-bold">Payment</span>
          </div>
        </div>
        <div className="w-24"></div>
      </header>

      <main className="flex-grow flex">
        {/* Left Side: Order Summary */}
        <div className="flex-grow p-16 max-w-3xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-12 text-xs uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile Setup
          </button>

          <h2 className="text-3xl font-bold mb-2 tracking-tight">Order Summary</h2>
          <p className="text-text-muted text-sm mb-12">Review your selection before proceeding to secure checkout.</p>
          
          <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-center py-6 border-b border-border">
              <div>
                <p className="font-bold text-lg">{plan.name} Plan</p>
                <p className="text-sm text-text-muted">Scale organization access and tools</p>
              </div>
              <p className="text-2xl font-black text-text-main">${plan.price}<span>/mo</span></p>
            </div>
            
            <div className="py-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="font-medium text-text-main">${plan.price}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Taxes & Fees</span>
                <span className="font-medium text-text-main">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 mt-6 border-t border-border">
              <span className="text-lg font-bold">Total amount</span>
              <span className="text-3xl font-black text-primary">${plan.price}.00</span>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 text-text-muted text-[10px] uppercase tracking-widest font-bold">
            <Lock className="w-4 h-4" />
            256-bit SSL Secure Payment Processing
          </div>
        </div>

        {/* Right Side: Payment Form Panel */}
        <aside className="w-[450px] bg-surface border-l border-border p-12 flex flex-col shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-1 tracking-tight text-text-main">Payment Details</h3>
                  <p className="text-text-muted text-xs">Enter your card details to activate your subscription.</p>
                </div>

                <form onSubmit={handlePay} className="space-y-6 flex-grow">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Cardholder Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Card Number</label>
                      <div className="relative">
                        <input 
                          required
                          type="text" 
                          placeholder="•••• •••• •••• ••••"
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm pl-11"
                        />
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Expiry</label>
                        <input 
                          required
                          type="text" 
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">CVC</label>
                        <input 
                          required
                          type="text" 
                          placeholder="•••"
                          className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    id="pay-button"
                    disabled={isProcessing}
                    className="w-full py-4 bg-primary text-white rounded-lg font-bold tracking-tight text-sm mt-8 hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Complete Purchase`
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-border flex justify-center gap-4 grayscale opacity-50">
                  <span className="text-[10px] font-black tracking-tighter">VISA</span>
                  <span className="text-[10px] font-black tracking-tighter">MASTERCARD</span>
                  <span className="text-[10px] font-black tracking-tighter">AMEX</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">Payment Verified</h3>
                <p className="text-text-muted text-sm leading-relaxed">Your subscription is now active. Launching your workspace portal...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>
    </div>
  );
}
