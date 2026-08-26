import { api } from './client';

export interface Plan {
  name: string;
  price: number;
  features: string[];
}

export interface Subscription {
  id: number;
  patient_id: number;
  plan: 'basic' | 'pro' | 'clinic';
  price: number;
  status: 'active' | 'expired' | 'cancelled';
  started_at: string;
  expires_at: string;
  payment_ref: string | null;
  gateway: string | null;
}

export const subscriptionsApi = {
  plans: () =>
    api.get<{ success: boolean; data: Plan[] }>('/subscriptions/plans'),

  mySubscription: () =>
    api.get<{ success: boolean; data: Subscription | null }>('/subscriptions/me'),

  subscribe: (data: { plan: string; payment_ref?: string; gateway?: string }) =>
    api.post<{ success: boolean; data: Subscription }>('/subscriptions', data),

  cancel: (id: number) =>
    api.patch(`/subscriptions/${id}/cancel`, {}),
};
