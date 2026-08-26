// types/auth.ts
import { authApi, LoginResponse, RegisterDoctorInput, RegisterPatientInput,} from '../api/auth';

export class AuthService {
  private static instance: AuthService;

  // Private constructor prevents direct instantiation
  private constructor() {}

  // Singleton access point
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  // =========================
  // LOGIN
  // =========================

  public async login(
    email: string,
    password: string,
    role: 'doctor' | 'patient' | 'admin'
  ): Promise<LoginResponse> {
    return await authApi.login(email, password, role);
  }

  // =========================
  // REGISTRATION
  // =========================

  public async registerPatient(
    data: RegisterPatientInput
  ): Promise<LoginResponse> {
    return await authApi.registerPatient(data);
  }

  public async registerDoctor(
    data: RegisterDoctorInput
  ): Promise<LoginResponse> {
    return await authApi.registerDoctor(data);
  }

  // =========================
  // CURRENT USER
  // =========================

  public async getCurrentUser() {
    return await authApi.me();
  }
}

// Testing Singleton behavior

export default AuthService;

// --- Singleton Verification Test ---
const authService1 = AuthService.getInstance();
const authService2 = AuthService.getInstance();
console.log('Singleton check:', authService1 === authService2);