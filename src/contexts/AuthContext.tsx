import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getData, getCurrentUser, setCurrentUser, type User } from '@/lib/demoData';

interface AuthCtx { user: User | null; loading: boolean; login: (email: string, pin: string) => boolean; logout: () => void; isAdmin: boolean; isGerente: boolean; }
const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setUser(getCurrentUser()); setLoading(false); }, []);

  function login(email: string, pin: string): boolean {
    const data = getData();
    const found = data.users.find((u: User) => u.email === email && u.pin === pin && u.active);
    if (found) { setCurrentUser(found); setUser(found); return true; }
    return false;
  }
  function logout() { setCurrentUser(null); setUser(null); }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role==='admin', isGerente: user?.role==='admin'||user?.role==='gerente' }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('No auth'); return ctx; }
