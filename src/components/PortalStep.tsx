/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CircleUser, 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ArrowUpRight,
  Plus,
  Bot,
  History,
  Save,
  Key,
  Dices,
  ShieldCheck,
  Trash2,
  Edit2,
  Upload,
  FileText,
  Library,
  Sparkles,
  Loader2,
  Users,
  Receipt,
  Download,
  Calendar,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { OrganizationDetails, PricingPlan, RolePlayScenario, UploadedPDF, SubscriptionRecord, Transaction, Executive } from '../types.ts';
import AiCoachChat from './AiCoachChat.tsx';
import RolePlayView from './RolePlayView.tsx';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type PortalView = 'dashboard' | 'subscription' | 'organization' | 'settings' | 'coaching' | 'roleplay' | 'admin' | 'scenarios' | 'subscriptions-admin' | 'executives' | 'clients';

interface PortalStepProps {
  org: OrganizationDetails;
  plan: PricingPlan;
  plans: PricingPlan[];
  scenarios: RolePlayScenario[];
  pdfs: UploadedPDF[];
  subscriptions: SubscriptionRecord[];
  executives: Executive[];
  currentExecutive: Executive | null;
  onUpdatePlans: (plans: PricingPlan[]) => void;
  onUpdateScenarios: (scenarios: RolePlayScenario[]) => void;
  onUpdatePdfs: (pdfs: UploadedPDF[]) => void;
  onUpdateExecutives: (executives: Executive[]) => void;
  onLogout: () => void;
  onUpdateOrg: (details: OrganizationDetails) => void;
  onUpdatePlan: (plan: PricingPlan) => void;
}

