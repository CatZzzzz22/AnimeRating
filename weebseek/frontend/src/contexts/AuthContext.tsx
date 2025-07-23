import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../helpers';

interface User {
  user_id: number;
  username: string;
}

interface RegisterDetails {
  uname: string;
  gender: string;
  age: number;
  location: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string, details: RegisterDetails) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        setUser(null);
      } else {
        const body = await res.json();
        setUser(body.cookie ? { user_id: body.user_id, username: body.username } : null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const body = await apiFetch<{ user_id: number; username: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );
    setUser({ user_id: body.user_id, username: body.username });
  };

  const register = async (
    username: string,
    password: string,
    { uname, gender, age, location }: RegisterDetails
  ) => {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        uname,
        gender,
        age,
        location,
      }),
    });
    await login(username, password);
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
