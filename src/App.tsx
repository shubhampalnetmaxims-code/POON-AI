/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppStep, PricingPlan, OrganizationDetails, RolePlayScenario, UploadedPDF } from './types.ts';
import LandingPage from './components/LandingPage.tsx';
import PaymentStep from './components/PaymentStep.tsx';
import OnboardingStep from './components/OnboardingStep.tsx';
import PortalStep from './components/PortalStep.tsx';
import { SUBSCRIPTION_PLANS, ROLE_PLAY_SCENARIOS } from './constants.ts';

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [orgDetails, setOrgDetails] = useState<OrganizationDetails | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('nexus_custom_plans');
    return saved ? JSON.parse(saved) : SUBSCRIPTION_PLANS;
  });

  const [scenarios, setScenarios] = useState<RolePlayScenario[]>(() => {
    const saved = localStorage.getItem('nexus_custom_scenarios');
    return saved ? JSON.parse(saved) : ROLE_PLAY_SCENARIOS;
  });

  const [pdfs, setPdfs] = useState<UploadedPDF[]>(() => {
    const saved = localStorage.getItem('nexus_uploaded_pdfs');
    return saved ? JSON.parse(saved) : [];
  });

  const handleUpdatePlans = (newPlans: PricingPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('nexus_custom_plans', JSON.stringify(newPlans));
  };

  const handleUpdateScenarios = (newScenarios: RolePlayScenario[]) => {
    setScenarios(newScenarios);
    localStorage.setItem('nexus_custom_scenarios', JSON.stringify(newScenarios));
  };

  const handleUpdatePdfs = (newPdfs: UploadedPDF[]) => {
    setPdfs(newPdfs);
    localStorage.setItem('nexus_uploaded_pdfs', JSON.stringify(newPdfs));
  };

  const handleLogin = (email: string, pass: string) => {
    if (email === 'admin@gmail.com' && pass === 'Admin@123') {
      const adminOrg: OrganizationDetails = {
        name: 'Nexus Admin',
        email: 'admin@gmail.com',
        billingAddress: 'Internal System',
        employeeCount: 'N/A',
        isAdmin: true
      };
      setOrgDetails(adminOrg);
      setSelectedPlan(plans[0]);
      setStep('portal');
      return true;
    }
    if (email === 'shubham@gmail.com' && pass === 'Abcd@123') {
      const defaultOrg: OrganizationDetails = {
        name: 'Shubham Org',
        email: 'shubham@gmail.com',
        billingAddress: '123 Tech Lane, Silicon Valley',
        employeeCount: '10-50'
      };
      setOrgDetails(defaultOrg);
      setSelectedPlan(plans[1] || plans[0]);
      setStep('portal');
      return true;
    }
    return false;
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setStep('onboarding');
  };

  const handleOnboardingComplete = (details: OrganizationDetails) => {
    setOrgDetails(details);
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    setStep('portal');
  };

  const handleLogout = () => {
    setStep('landing');
    setSelectedPlan(null);
    setOrgDetails(null);
  };

  return (
    <div className="bg-white min-h-screen">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <LandingPage 
            key="landing" 
            plans={plans}
            onSelectPlan={handleSelectPlan} 
            onLogin={handleLogin}
          />
        )}
        
        {step === 'payment' && selectedPlan && (
          <PaymentStep 
            key="payment"
            plan={selectedPlan}
            onBack={() => setStep('onboarding')}
            onSuccess={handlePaymentSuccess}
          />
        )}
        
        {step === 'onboarding' && (
          <OnboardingStep 
            key="onboarding"
            plans={plans}
            onBack={() => setStep('landing')}
            onComplete={handleOnboardingComplete}
          />
        )}

        {step === 'portal' && orgDetails && selectedPlan && (
          <PortalStep 
            key="portal"
            org={orgDetails}
            plan={selectedPlan}
            plans={plans}
            scenarios={scenarios}
            pdfs={pdfs}
            onUpdatePlans={handleUpdatePlans}
            onUpdateScenarios={handleUpdateScenarios}
            onUpdatePdfs={handleUpdatePdfs}
            onLogout={handleLogout}
            onUpdateOrg={(details) => setOrgDetails(details)}
            onUpdatePlan={(plan) => setSelectedPlan(plan)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
