/**
 * context/AuthContext.tsx
 * Global auth state — token, user, role stored in localStorage
 */
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'home' | 'doctor' | 'patient' | 'admin';

interface AuthUser {
  id: number;
  name?: string;
  username?: string;
  email: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  role: UserRole;
  user: AuthUser | null;
  token: string | null;
  login: (token: string, role: UserRole, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  role: 'home', user: null, token: null,
  login: () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole]   = useState<UserRole>(() => (localStorage.getItem('role') as UserRole) || 'home');
  const [user, setUser]   = useState<AuthUser | null>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback((newToken: string, newRole: UserRole, newUser: AuthUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role',  newRole);
    localStorage.setItem('user',  JSON.stringify(newUser));
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setRole('home');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
