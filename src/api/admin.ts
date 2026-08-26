import { api } from './client';

export interface AdminStats {
  doctors: number;
  patients: number;
  medicines: number;
  appointments: {
    total: string; upcoming: string; completed: string; cancelled: string;
  };
  revenue: { total: string; collected: string };
  complaints: { total: string; open: string };
  recent_appointments: Array<{
    id: number; appointment_date: string; appointment_time: string;
    status: string; patient_name: string; doctor_name: string;
  }>;
}

export interface RevenueMonth {
  month: string;
  appointments: string;
  total_revenue: string;
  collected: string;
}

export const adminApi = {
  stats: () =>
    api.get<{ success: boolean; data: AdminStats }>('/admin/stats'),

  revenue: () =>
    api.get<{ success: boolean; data: RevenueMonth[] }>('/admin/revenue'),

  doctors: (params?: { verified?: boolean; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.verified !== undefined) q.set('verified', String(params.verified));
    if (params?.page) q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<{ success: boolean; total: number; data: unknown[] }>(
      `/admin/doctors${qs ? '?' + qs : ''}`
    );
  },

  getProfile: () =>
    api.get<{ success: boolean; data: unknown }>('/admin/profile'),

  updateProfile: (data: { username?: string; email?: string }) =>
    api.patch('/admin/profile', data),
};
