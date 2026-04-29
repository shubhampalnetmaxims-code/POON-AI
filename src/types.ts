/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
  maxEmployees?: number;
  pricePerEmployee?: number;
}

export interface OrganizationDetails {
  name: string;
  email: string;
  billingAddress: string;
  employeeCount: string;
  isAdmin?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  initialMessage: string;
  category: 'Conflict' | 'Strategy' | 'Ethics' | 'Crisis' | 'Negotiation';
  pdfSource?: string; // Name of the PDF it was created from
}

export interface UploadedPDF {
  id: string;
  name: string;
  timestamp: number;
  extractedContext?: string;
}

export type AppStep = 'landing' | 'onboarding' | 'payment' | 'portal';
