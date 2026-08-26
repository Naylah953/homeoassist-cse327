import { api } from './client';

export interface EmergencyCall {
  id: number;
  patient_id: number | null;
  patient_name: string;
  patient_phone: string;
  symptoms: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_doctor: number | null;
  doctor_name?: string;
  status: 'waiting' | 'routing' | 'connected' | 'resolved' | 'missed';
  notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export const emergencyApi = {
  create: (data: { patient_name?: string; patient_phone?: string; symptoms?: string; priority?: string }) =>
    api.post<{ success: boolean; data: EmergencyCall }>('/emergency', data),

  list: (params?: { status?: string }) => {
    const q = params?.status ? `?status=${params.status}` : '';
    return api.get<{ success: boolean; data: EmergencyCall[] }>(`/emergency${q}`);
  },

  active: () =>
    api.get<{ success: boolean; data: EmergencyCall[] }>('/emergency/active'),

  assign: (id: number, doctor_id?: number) =>
    api.patch(`/emergency/${id}/assign`, { doctor_id }),

  resolve: (id: number, notes?: string) =>
    api.patch(`/emergency/${id}/resolve`, { notes }),
};
