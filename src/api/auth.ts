import { api } from './client';

export interface LoginResponse {
  success: boolean;
  token: string;
  role: 'admin' | 'doctor' | 'patient';
  user: Record<string, unknown>;
}

export interface RegisterPatientInput {
  name: string; email: string; password: string;
  phone?: string; age?: number; gender?: string; address?: string;
}

export interface RegisterDoctorInput {
  name: string; email: string; password: string; reg_no: string;
  specialty?: string; qualifications?: string; phone?: string;
  address?: string; bio?: string;
}

export const authApi = {
  login: (email: string, password: string, role: string) =>
    api.post<LoginResponse>('/auth/login', { email, password, role }),

  registerPatient: (data: RegisterPatientInput) =>
    api.post<LoginResponse>('/auth/register/patient', data),

  registerDoctor: (data: RegisterDoctorInput) =>
    api.post<LoginResponse>('/auth/register/doctor', data),

  me: () => api.get<{ success: boolean; role: string; user: Record<string, unknown> }>('/auth/me'),
};
