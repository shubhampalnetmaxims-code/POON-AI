/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PricingPlan, RolePlayScenario, SubscriptionRecord } from './types.ts';

export const SUBSCRIPTION_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    interval: 'month',
    description: 'Perfect for small teams just getting started.',
    features: [
      'Up to 5 employees',
      'Basic analytics',
      'Community support',
      'Limited integrations'
    ],
    cta: 'Get Started',
    maxEmployees: 5,
    pricePerEmployee: 0
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 29,
    interval: 'month',
    description: 'Advanced features for scaling organizations.',
    features: [
      'Up to 50 employees',
      'Full analytics suite',
      'Priority email support',
      'Unlimited integrations',
      'Custom branding'
    ],
    cta: 'Choose Pro',
    isPopular: true,
    maxEmployees: 50,
    pricePerEmployee: 0.58
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    description: 'Custom solutions for large-scale operations.',
    features: [
      'Up to 1000 employees',
      '24/7 Phone support',
      'Dedicated manager',
      'SLA guarantee',
      'Advanced security'
    ],
    cta: 'Contact Sales',
    maxEmployees: 1000,
    pricePerEmployee: 0.10
  }
];

export const MOCK_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'sub1',
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    planName: 'Pro Plan',
    amount: 149.00,
    purchaseDate: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
    expiryDate: Date.now() + (335 * 24 * 60 * 60 * 1000), // ~11 months from now
    status: 'Active',
    paymentHistory: [
      {
        id: 'inv-001',
        date: Date.now() - (30 * 24 * 60 * 60 * 1000),
        amount: 149.00,
        status: 'Paid',
        invoiceUrl: '#'
      }
    ]
  },
  {
    id: 'sub2',
    clientName: 'Stark Industries',
    clientEmail: 'pepper@stark.com',
    planName: 'Enterprise Plan',
    amount: 599.00,
    purchaseDate: Date.now() - (60 * 24 * 60 * 60 * 1000),
    expiryDate: Date.now() + (305 * 24 * 60 * 60 * 1000),
    status: 'Active',
    paymentHistory: [
      {
        id: 'inv-002',
        date: Date.now() - (60 * 24 * 60 * 60 * 1000),
        amount: 599.00,
        status: 'Paid',
        invoiceUrl: '#'
      },
      {
        id: 'inv-003',
        date: Date.now() - (30 * 24 * 60 * 60 * 1000),
        amount: 599.00,
        status: 'Paid',
        invoiceUrl: '#'
      }
    ]
  }
];

