// Export your view types
export type AView = 'dashboard' | 'doctors' | 'patients' | 'complaints' | 'revenue' | 'settings'
export type DView = 'dashboard' | 'chat' | 'medicines' | 'patients' | 'prescriptions' | 'emergency' | 'profile'
export type PView = 'dashboard' | 'chat' | 'doctors' | 'appointments' | 'records' | 'emergency' | 'profile'
// types/auth.ts
export type DoctorRegisterInput = {
  fullName: string;
  regId: string;
  email: string;
  phone: string;
  chamberAddress: string;
  password: string; 
};

export type PatientRegisterInput = {
  fullName: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  password: string; 
};