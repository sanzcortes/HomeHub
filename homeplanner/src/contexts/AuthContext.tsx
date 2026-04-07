import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

interface User {
  id: string;
  username: string;
  name: string;
  household_id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (username: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch {
      localStorage.removeItem('auth_token');
    }
    setLoading(false);
  };

  const signUp = async (username: string, password: string, name: string) => {
    try {
      const response = await api.post('/auth/register', { username, password, name });
      const { token, user: userData } = response.data;
      localStorage.setItem('auth_token', token);
      setUser(userData);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.error || 'Error al registrar') };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('auth_token', token);
      setUser(userData);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.error || 'Error al iniciar sesión') };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { api };