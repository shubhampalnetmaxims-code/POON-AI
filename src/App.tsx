/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppStep, PricingPlan, OrganizationDetails, RolePlayScenario, UploadedPDF, SubscriptionRecord, Executive } from './types.ts';
import LandingPage from './components/LandingPage.tsx';
import PaymentStep from './components/PaymentStep.tsx';
import OnboardingStep from './components/OnboardingStep.tsx';
import UserTypeStep from './components/UserTypeStep.tsx';
import IndividualOnboardingStep from './components/IndividualOnboardingStep.tsx';
import PortalStep from './components/PortalStep.tsx';
import { SUBSCRIPTION_PLANS, ROLE_PLAY_SCENARIOS, MOCK_SUBSCRIPTIONS } from './constants.ts';

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [userType, setUserType] = useState<'individual' | 'organization' | null>(null);
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

  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => {
    const saved = localStorage.getItem('nexus_subscriptions');
    return saved ? JSON.parse(saved) : MOCK_SUBSCRIPTIONS;
  });

  const [executives, setExecutives] = useState<Executive[]>(() => {
    const saved = localStorage.getItem('nexus_executives');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentExecutive, setCurrentExecutive] = useState<Executive | null>(null);

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

  const handleUpdateExecutives = (newExecutives: Executive[]) => {
    setExecutives(newExecutives);
    localStorage.setItem('nexus_executives', JSON.stringify(newExecutives));
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
    if ((email === 'shubham@gmail.com' || email === 'shubhampal.netmaxims@gmail.com') && pass === 'Abcd@123') {
      const defaultOrg: OrganizationDetails = {
        name: 'Shubham Org',
        email: email,
        billingAddress: '123 Tech Lane, Silicon Valley',
        employeeCount: '10',
        isAdmin: true
      };
      setOrgDetails(defaultOrg);
      
      // Assign Pro plan but with 10 executive limit as requested
      const basePlan = plans[1] || plans[0];
      const customPlan: PricingPlan = { 
        ...basePlan, 
        maxEmployees: 10, 
        features: basePlan.features.map(f => f.toLowerCase().includes('up to') ? 'Up to 10 executives' : f) 
      };
      setSelectedPlan(customPlan);
      setCurrentExecutive(null);
      setStep('portal');
      return true;
    }

    // Check for Executive login
    const executive = executives.find(e => (e.loginId === email || e.email === email) && e.password === pass);
    if (executive) {
      if (executive.status === 'Inactive') {
        alert('Your account is currently inactive. Please contact your HR administrator.');
        return false;
      }
      
      // For executive login, we still need org info to show the right theme/name
      // In a real app we'd fetch the org this executive belongs to.
      // Here we assume they belong to the current org in state or a default branding
      const placeholderOrg: OrganizationDetails = {
        name: 'Corporate Portal',
        email: executive.email,
        billingAddress: 'Enterprise Subnet',
        employeeCount: 'N/A'
      };
      
      setOrgDetails(placeholderOrg);
      // Give them a generic plan or the one from the org
      setSelectedPlan(plans[1] || plans[0]);
      setCurrentExecutive(executive);
      setStep('portal');
      return true;
    }

    return false;
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setStep('user-type');
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
    setCurrentExecutive(null);
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

        {step === 'user-type' && (
          <UserTypeStep
            key="user-type"
            onSelect={(type) => {
              setUserType(type);
              setStep(type === 'individual' ? 'onboarding-individual' : 'onboarding');
            }}
            onBack={() => setStep('landing')}
          />
        )}
        
        {step === 'payment' && selectedPlan && (
          <PaymentStep 
            key="payment"
            plan={selectedPlan}
            onBack={() => setStep(userType === 'individual' ? 'onboarding-individual' : 'onboarding')}
            onSuccess={handlePaymentSuccess}
          />
        )}
        
        {step === 'onboarding' && (
          <OnboardingStep 
            key="onboarding"
            onBack={() => setStep('user-type')}
            onComplete={handleOnboardingComplete}
          />
        )}

        {step === 'onboarding-individual' && (
          <IndividualOnboardingStep 
            key="onboarding-individual"
            onBack={() => setStep('user-type')}
            onComplete={(email, password) => {
              // Create a skeleton org for individual
              setOrgDetails({
                name: 'Personal Account',
                email: email,
                billingAddress: 'N/A',
                employeeCount: '1'
              });
              setStep('payment');
            }}
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
            subscriptions={subscriptions}
            executives={executives}
            currentExecutive={currentExecutive}
            onUpdatePlans={handleUpdatePlans}
            onUpdateScenarios={handleUpdateScenarios}
            onUpdatePdfs={handleUpdatePdfs}
            onUpdateExecutives={handleUpdateExecutives}
            onLogout={handleLogout}
            onUpdateOrg={(details) => setOrgDetails(details)}
            onUpdatePlan={(plan) => setSelectedPlan(plan)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