export const ROLE_PLAY_SCENARIOS: RolePlayScenario[] = [
  {
    id: 'perf-review',
    category: 'Conflict',
    title: 'The Defensive Top Performer',
    description: 'Provide critical feedback to your best engineer who is becoming increasingly arrogant and dismissive of peers.',
    initialMessage: "Look, I know my numbers are the highest. If the rest of the team can't keep up, that's not really my problem, is it? Why are we even having this talk?"
  },
  {
    id: 'board-pitch',
    category: 'Strategy',
    title: 'The Skeptical Board',
    description: 'You are pitching a 40% budget increase for a radical R&D project. The board is focused on short-term profits.',
    initialMessage: "We've seen the proposal. It's bold, certainly. But in this economic climate, shouldn't we be cutting costs rather than chasing moonshots?"
  },
  {
    id: 'pr-crisis',
    category: 'Crisis',
    title: 'Data Breach Response',
    description: 'A minor data breach has been leaked. You must address a panicked major client who is threatening to leave.',
    initialMessage: "I'm seeing reports about a breach. My legal team is already drafting a termination notice. How did this happen and why should I trust you with another byte of our data?"
  },
  {
    id: 'vendor-neg',
    category: 'Negotiation',
    title: 'The 30% Price Hike',
    description: 'A critical vendor is demanding a 30% increase upon renewal. You have no immediate alternative.',
    initialMessage: "Materials and labor costs are up everywhere. We either sign at the new rate by Friday, or we have to pause shipments. It's just the market reality."
  },
  {
    id: 'toxic-star',
    category: 'Ethics',
    title: 'The Brilliant Jerk',
    description: 'Your star salesperson is bringing in 40% of revenue but has multiple HR complaints for bullying.',
    initialMessage: "Look, sales are up. Everyone is just too sensitive these days. Do you want a 'nice' office or do you want to hit our quarterly targets?"
  },
  {
    id: 'layoff-talk',
    category: 'Crisis',
    title: 'Maintaining Morale',
    description: 'You just finished a 15% layoff. You must address the remaining team who feel anxious and overworked.',
    initialMessage: "We're all exhausted and we just saw our friends lose their jobs. How are we expected to do twice the work now with zero extra resources? Is another round coming?"
  },
  {
    id: 'ceo-remote',
    category: 'Strategy',
    title: 'The Traditionalist CEO',
    description: 'Persuade your CEO, who believes in \"butts in seats,\" to move to a permanent hybrid model.',
    initialMessage: "If I can't see people working, how do I know they're not just doing house chores on company time? Culture is built in the office, period."
  },
  {
    id: 'whistleblower',
    category: 'Ethics',
    title: 'The Ethical Dilemma',
    description: 'An anonymous report claims a VP is taking kickbacks from a supplier. The VP is your personal friend.',
    initialMessage: "Hey, I heard some rumors about an investigation. You know me, I've been with this company since the start. You're not actually taking those anonymous tips seriously, are you?"
  },
  {
    id: 'founder-exit',
    category: 'Crisis',
    title: 'Sudden Departure',
    description: 'Your popular Co-founder has suddenly resigned. The company is in shock. Lead the Emergency All-Hands.',
    initialMessage: "People are saying the company is in trouble if Sarah is leaving. We need the truth—was she pushed out? Should we start looking for new jobs?"
  },
  {
    id: 'viral-meltdown',
    category: 'Crisis',
    title: 'The Viral Complaint',
    description: 'A client\'s public complaint about a product failure is trending. It\'s gaining traction with major media.',
    initialMessage: "The CNN reporter is on line one, and the tweet has 50k retweets. Do we admit fault or do we stick to the 'engineering error' line?"
  },
  {
    id: 'earnings-dip',
    category: 'Strategy',
    title: 'The Investors Call',
    description: 'Quarterly earnings missed expectations by 15%. Explain the roadmap to recovery.',
    initialMessage: "The stock is down 8% pre-market. You promised growth, but these numbers show stagnation. Why should we keep our capital in your hands?"
  },
  {
    id: 'new-exec-friction',
    category: 'Conflict',
    title: 'Onboarding Resistance',
    description: 'You hired an outside COO, and your existing VPs are actively ignoring their directives.',
    initialMessage: "We've been doing fine for five years. Why do we need this 'outsider' tells us how to run our departments? We're the ones who built this."
  },
  {
    id: 'acquisition-offer',
    category: 'Negotiation',
    title: 'The Merger Offer',
    description: 'A major competitor offers to buy you out, but they plan to dissolve your product line.',
    initialMessage: "Our offer is generous—30% above your current valuation. But we want your patents, not your legacy. Take the exit and let the product go."
  },
  {
    id: 'stalled-launch',
    category: 'Strategy',
    title: 'The Failed Milestone',
    description: 'A product launch you led has completely stalled. The team is unmotivated and blaming each other.',
    initialMessage: "We worked for a year and it flopped. Management messed up the marketing, and Engineering gave us a buggy build. Why should we even try on the V2?"
  },
  {
    id: 'budget-war',
    category: 'Conflict',
    title: 'The Budget Showdown',
    description: 'Two VPs are arguing over a remaining $500k budget. Both have valid, competing projects.',
    initialMessage: "If Marketing doesn't get that budget, the whole Q4 pipeline dies. Sales already has enough resources. This isn't a discussion, it's a necessity."
  }
];
