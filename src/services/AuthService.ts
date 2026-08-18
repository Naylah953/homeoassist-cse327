// types/auth.ts
import { DoctorRegisterInput, PatientRegisterInput } from '../types';

export class AuthService {
  private static instance: AuthService;
  private currentUser: any = null;

  // Private constructor prevents direct instantiation with 'new'
  private constructor() {}

  // Global Access Point
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Helper to simulate backend delay
  private async delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- REGISTRATION METHODS ---
  public async registerDoctor(data: DoctorRegisterInput) {
    // API call to send data for admin review
    await this.delay();
    const existing = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
    existing.push(data);
    localStorage.setItem('mock_doctors', JSON.stringify(existing));
    
    console.log('✅ Doctor registered in Mock DB:', data);
    return { success: true, message: 'Submitted for admin review' };
  }

  public async registerPatient(data: PatientRegisterInput) {
    await this.delay();
    const existing = JSON.parse(localStorage.getItem('mock_patients') || '[]');
    existing.push(data);
    localStorage.setItem('mock_patients', JSON.stringify(existing));
    
    console.log('✅ Patient registered in Mock DB:', data);
    return { success: true, message: 'Patient account created' };
  }

  // --- LOGIN METHODS ---
  public async loginDoctor(identifier: string, pass: string) {
    await this.delay();
    const doctors = JSON.parse(localStorage.getItem('mock_doctors') || '[]');
    const found = doctors.find((d: any) => (d.email === identifier || d.phone === identifier) && d.password === pass);

    if (!found) throw new Error('Invalid email/phone or password');
    this.currentUser = { ...found, role: 'doctor' };
    return this.currentUser;
  }

  public async loginPatient(identifier: string, pass: string) {
    await this.delay();
    const patients = JSON.parse(localStorage.getItem('mock_patients') || '[]');
    const found = patients.find((p: any) => p.phone === identifier && p.password === pass);

    if (!found) throw new Error('Invalid phone or password');
    this.currentUser = { ...found, role: 'patient' };
    return this.currentUser;
  }

  public async loginAdmin(identifier: string, pass: string) {
    await this.delay();
    // Hardcoded default admin credentials for testing
    if (identifier === 'admin@homeo.com' && pass === 'admin123') {
        this.currentUser = { email: identifier, role: 'admin' };
        return this.currentUser;
    }
    throw new Error('Invalid admin credentials');
    }

  public getCurrentUser() {
    return this.currentUser;
  }
}