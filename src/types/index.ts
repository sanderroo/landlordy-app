export interface Property {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  paymentDay: number; // Day of the month (1-31)
  paymentTime?: string; // Optional time like "09:00"
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentLinkSent: boolean;
  remindersSent: number;
  lastReminderDate?: string;
}

export interface PaymentLink {
  id: string;
  tenantId: string;
  amount: number;
  dueDate: string;
  tikkieUrl: string;
  tikkieToken: string;
  sentDate: string;
  expiryDate: string;
  status: 'active' | 'paid' | 'expired' | 'cancelled';
}

export interface TikkiePayment {
  paymentToken: string;
  tikkieId: string;
  counterPartyName: string;
  counterPartyAccountNumber: string;
  amountInCents: number;
  description: string;
  createdDateTime: string;
  status: 'OPEN' | 'CLOSED' | 'EXPIRED';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}