export default function PortalStep({ 
  org, 
  plan, 
  plans, 
  scenarios,
  pdfs,
  subscriptions,
  executives,
  currentExecutive,
  onUpdatePlans, 
  onUpdateScenarios,
  onUpdatePdfs,
  onUpdateExecutives,
  onLogout, 
  onUpdateOrg, 
  onUpdatePlan 
}: PortalStepProps & { key?: string }) {
  const [activeView, setActiveView] = React.useState<PortalView>(
    org.isAdmin ? 'admin' : (currentExecutive ? 'dashboard' : 'dashboard')
  );

  const isExecutive = !!currentExecutive;
  const isIndividual = org.name === 'Personal Account';

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            org={org} 
            plan={plan} 
            executives={executives} 
            pdfs={pdfs}
            scenarios={scenarios}
            currentExecutive={currentExecutive} 
            onCoachingClick={() => setActiveView('coaching')} 
            onScenariosClick={() => setActiveView('scenarios')}
          />
        );
      case 'subscription':
        return <SubscriptionView plans={plans} currentPlan={plan} onUpdatePlan={onUpdatePlan} />;
      case 'organization':
        return <OrganizationView org={org} onUpdateOrg={onUpdateOrg} />;
      case 'settings':
        return <SettingsView />;
      case 'coaching':
        return <AiCoachChat inline disabled={isExecutive && !currentExecutive?.hasAiAccess} />;
      case 'roleplay':
        return <RolePlayView scenarios={scenarios} pdfs={pdfs} disabled={isExecutive && !currentExecutive?.hasAiAccess} />;
      case 'admin':
        return <AdminView plans={plans} onUpdatePlans={onUpdatePlans} />;
      case 'scenarios':
        return (
          <ScenarioManagementView 
            scenarios={scenarios} 
            pdfs={pdfs} 
            onUpdateScenarios={onUpdateScenarios} 
            onUpdatePdfs={onUpdatePdfs} 
          />
        );
      case 'subscriptions-admin':
        return <SubscriptionManagementView subscriptions={subscriptions} />;
      case 'executives':
        return (
          <ExecutiveManagementView 
            executives={executives} 
            onUpdateExecutives={onUpdateExecutives} 
            maxExecutives={plan.maxEmployees || 0}
          />
        );
      case 'clients':
        return <ClientsView />;
      default:
        return (
          <DashboardView 
            org={org} 
            plan={plan} 
            executives={executives} 
            pdfs={pdfs}
            scenarios={scenarios}
            currentExecutive={currentExecutive} 
            onCoachingClick={() => setActiveView('coaching')} 
            onScenariosClick={() => setActiveView('scenarios')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col p-6 fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md shadow-primary/20">
            N
          </div>
          <span className="font-extrabold tracking-tighter text-lg text-text-main">NEXUS.IO</span>
        </div>

        <nav className="space-y-1.5 flex-grow">
          {org.isAdmin ? (
            <>
              <NavItem 
                icon={<LayoutDashboard />} 
                label="Summary" 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
              />
              <NavItem 
                icon={<ShieldCheck />} 
                label="Subscription Plans" 
                active={activeView === 'admin'} 
                onClick={() => setActiveView('admin')}
              />
              <NavItem 
                icon={<Users />} 
                label="Clients" 
                active={activeView === 'clients'} 
                onClick={() => setActiveView('clients')}
              />
              <NavItem 
                icon={<Sparkles />} 
                label="AI Scenario Manager" 
                active={activeView === 'scenarios'} 
                onClick={() => setActiveView('scenarios')}
              />
              <NavItem 
                icon={<Receipt />} 
                label="Subscription Mgmt" 
                active={activeView === 'subscriptions-admin'} 
                onClick={() => setActiveView('subscriptions-admin')}
              />
            </>
          ) : isExecutive ? (
            <>
              <NavItem 
                icon={<LayoutDashboard />} 
                label="Dashboard" 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
              />
              <NavItem 
                icon={<Bot />} 
                label="AI Coaching" 
                active={activeView === 'coaching'} 
                onClick={() => setActiveView('coaching')}
              />
              <NavItem 
                icon={<Dices />} 
                label="Role Plays" 
                active={activeView === 'roleplay'} 
                onClick={() => setActiveView('roleplay')}
              />
              <NavItem 
                icon={<Settings />} 
                label="Settings" 
                active={activeView === 'settings'} 
                onClick={() => setActiveView('settings')}
              />
            </>
          ) : isIndividual ? (
            <>
              <NavItem 
                icon={<LayoutDashboard />} 
                label="Dashboard" 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
              />
              <NavItem 
                icon={<Bot />} 
                label="AI Coaching" 
                active={activeView === 'coaching'} 
                onClick={() => setActiveView('coaching')}
              />
              <NavItem 
                icon={<Dices />} 
                label="Role Plays" 
                active={activeView === 'roleplay'} 
                onClick={() => setActiveView('roleplay')}
              />
              <NavItem 
                icon={<Receipt />} 
                label="Subscription" 
                active={activeView === 'subscription'} 
                onClick={() => setActiveView('subscription')}
              />
              <NavItem 
                icon={<Settings />} 
                label="Settings" 
                active={activeView === 'settings'} 
                onClick={() => setActiveView('settings')}
              />
            </>
          ) : (
            <>
              <NavItem 
                icon={<LayoutDashboard />} 
                label="Dashboard" 
                active={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')}
              />
              <NavItem 
                icon={<Bot />} 
                label="AI Coaching" 
                active={activeView === 'coaching'} 
                onClick={() => setActiveView('coaching')}
              />
              <NavItem 
                icon={<Dices />} 
                label="Role Plays" 
                active={activeView === 'roleplay'} 
                onClick={() => setActiveView('roleplay')}
              />
              <NavItem 
                icon={<Users />} 
                label="Executives" 
                active={activeView === 'executives'} 
                onClick={() => setActiveView('executives')}
              />
              <NavItem 
                icon={<CreditCard />} 
                label="Subscription" 
                active={activeView === 'subscription'} 
                onClick={() => setActiveView('subscription')}
              />
              <NavItem 
                icon={<CircleUser />} 
                label="Organization" 
                active={activeView === 'organization'} 
                onClick={() => setActiveView('organization')}
              />
              <NavItem 
                icon={<Settings />} 
                label="Settings" 
                active={activeView === 'settings'} 
                onClick={() => setActiveView('settings')}
              />
            </>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs uppercase tracking-widest group"
          >
            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-red-100/50 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`ml-64 flex-grow ${['coaching', 'roleplay', 'admin', 'scenarios', 'subscriptions-admin', 'executives'].includes(activeView) ? 'p-0' : 'px-12 py-10'}`}>
        {!['coaching', 'roleplay', 'admin', 'scenarios', 'subscriptions-admin', 'executives'].includes(activeView) && (
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-text-main">
                {activeView === 'dashboard' ? `Welcome, ${org.name}` : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h1>
              <p className="text-text-muted text-xs font-semibold mt-1 uppercase tracking-widest">
                {activeView === 'dashboard' ? 'Workspace Overview' : `Manage your ${activeView}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search resources..."
                  className="pl-10 pr-4 py-2 bg-white border border-border rounded-lg text-xs focus:outline-none focus:border-primary transition-all w-64"
                />
              </div>
              <button className="p-2 bg-white border border-border rounded-lg text-text-muted hover:text-primary transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border-2 border-white"></span>
              </button>
              <div className="w-9 h-9 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-primary/20">
                {org.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </header>
        )}

        {renderContent()}
      </main>
    </div>
  );
}

function DashboardView({ 
  org, 
  plan, 
  executives, 
  pdfs = [], 
  scenarios = [], 
  currentExecutive, 
  onCoachingClick,
  onScenariosClick
}: { 
  org: OrganizationDetails, 
  plan: PricingPlan, 
  executives: Executive[], 
  pdfs: UploadedPDF[],
  scenarios: RolePlayScenario[],
  currentExecutive: Executive | null, 
  onCoachingClick: () => void,
  onScenariosClick: () => void
}) {
  const isExecutive = !!currentExecutive;
  const isIndividual = org.name === 'Personal Account';
  const hasAiAccess = currentExecutive ? currentExecutive.hasAiAccess : true;

  return (
    <div className="space-y-12">
      {/* Feature Options Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div 
          whileHover={hasAiAccess ? { y: -4 } : {}}
          onClick={hasAiAccess ? onCoachingClick : undefined}
          className={`p-8 rounded-2xl shadow-xl relative group overflow-hidden ${hasAiAccess ? 'bg-primary text-white cursor-pointer shadow-primary/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
        >
          {hasAiAccess && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${hasAiAccess ? 'bg-white/10' : 'bg-gray-300'}`}>
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black mb-3 tracking-tight">24/7 AI Executive Coach</h2>
          <p className={`${hasAiAccess ? 'text-white/70' : 'text-gray-400'} text-sm leading-relaxed mb-8 max-w-sm`}>
            {hasAiAccess 
              ? 'Connect instantly with a professional certified executive coach for strategic guidance and leadership support.'
              : 'AI Coaching features are restricted for your account. Please contact your HR administrator for access.'}
          </p>
          {hasAiAccess && (
            <button className="px-6 py-3 bg-white text-primary rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center gap-2">
              Start Coaching Session
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-border group overflow-hidden"
        >
          <div className="w-12 h-12 bg-indigo-50 text-primary rounded-xl flex items-center justify-center mb-6">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black mb-3 tracking-tight text-text-main">Strategic Growth Engine</h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-sm">
            Analyze organizational performance and unlock data-driven insights for executive decision making.
          </p>
          <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-primary/10 flex items-center gap-2">
            Launch Analysis
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      {!isExecutive && !isIndividual && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            label="Active Plan" 
            value={plan.name} 
            trend="Current" 
            sub={`Billed $${plan.price}/month`}
          />
          <StatCard 
            label="Executive Fleet" 
            value={`${executives.length}/${plan.maxEmployees || '∞'}`} 
            trend={`${((executives.length / (plan.maxEmployees || 1)) * 100).toFixed(0)}%`} 
            sub="Fleet capacity used"
          />
          <StatCard 
            label="AI Resources" 
            value={executives.filter(e => e.hasAiAccess).length.toString()} 
            trend="Active" 
            sub="AI enabled accounts"
          />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl p-8 border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
              <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">
                {isExecutive ? 'My Profile' : isIndividual ? 'Personal Profile' : 'Organization Profile'}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <InfoItem label={isExecutive ? "Full Name" : isIndividual ? "Email Account" : "Admin Email"} value={isExecutive ? currentExecutive?.name : org.email} />
              <InfoItem label={isExecutive ? "Login ID" : isIndividual ? "Account ID" : "Billing Address"} value={isExecutive ? currentExecutive?.loginId : isIndividual ? `#${org.email.split('@')[0]}` : org.billingAddress} />
              {!isExecutive && !isIndividual && <InfoItem label="Member Cap" value={plan.maxEmployees ? `${plan.maxEmployees} members` : 'Unlimited'} />}
              <InfoItem label="Infrastructure" value="AWS (Northern Virginia)" />
              {isExecutive && <InfoItem label="Support Tier" value="24/7 Concierge" />}
              {isIndividual && <InfoItem label="Neural Nodes" value="Dedicated v100 Cluster" />}
            </div>
          </div>

          {!isExecutive && (
            <div className="bg-surface rounded-xl p-8 border border-border shadow-sm">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">PDF Knowledge Base</h3>
                <button 
                  onClick={() => onScenariosClick()}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  View Library
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pdfs.slice(0, 2).map((pdf) => (
                  <div key={pdf.id} className="p-4 bg-gray-50 rounded-xl border border-border flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg text-primary shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="font-black text-[10px] uppercase truncate">{pdf.name}</div>
                      <div className="text-[9px] font-bold text-text-muted mt-0.5">
                        {scenarios.filter(s => s.pdfSource === pdf.name).length} Generated Scenarios
                      </div>
                    </div>
                  </div>
                ))}
                {pdfs.length === 0 && (
                  <div className="col-span-full py-8 text-center border-2 border-dashed border-border rounded-xl">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">No documents uploaded yet</p>
                    <button 
                      onClick={() => onScenariosClick()}
                      className="text-[10px] font-black text-primary uppercase tracking-widest mt-2 block mx-auto"
                    >
                      Initialize Archive
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-surface p-8 rounded-xl border border-border">
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted mb-6">Service Health</h3>
            <div className="space-y-4">
              <HealthItem label="API Node" status="Healthy" />
              <HealthItem label="Database" status="Healthy" />
              <HealthItem label="Storage Cluster" status="Healthy" />
            </div>
          </div>
          
          {!isExecutive && (
            <div className="bg-primary text-white rounded-xl p-8 shadow-xl shadow-primary/10 flex flex-col">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-8 opacity-80">Quick Actions</h3>
              <div className="space-y-3 flex-grow">
                <ActionButton icon={<Plus className="w-4 h-4" />} label="Invite Member" />
                <ActionButton icon={<Settings className="w-4 h-4" />} label="Workspace Settings" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubscriptionView({ plans, currentPlan, onUpdatePlan }: { plans: PricingPlan[], currentPlan: PricingPlan, onUpdatePlan: (plan: PricingPlan) => void }) {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="space-y-10">
      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
          <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">Subscription Management</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowHistory(false)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!showHistory ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
            >
              Plans
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${showHistory ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
            >
              History
            </button>
          </div>
        </div>

        {!showHistory ? (
          <div>
            <div className="mb-8 p-4 bg-indigo-50 border border-primary/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Your Active Selection</p>
                <p className="text-sm font-bold text-text-main">{currentPlan.name} — ${currentPlan.price}/month</p>
              </div>
              <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full">Pro Status</div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`p-6 rounded-xl border transition-all ${
                    currentPlan.id === plan.id 
                      ? 'border-primary bg-indigo-50/50 ring-1 ring-primary shadow-xl shadow-primary/5' 
                      : 'border-border bg-white hover:border-text-muted'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-xs uppercase tracking-widest text-text-main italic">{plan.name}</h4>
                    {currentPlan.id === plan.id && (
                      <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded font-black tracking-tighter">SELECTED</span>
                    )}
                  </div>
                  <div className="text-3xl font-black mb-4 tracking-tighter">${plan.price}<span className="text-sm font-medium text-text-muted">/mo</span></div>
                  
                  <div className="space-y-2 mb-8">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-text-muted uppercase">
                        <div className="w-1 h-1 bg-primary rounded-full" /> {f}
                      </div>
                    ))}
                  </div>

                  <button 
                    disabled={currentPlan.id === plan.id}
                    onClick={() => onUpdatePlan(plan)}
                    className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      currentPlan.id === plan.id 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-primary shadow-lg hover:shadow-primary/20'
                    }`}
                  >
                    {currentPlan.id === plan.id ? 'Active Plan' : (plan.price > currentPlan.price ? 'Upgrade' : 'Downgrade')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 px-4 text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
              <div>Invoice</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            <PaymentRow date="Nov 12, 2023" amount={currentPlan.price} status="Paid" invoice="#INV-8821" />
            <PaymentRow date="Oct 12, 2023" amount={currentPlan.price} status="Paid" invoice="#INV-8710" />
            <PaymentRow date="Sep 12, 2023" amount={currentPlan.price} status="Paid" invoice="#INV-8605" />
            <PaymentRow date="Aug 12, 2023" amount={currentPlan.price} status="Paid" invoice="#INV-8501" />
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted">Billing Identity</h3>
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Default Method</p>
            <div className="flex items-center gap-4 bg-gray-50 border border-border rounded-xl p-4">
              <div className="w-10 h-7 bg-black rounded flex items-center justify-center text-white font-black text-[10px] italic">VISA</div>
              <div>
                <p className="text-xs font-black italic">•••• •••• •••• 4242</p>
                <p className="text-[9px] font-bold text-text-muted uppercase">Expires 12/28</p>
              </div>
              <button className="ml-auto text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Edit</button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Next Invoice</p>
            <div className="flex items-center gap-4 bg-gray-50 border border-border rounded-xl p-4">
              <div className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black italic">Dec 12, 2023</p>
                <p className="text-[9px] font-bold text-text-muted uppercase">Amount: ${currentPlan.price}.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizationView({ org, onUpdateOrg }: { org: OrganizationDetails, onUpdateOrg: (details: OrganizationDetails) => void }) {
  const [formData, setFormData] = React.useState(org);

  return (
    <div className="max-w-2xl bg-surface border border-border rounded-xl p-8 shadow-sm">
      <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted mb-8 pb-4 border-b border-border">Update Profile</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        onUpdateOrg(formData);
      }} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Org Name</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Admin Email</label>
            <input 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Billing Address</label>
          <textarea 
            value={formData.billingAddress}
            onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
            className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm focus:border-primary focus:outline-none h-24 resize-none"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-opacity-90">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </form>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="max-w-xl space-y-8">
      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-widest text-text-muted mb-8 pb-4 border-b border-border">Security</h3>
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Change Password
            </h4>
            <div className="grid gap-4">
              <input type="password" placeholder="Current Password" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm focus:border-primary focus:outline-none" />
              <input type="password" placeholder="New Password" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm focus:border-primary focus:outline-none" />
              <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm focus:border-primary focus:outline-none" />
            </div>
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-opacity-90">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminView({ plans, onUpdatePlans }: { plans: PricingPlan[], onUpdatePlans: (plans: PricingPlan[]) => void }) {
  const [editingPlan, setEditingPlan] = React.useState<PricingPlan | null>(null);
  const [newPlan, setNewPlan] = React.useState<Partial<PricingPlan>>({
    name: '',
    price: 0,
    interval: 'month',
    description: '',
    features: [''],
    cta: 'Select Plan',
    maxEmployees: 0,
    pricePerEmployee: 0
  });

  const handleAddFeature = () => {
    setNewPlan(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...(newPlan.features || [])];
    updatedFeatures[index] = value;
    setNewPlan(prev => ({ ...prev, features: updatedFeatures }));
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = (newPlan.features || []).filter((_, i) => i !== index);
    setNewPlan(prev => ({ ...prev, features: updatedFeatures }));
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate employee feature if it doesn't exist
    let finalFeatures = [...(newPlan.features || [])];
    const employeeFeature = `Up to ${newPlan.maxEmployees} employees`;
    
    // Remove any existing employee feature to avoid duplicates
    finalFeatures = finalFeatures.filter(f => !f.toLowerCase().includes('employees'));
    if (newPlan.maxEmployees && newPlan.maxEmployees > 0) {
      finalFeatures.unshift(employeeFeature);
    }

    const planToSave = {
      ...newPlan,
      id: newPlan.id || Date.now().toString(),
      price: (newPlan.pricePerEmployee || 0) * (newPlan.maxEmployees || 0),
      features: finalFeatures.filter(f => f.trim() !== '')
    } as PricingPlan;

    if (editingPlan) {
      onUpdatePlans(plans.map(p => p.id === editingPlan.id ? planToSave : p));
    } else {
      onUpdatePlans([...plans, planToSave]);
    }
    
    setEditingPlan(null);
    setNewPlan({
      name: '',
      price: 0,
      interval: 'month',
      description: '',
      features: [''],
      cta: 'Select Plan',
      maxEmployees: 0,
      pricePerEmployee: 0
    });
  };

  const startEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setNewPlan(plan);
  };

  const handleDelete = (id: string) => {
    onUpdatePlans(plans.filter(p => p.id !== id));
  };

  const calculatedPrice = (newPlan.pricePerEmployee || 0) * (newPlan.maxEmployees || 0);

  return (
    <div className="h-full flex flex-col bg-gray-50/30 font-sans">
      <div className="p-12 max-w-7xl mx-auto w-full flex-grow overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-text-main mb-4 italic uppercase">System Administration</h2>
            <p className="text-text-muted font-bold text-xs uppercase tracking-widest">Global Subscription Registry & Resource Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Plan Editor */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-xl p-8 shadow-xl sticky top-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8 pb-4 border-b border-border flex items-center gap-2">
                {editingPlan ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                {editingPlan ? 'Edit Pricing tier' : 'Create New Tier'}
              </h3>
              
              <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Tier Name</label>
                    <input 
                      required
                      value={newPlan.name}
                      onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                      placeholder="e.g. Master, Ultra, Custom"
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none transition-all font-bold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Max Employees</label>
                      <input 
                        required
                        type="number"
                        value={newPlan.maxEmployees}
                        onChange={e => setNewPlan({...newPlan, maxEmployees: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Price per Employee ($)</label>
                      <input 
                        required
                        type="number"
                        value={newPlan.pricePerEmployee}
                        onChange={e => setNewPlan({...newPlan, pricePerEmployee: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Monthly Price</span>
                      <span className="text-xl font-black text-primary">${calculatedPrice}</span>
                    </div>
                    <p className="text-[9px] text-text-muted font-bold mt-1 uppercase tracking-tighter">Auto-calculated: {newPlan.maxEmployees} users × ${newPlan.pricePerEmployee}/user</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Highlight</label>
                    <div className="flex items-center gap-3 h-[46px]">
                      <input 
                        type="checkbox"
                        checked={newPlan.isPopular}
                        onChange={e => setNewPlan({...newPlan, isPopular: e.target.checked})}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mark Popular</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1 mb-2 block">Short Description</label>
                    <textarea 
                      required
                      value={newPlan.description}
                      onChange={e => setNewPlan({...newPlan, description: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Additional Features</label>
                    <button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      + Add Feature
                    </button>
                  </div>
                  {newPlan.features?.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        required
                        value={feature}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Feature ${idx + 1}`}
                        className="flex-grow px-4 py-2 bg-gray-50 border border-border rounded-lg text-xs focus:border-primary focus:outline-none font-medium"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-2 text-text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-grow py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:shadow-xl shadow-primary/20 transition-all"
                  >
                    {editingPlan ? 'Save Changes' : 'Launch Tier'}
                  </button>
                  {editingPlan && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingPlan(null);
                        setNewPlan({ name: '', price: 0, interval: 'month', description: '', features: [''], cta: 'Select Plan', maxEmployees: 0, pricePerEmployee: 0 });
                      }}
                      className="px-6 border border-border rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Active Registry */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted px-4">Active Subscription Registry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((p) => (
                <div key={p.id} className="bg-white border border-border rounded-xl p-8 shadow-sm group hover:border-primary transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-black tracking-tight">{p.name}</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-lg font-black text-primary">${p.price}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">per month</p>
                      </div>
                      {p.pricePerEmployee && p.maxEmployees && (
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest bg-gray-50 px-2 py-1 rounded inline-block mt-2">
                          ${p.pricePerEmployee}/user • {p.maxEmployees} Users Limit
                        </p>
                      )}
                    </div>
                    {p.isPopular && (
                      <span className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">POPULAR</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mb-6 leading-relaxed font-medium">{p.description}</p>
                  
                  <div className="space-y-2 mb-8 border-t border-gray-50 pt-6">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-text-main">
                        <div className="w-1 h-1 bg-primary rounded-full"></div>
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => startEdit(p)}
                      className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionManagementView({ subscriptions }: { subscriptions: SubscriptionRecord[] }) {
  const [selectedClient, setSelectedClient] = React.useState<SubscriptionRecord | null>(null);

  const totalRevenue = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;

  return (
    <div className="h-full flex flex-col bg-gray-50/30 font-sans">
      <div className="p-12 max-w-7xl mx-auto w-full flex-grow overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-text-main mb-4 italic uppercase">Client Subscriptions</h2>
            <p className="text-text-muted font-bold text-xs uppercase tracking-widest">Global Revenue & Entitlement Registry</p>
          </div>
          <button 
            className="px-6 py-3 bg-primary text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:shadow-xl shadow-primary/20 transition-all flex items-center gap-2"
            onClick={() => alert('Bulk download feature would trigger here in production')}
          >
            <Download className="w-4 h-4" />
            Bulk Export Invoices
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Annual Revenue" value={`$${(totalRevenue * 12).toLocaleString()}`} trend="+12.4%" sub="Projected ARR" />
          <StatCard label="Active Subscriptions" value={activeSubscriptions.toString()} trend="+3" sub="Current paying clients" />
          <StatCard label="Monthly Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="+5.2%" sub="Current MRR" />
          <StatCard label="Avg Ticket Size" value={`$${(totalRevenue / subscriptions.length).toFixed(0)}`} trend="Stable" sub="Per organization" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Client List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted px-4">Active Clients</h3>
            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Client / Plan</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Validity</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscriptions.map((sub) => (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedClient?.id === sub.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedClient(sub)}
                    >
                      <td className="px-6 py-5">
                        <div className="font-black text-sm">{sub.clientName}</div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">{sub.planName}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          sub.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-sm text-primary">${sub.amount}</div>
                        <div className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">per month</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[10px] font-bold text-text-main">Expires: {new Date(sub.expiryDate).toLocaleDateString()}</div>
                        <div className="text-[9px] font-medium text-text-muted">Purchased: {new Date(sub.purchaseDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-5">
                        <button className="p-2 text-text-muted hover:text-primary transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedClient ? (
                <motion.div 
                  key={selectedClient.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-border rounded-2xl p-8 shadow-xl sticky top-8"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-lg">
                      {selectedClient.clientName.substring(0,1)}
                    </div>
                    <button 
                      onClick={() => setSelectedClient(null)}
                      className="text-text-muted hover:text-text-main transition-colors"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight mb-1">{selectedClient.clientName}</h3>
                  <p className="text-xs text-text-muted font-bold mb-8 uppercase tracking-widest">{selectedClient.clientEmail}</p>

                  <div className="space-y-6 mb-10">
                    <div className="p-4 bg-gray-50 rounded-xl border border-border">
                      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Subscription Details</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-sm font-black">{selectedClient.planName}</div>
                          <div className="text-[10px] font-medium text-text-muted">Monthly billing cycling</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-primary">${selectedClient.amount}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4 block">Payment History</h4>
                      <div className="space-y-3">
                        {selectedClient.paymentHistory.map((inv) => (
                          <div key={inv.id} className="flex justify-between items-center p-3 bg-white border border-border rounded-lg group hover:border-primary transition-all">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 rounded-lg text-text-muted group-hover:text-primary transition-colors">
                                <Receipt className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[10px] font-black">{inv.id}</div>
                                <div className="text-[9px] font-medium text-text-muted">{new Date(inv.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-[10px] font-black">${inv.amount}</div>
                                <div className="text-[8px] font-bold text-green-500 uppercase">{inv.status}</div>
                              </div>
                              <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-md transition-all">
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg shadow-primary/10 transition-all">
                    Generate Consolidated Statement
                  </button>
                </motion.div>
              ) : (
                <div className="h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-white/50">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">Select a Client</h4>
                  <p className="text-[10px] font-medium text-text-muted leading-relaxed">
                    Choose a subscription record from the list to view detailed payment history and manage invoices.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioManagementView({ 
  scenarios, 
  pdfs, 
  onUpdateScenarios, 
  onUpdatePdfs 
}: { 
  scenarios: RolePlayScenario[], 
  pdfs: UploadedPDF[], 
  onUpdateScenarios: (s: RolePlayScenario[]) => void, 
  onUpdatePdfs: (p: UploadedPDF[]) => void 
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [numScenarios, setNumScenarios] = React.useState(3);
  const [activeTab, setActiveTab] = React.useState<'generator' | 'library'>('generator');
  const [pdfToDeleteId, setPdfToDeleteId] = React.useState<string | null>(null);
  const [showLibraryGenModal, setShowLibraryGenModal] = React.useState(false);
  const [libraryGenPdf, setLibraryGenPdf] = React.useState<UploadedPDF | null>(null);
  const [libraryGenNum, setLibraryGenNum] = React.useState(3);
  const [uploadMode, setUploadMode] = React.useState<'full' | 'context-only'>('full');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const generateFromLibrary = async (pdf: UploadedPDF, count: number) => {
    setIsUploading(true);
    setShowLibraryGenModal(false);
    try {
      const prompt = `Based on the context of a document titled "${pdf.name}" with the following organizational context:
      ${pdf.extractedContext}

      Generate exactly ${count} NEW leadership roleplay scenarios that are distinct from standard scenarios. Each scenario must follow this JSON structure:
      {
        "title": "Short catchy title",
        "category": "Conflict" | "Strategy" | "Ethics" | "Crisis" | "Negotiation",
        "description": "2-3 sentence context",
        "initialMessage": "The first thing the antagonist says to the user"
      }
      
      Return your response in this format:
      [JSON_START]
      <The JSON array here>
      [JSON_END]`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\[JSON_START\]([\s\S]*?)\[JSON_END\]/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : '[]';
      
      try {
        const generated = JSON.parse(jsonStr) as Partial<RolePlayScenario>[];
        const completeScenarios = generated.map((s, idx) => ({
          ...s,
          id: `gen-${pdf.id}-${Date.now()}-${idx}`,
          pdfSource: pdf.name,
          category: s.category || 'Strategy'
        })) as RolePlayScenario[];

        onUpdateScenarios([...scenarios, ...completeScenarios]);
        setActiveTab('generator');
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    } catch (error) {
      console.error("Generation Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const newPdfs: UploadedPDF[] = [];
    const allNewScenarios: RolePlayScenario[] = [];

    try {
      for (const file of files) {
        const prompt = uploadMode === 'full' 
          ? `Based on the context of a document titled "${file.name}":
            1. Generate a detailed "Organizational Context Summary" (approx 300 words) that describes the specific policies, rules, and behavioral expectations this document likely contains (simulate that you have read it).
            2. Generate exactly ${numScenarios} leadership roleplay scenarios. Each scenario must follow this JSON structure:
            {
              "title": "Short catchy title",
              "category": "Conflict" | "Strategy" | "Ethics" | "Crisis" | "Negotiation",
              "description": "2-3 sentence context",
              "initialMessage": "The first thing the antagonist says to the user"
            }
            
            Return your response in this format:
            [CONTEXT_START]
            <The detailed summary here>
            [CONTEXT_END]
            [JSON_START]
            <The JSON array here>
            [JSON_END]`
          : `Based on the context of a document titled "${file.name}", generate a detailed "Organizational Context Summary" (approx 300 words) that describes the specific policies, rules, and behavioral expectations this document likely contains (simulate that you have read it).
            
            Return your response in this format:
            [CONTEXT_START]
            <The detailed summary here>
            [CONTEXT_END]`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const text = response.text || '';
        
        // Extract Context
        const contextMatch = text.match(/\[CONTEXT_START\]([\s\S]*?)\[CONTEXT_END\]/);
        const extractedContext = contextMatch ? contextMatch[1].trim() : 'No context available.';

        // Extract JSON (only if in full mode)
        let jsonStr = '[]';
        if (uploadMode === 'full') {
          const jsonMatch = text.match(/\[JSON_START\]([\s\S]*?)\[JSON_END\]/);
          jsonStr = jsonMatch ? jsonMatch[1].trim() : '[]';
        }
        
        // Create PDF record
        const pdfId = `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newPdf: UploadedPDF = {
          id: pdfId,
          name: file.name,
          timestamp: Date.now(),
          extractedContext
        };
        
        newPdfs.push(newPdf);

        if (uploadMode === 'full') {
          try {
            const generated = JSON.parse(jsonStr) as Partial<RolePlayScenario>[];
            const completeScenarios = generated.map((s, idx) => ({
              ...s,
              id: `gen-${pdfId}-${idx}`,
              pdfSource: file.name,
              category: s.category || 'Strategy'
            })) as RolePlayScenario[];

            allNewScenarios.push(...completeScenarios);
          } catch (e) {
            console.error("JSON Parse Error for file:", file.name, e);
          }
        }
      }

      onUpdatePdfs([...pdfs, ...newPdfs]);
      if (allNewScenarios.length > 0) {
        onUpdateScenarios([...scenarios, ...allNewScenarios]);
        setActiveTab('generator');
      } else {
        setActiveTab('library');
      }
    } catch (error) {
      console.error("Upload/Generation Error:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteScenario = (id: string) => {
    onUpdateScenarios(scenarios.filter(s => s.id !== id));
  };

  const deletePdf = (id: string) => {
    setPdfToDeleteId(id);
  };

  const executeDeletePdf = () => {
    if (!pdfToDeleteId) return;
    const pdfToDelete = pdfs.find(p => p.id === pdfToDeleteId);
    if (pdfToDelete) {
      // Remove the PDF
      onUpdatePdfs(pdfs.filter(p => p.id !== pdfToDeleteId));
      // Cascading delete: Remove all scenarios associated with this PDF
      onUpdateScenarios(scenarios.filter(s => s.pdfSource !== pdfToDelete.name));
    }
    setPdfToDeleteId(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/30 font-sans">
      <div className="p-12 max-w-7xl mx-auto w-full flex-grow overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-text-main mb-4 italic uppercase">AI Scenario Manager</h2>
            <p className="text-text-muted font-bold text-xs uppercase tracking-widest">Generate, Deploy & Audit Leadership Simulations</p>
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'generator' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
            >
              Generator
            </button>
            <button 
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
            >
              PDF Library
            </button>
          </div>
        </div>

        <input 
        type="file" 
        accept=".pdf" 
        multiple
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />

      {activeTab === 'generator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Upload Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-border rounded-xl p-8 shadow-xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Context Upload
                </h3>
                <p className="text-xs text-text-muted mb-8 leading-relaxed font-medium">
                  Upload organizational policies, meeting transcripts, or case studies to generate hyper-realistic training scenarios.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Generation Density</label>
                    <select 
                      value={numScenarios}
                      onChange={(e) => setNumScenarios(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-sm font-bold focus:outline-none focus:border-primary"
                    >
                      <option value={1}>1 Scenario</option>
                      <option value={3}>3 Scenarios</option>
                      <option value={5}>5 Scenarios</option>
                      <option value={10}>10 Scenarios</option>
                    </select>
                  </div>
                  
                  <button 
                    disabled={isUploading}
                    onClick={() => {
                      setUploadMode('full');
                      setTimeout(() => fileInputRef.current?.click(), 0);
                    }}
                    className={`w-full py-6 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Simulating PDF Extraction...</span>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Select PDF Document</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-indigo-900 text-white rounded-2xl shadow-xl shadow-indigo-200">
                <Sparkles className="w-6 h-6 mb-4 text-indigo-300" />
                <h4 className="font-black text-sm uppercase tracking-widest mb-2">Neural Generation</h4>
                <p className="text-[10px] text-white/70 leading-relaxed font-medium">
                  We use Gemini generative models to distill raw PDF data into strategic behavioral simulations.
                </p>
              </div>
            </div>

            {/* Scenarios List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Generated Scenarios ({scenarios.filter(s => s.pdfSource).length})</h3>
              </div>
              
              <div className="space-y-4">
                {scenarios.filter(s => s.pdfSource).map((s) => (
                  <div key={s.id} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:border-primary transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {s.category}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest bg-gray-100 text-text-muted px-2 py-0.5 rounded flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" />
                            {s.pdfSource}
                          </span>
                        </div>
                        <h4 className="text-lg font-black tracking-tight">{s.title}</h4>
                      </div>
                      <button 
                        onClick={() => deleteScenario(s.id)}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-text-muted mb-4 font-medium italic leading-relaxed">"{s.description}"</p>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[8px] font-bold uppercase text-text-muted mb-1 block tracking-widest">Initial Prompt</span>
                      <p className="text-[10px] text-text-main font-bold line-clamp-1">{s.initialMessage}</p>
                    </div>
                  </div>
                ))}
                
                {scenarios.filter(s => s.pdfSource).length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-white/50">
                    <Library className="w-8 h-8 text-gray-300 mb-4" />
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No generated scenarios yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">PDF Document Archive</h3>
              <button 
                onClick={() => {
                  setUploadMode('context-only');
                  setTimeout(() => fileInputRef.current?.click(), 10);
                }}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                Upload New Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((p) => (
                <div key={p.id} className="bg-white border border-border rounded-xl p-8 shadow-sm group hover:border-primary transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-gray-50 rounded-2xl text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <FileText className="w-8 h-8" />
                    </div>
                    <button 
                      onClick={() => deletePdf(p.id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <h4 className="text-xl font-black tracking-tight mb-2 truncate" title={p.name}>{p.name}</h4>
                  <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest mb-6">
                    <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                    <span>{scenarios.filter(s => s.pdfSource === p.name).length} Scenarios</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setLibraryGenPdf(p);
                      setShowLibraryGenModal(true);
                    }}
                    className="w-full py-3 bg-primary/5 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    Create More Scenarios
                  </button>
                </div>
              ))}
              
              {pdfs.length === 0 && (
                <div className="col-span-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-white/50">
                  <FileText className="w-12 h-12 text-gray-200 mb-6" />
                  <p className="text-sm font-black text-text-muted uppercase tracking-widest">The archive is empty</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {pdfToDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-center mb-3 font-sans">Delete PDF Document?</h3>
              <p className="text-sm text-text-muted text-center mb-8 leading-relaxed font-medium font-sans">
                Are you sure you want to delete <span className="text-text-main font-bold">"{pdfs.find(p => p.id === pdfToDeleteId)?.name}"</span>? 
                This will permanently remove all related scenarios from both the admin and user portals.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setPdfToDeleteId(null)}
                  className="flex-1 py-3 border border-border rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDeletePdf}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-200 font-sans"
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Library Generation Modal */}
      <AnimatePresence>
        {showLibraryGenModal && libraryGenPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-center mb-3 font-sans">Generate More Scenarios</h3>
              <p className="text-sm text-text-muted text-center mb-8 leading-relaxed font-medium font-sans">
                Using context from <span className="text-text-main font-bold">"{libraryGenPdf.name}"</span>
              </p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block font-sans">Number of New Scenarios</label>
                  <select 
                    value={libraryGenNum}
                    onChange={(e) => setLibraryGenNum(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-lg text-sm font-bold focus:outline-none focus:border-primary font-sans"
                  >
                    <option value={1}>1 New Scenario</option>
                    <option value={3}>3 New Scenarios</option>
                    <option value={5}>5 New Scenarios</option>
                    <option value={10}>10 New Scenarios</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLibraryGenModal(false)}
                  className="flex-1 py-3 border border-border rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all font-sans"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => generateFromLibrary(libraryGenPdf, libraryGenNum)}
                  className="flex-1 py-3 bg-primary text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-sans"
                >
                  Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExecutiveManagementView({ 
  executives, 
  onUpdateExecutives, 
  maxExecutives 
}: { 
  executives: Executive[], 
  onUpdateExecutives: (e: Executive[]) => void, 
  maxExecutives: number 
}) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    hasAiAccess: true
  });

  const remainingSlots = maxExecutives - executives.length;

  const handleAddExecutive = (e: React.FormEvent) => {
    e.preventDefault();
    if (executives.length >= maxExecutives) {
      alert("Executive limit reached for your current plan. Please upgrade to add more.");
      return;
    }

    const newExecutive: Executive = {
      id: Date.now().toString(),
      ...formData,
      loginId: formData.email.split('@')[0] + Math.floor(100 + Math.random() * 900),
      password: Math.random().toString(36).slice(-8).toUpperCase(),
      status: 'Active',
      addedAt: Date.now()
    };

    onUpdateExecutives([...executives, newExecutive]);
    setIsAdding(false);
    setFormData({ name: '', email: '', phone: '', hasAiAccess: true });
  };

  const toggleStatus = (id: string) => {
    onUpdateExecutives(executives.map(e => 
      e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e
    ));
  };

  const toggleAiAccess = (id: string) => {
    onUpdateExecutives(executives.map(e => 
      e.id === id ? { ...e, hasAiAccess: !e.hasAiAccess } : e
    ));
  };

  const deleteExecutive = (id: string) => {
    if (window.confirm("Are you sure you want to remove this executive account?")) {
      onUpdateExecutives(executives.filter(e => e.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/30 font-sans">
      <div className="p-12 max-w-7xl mx-auto w-full flex-grow overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-text-main mb-4 italic uppercase">Executive Fleet</h2>
            <p className="text-text-muted font-bold text-xs uppercase tracking-widest">Manage User Permissions & Neural Access</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Fleet Capacity</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(executives.length / maxExecutives) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black">{executives.length}/{maxExecutives}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              disabled={executives.length >= maxExecutives}
              className={`px-6 py-3 bg-primary text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center gap-2 ${executives.length >= maxExecutives ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
            >
              <Plus className="w-4 h-4" />
              Add Executive
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="space-y-6">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Registered Executives ({executives.length})</h3>
              {remainingSlots > 0 && (
                <span className="text-[10px] font-bold text-primary italic">You have {remainingSlots} slots remaining</span>
              )}
            </div>

            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Executive Identity</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Portal Credentials</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">AI Permissions</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {executives.map((exe) => (
                    <tr key={exe.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/5 text-primary rounded-full flex items-center justify-center font-black text-sm">
                            {exe.name.substring(0,1)}
                          </div>
                          <div>
                            <div className="font-black text-sm">{exe.name}</div>
                            <div className="text-[10px] font-medium text-text-muted">{exe.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">ID:</span>
                            <code className="text-[10px] font-black bg-gray-100 px-1.5 py-0.5 rounded">{exe.loginId}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Pass:</span>
                            <code className="text-[10px] font-black bg-gray-100 px-1.5 py-0.5 rounded">{exe.password}</code>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => toggleAiAccess(exe.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                            exe.hasAiAccess 
                              ? 'bg-indigo-50 border-primary/20 text-primary' 
                              : 'bg-gray-50 border-border text-text-muted'
                          }`}
                        >
                          <Bot className={`w-3.5 h-3.5 ${exe.hasAiAccess ? 'animate-pulse' : ''}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {exe.hasAiAccess ? 'AI Enabled' : 'AI Restricted'}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-5">
                         <button 
                          onClick={() => toggleStatus(exe.id)}
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                            exe.status === 'Active' 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {exe.status}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => deleteExecutive(exe.id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {executives.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <Users className="w-12 h-12 mb-4" />
                          <p className="text-sm font-black uppercase tracking-widest">No executives deployed yet</p>
                          <p className="text-xs font-bold mt-2">Scale your leadership team by adding new executives above.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Executive Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-10 max-w-lg w-full shadow-2xl border border-border"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Deploy New Executive</h3>
                <button onClick={() => setIsAdding(false)} className="text-text-muted hover:text-text-main transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddExecutive} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Full Identity Name</label>
                    <input 
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-3 border border-border rounded-xl text-sm font-bold focus:border-primary focus:outline-none transition-all hover:border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Work Email</label>
                      <input 
                        required
                        type="email"
                        placeholder="jenkins@company.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-3 border border-border rounded-xl text-sm font-bold focus:border-primary focus:outline-none transition-all hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Direct Phone</label>
                      <input 
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-5 py-3 border border-border rounded-xl text-sm font-bold focus:border-primary focus:outline-none transition-all hover:border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-indigo-50 border border-primary/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-tight text-primary">Provision AI Capability</h4>
                    <p className="text-[10px] font-medium text-text-muted mt-1">Grant 24/7 access to AI Coaching & Roleplay features.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, hasAiAccess: !formData.hasAiAccess})}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.hasAiAccess ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.hasAiAccess ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Cancel Provisioning
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl shadow-primary/30 transition-all font-sans"
                  >
                    Initialize Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all font-bold text-xs uppercase tracking-widest ${
        active 
          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
          : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
      }`}
    >
      {icon && <div className="w-4 h-4">{icon}</div>}
      {label}
    </button>
  );
}

function StatCard({ label, value, trend, sub }: { label: string, value: string, trend: string, sub: string }) {
  return (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm hover:border-primary/30 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase tracking-widest font-black text-text-muted">{label}</span>
        <span className="text-[10px] font-bold text-primary bg-indigo-50 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <div className="text-3xl font-black text-text-main mb-1 group-hover:text-primary transition-colors">{value}</div>
      <div className="text-[10px] text-text-muted font-bold uppercase tracking-tight">{sub}</div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted block">{label}</span>
      <span className="text-sm font-bold text-text-main break-words">{value}</span>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white hover:text-primary transition-all font-bold text-[10px] uppercase tracking-widest">
      <div className="w-4 h-4">{icon}</div>
      {label}
    </button>
  );
}

function HealthItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-bold text-text-main">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] uppercase font-black text-green-600">{status}</span>
      </div>
    </div>
  );
}

function ClientsView() {
  const [clients, setClients] = React.useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', type: 'Individual', plan: 'Executive Pro', status: 'active', joined: 'Oct 24, 2023' },
    { id: '2', name: 'Global Tech Corp', email: 'admin@gtc.com', type: 'Organization', plan: 'Enterprise', status: 'active', joined: 'Nov 12, 2023' },
    { id: '3', name: 'Sarah Wilson', email: 'sarah.w@freelance.io', type: 'Individual', plan: 'Executive Pro', status: 'blocked', joined: 'Dec 05, 2023' },
    { id: '4', name: 'Innovate AI', email: 'ops@innovate.ai', type: 'Organization', plan: 'Starter', status: 'active', joined: 'Jan 15, 2024' },
  ]);

  const toggleStatus = (id: string) => {
    setClients(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic italic">Client Registry</h2>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Manage global user permissions & deployment status</p>
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted border-b-2 border-border pb-1">
          <span className="text-primary">{clients.length} Total</span>
          <span>•</span>
          <span>{clients.filter(c => c.status === 'active').length} Active</span>
        </div>
      </div>

      <div className="bg-surface border-4 border-black rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-5">User / Client</th>
                <th className="px-8 py-5">Attributes</th>
                <th className="px-8 py-5">Subscription</th>
                <th className="px-8 py-5">Timeline</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${client.type === 'Organization' ? 'bg-indigo-100' : 'bg-orange-100'}`}>
                        {client.name[0]}
                      </div>
                      <div>
                        <div className="font-black text-xs uppercase tracking-tight italic">{client.name}</div>
                        <div className="text-[10px] font-bold text-text-muted">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border-2 ${client.type === 'Organization' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-orange-200 bg-orange-50 text-orange-600'}`}>
                        {client.type}
                      </span>
                      <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {client.status === 'active' ? 'AUTHORIZED' : 'REVOKED'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-[10px] uppercase tracking-widest text-text-main">{client.plan}</div>
                    <div className="text-[9px] font-bold text-text-muted mt-0.5">Recurring Monthly</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{client.joined}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => toggleStatus(client.id)}
                        className={`p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${client.status === 'active' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                        title={client.status === 'active' ? 'Block Access' : 'Allow Access'}
                      >
                        {client.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <button className="p-2 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                        <Settings className="w-4 h-4 text-text-muted" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentRow({ date, amount, status, invoice }: { date: string, amount: number, status: string, invoice: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:border-primary transition-all group">
      <div className="grid grid-cols-4 flex-grow items-center">
        <div className="flex items-center gap-3">
          <Receipt className="w-4 h-4 text-text-muted group-hover:text-primary" />
          <span className="text-xs font-black italic">{invoice}</span>
        </div>
        <div className="text-[10px] font-bold text-text-muted uppercase">{date}</div>
        <div className="text-xs font-black tracking-tighter">${amount}.00</div>
        <div>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase tracking-widest">
            {status}
          </span>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <Download className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  );
}
