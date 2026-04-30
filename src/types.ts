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

export interface Transaction {
  id: string;
  date: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  invoiceUrl: string;
}

export interface SubscriptionRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  planName: string;
  amount: number;
  purchaseDate: number;
  expiryDate: number;
  status: 'Active' | 'Expired' | 'Cancelled';
  paymentHistory: Transaction[];
}

export interface Executive {
  id: string;
  name: string;
  email: string;
  phone: string;
  loginId: string;
  password: string;
  hasAiAccess: boolean;
  status: 'Active' | 'Inactive';
  lastActive?: number;
  addedAt: number;
}

export type AppStep = 'landing' | 'onboarding' | 'payment' | 'portal';
