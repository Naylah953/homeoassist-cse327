import { api } from './client';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  type: 'online' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  fee: number;
  is_paid: boolean;
  notes: string;
  patient_name: string;
  doctor_name: string;
  specialty: string;
}

export interface BookAppointmentInput {
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  type?: 'online' | 'in-person';
  notes?: string;
}

export const appointmentsApi = {
  list: (params?: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page)   q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<{ success: boolean; total: number; data: Appointment[] }>(
      `/appointments${qs ? '?' + qs : ''}`
    );
  },

  get: (id: number) =>
    api.get<{ success: boolean; data: Appointment }>(`/appointments/${id}`),

  book: (data: BookAppointmentInput) =>
    api.post<{ success: boolean; data: Appointment }>('/appointments', data),

  updateStatus: (id: number, status: string) =>
    api.patch(`/appointments/${id}/status`, { status }),

  markPaid: (id: number) =>
    api.patch(`/appointments/${id}/pay`, {}),
};
