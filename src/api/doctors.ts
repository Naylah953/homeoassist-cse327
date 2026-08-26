import { api } from './client';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  reg_no: string;
  specialty: string;
  qualifications: string;
  bio: string;
  experience_yrs: number;
  rating: number;
  review_count: number;
  fee: number;
  phone: string;
  address: string;
  is_available: boolean;
  is_verified: boolean;
}

export const doctorsApi = {
  list: (params?: { specialty?: string; available?: boolean; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.specialty)  q.set('specialty', params.specialty);
    if (params?.available)  q.set('available', 'true');
    if (params?.search)     q.set('search', params.search);
    if (params?.page)       q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<{ success: boolean; total: number; data: Doctor[] }>(`/doctors${qs ? '?' + qs : ''}`);
  },

  get: (id: number) =>
    api.get<{ success: boolean; data: Doctor }>(`/doctors/${id}`),

  update: (id: number, data: Partial<Doctor>) =>
    api.patch<{ success: boolean; data: Doctor }>(`/doctors/${id}`, data),

  verify: (id: number, is_verified: boolean) =>
    api.patch(`/doctors/${id}/verify`, { is_verified }),

  delete: (id: number) =>
    api.delete(`/doctors/${id}`),
};
