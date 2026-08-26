import { api } from './client';

export interface PrescriptionMedicine {
  id: number;
  medicine_id: number;
  name: string;
  name_bn: string;
  potency: string;
  dosage: string;
  duration: string;
  notes: string;
}

export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null;
  diagnosis: string;
  notes: string;
  status: 'active' | 'completed';
  is_verified: boolean;
  created_at: string;
  patient_name: string;
  doctor_name: string;
  specialty: string;
  medicines: PrescriptionMedicine[];
}

export interface CreatePrescriptionInput {
  patient_id: number;
  appointment_id?: number;
  diagnosis: string;
  notes?: string;
  medicines: Array<{
    medicine_id: number;
    potency?: string;
    dosage?: string;
    duration?: string;
    notes?: string;
  }>;
}

export const prescriptionsApi = {
  list: (params?: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.page)   q.set('page', String(params.page));
    const qs = q.toString();
    return api.get<{ success: boolean; total: number; data: Prescription[] }>(
      `/prescriptions${qs ? '?' + qs : ''}`
    );
  },

  get: (id: number) =>
    api.get<{ success: boolean; data: Prescription }>(`/prescriptions/${id}`),

  create: (data: CreatePrescriptionInput) =>
    api.post<{ success: boolean; data: Prescription }>('/prescriptions', data),

  updateStatus: (id: number, status: 'active' | 'completed') =>
    api.patch(`/prescriptions/${id}/status`, { status }),
};
