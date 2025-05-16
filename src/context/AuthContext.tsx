'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, getCurrentUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for userId in localStorage to restore session
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      loadUser(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);
  
  const loadUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser(userId);
      if (userData) {
        setUser(userData as AuthUser);
        localStorage.setItem('userId', userData.id);
      } else {
        // Invalid or expired user ID
        localStorage.removeItem('userId');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('userId');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (userId: string) => {
    localStorage.setItem('userId', userId);
    await loadUser(userId);
    return true;
  };
  
  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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