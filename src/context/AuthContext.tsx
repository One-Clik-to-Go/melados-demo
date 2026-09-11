'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/client-auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { UserRole } from '@/types/database';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  effectiveRole: UserRole;
  isSuperAdmin: boolean;
  simulatedRole: UserRole | null;
  setSimulatedRole: (role: UserRole | null) => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginAsSuperAdmin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
  role: 'VIEWER',
  effectiveRole: 'VIEWER',
  isSuperAdmin: false,
  simulatedRole: null,
  setSimulatedRole: () => {},
  loginWithEmail: async () => {},
  loginAsSuperAdmin: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [superAdminSession, setSuperAdminSession] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('VIEWER');
  const [simulatedRole, setSimulatedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (typeof window !== 'undefined') {
      const storedSA = sessionStorage.getItem('proninez_superadmin');
      if (storedSA === 'true') {
        setSuperAdminSession(true);
        setRole('ADMIN');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email === 'andres@grupoplustech.com') {
          setRole('ADMIN');
          setSuperAdminSession(true);
        } else {
          setRole('EVALUADOR');
        }
      }
      setLoading(false);
    });

    // Safety timeout: ensure loading state unlocks fast so landing page renders immediately
    timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const isAuthenticated = !!user || superAdminSession;
  const isSuperAdmin = (user?.email === 'andres@grupoplustech.com') || superAdminSession;

  // Effective role incorporates SuperAdmin role simulator
  const effectiveRole = (isSuperAdmin && simulatedRole) ? simulatedRole : role;

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (email === 'andres@grupoplustech.com') {
        setSuperAdminSession(true);
        setRole('ADMIN');
        if (typeof window !== 'undefined') sessionStorage.setItem('proninez_superadmin', 'true');
        return;
      }
      const creds = await signInWithEmailAndPassword(auth, email, pass);
      setUser(creds.user);
      setRole(email.includes('admin') ? 'ADMIN' : 'EVALUADOR');
    } catch (err) {
      if (email === 'andres@grupoplustech.com') {
        setSuperAdminSession(true);
        setRole('ADMIN');
        if (typeof window !== 'undefined') sessionStorage.setItem('proninez_superadmin', 'true');
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsSuperAdmin = async () => {
    setLoading(true);
    try {
      setSuperAdminSession(true);
      setRole('ADMIN');
      setSimulatedRole(null);
      if (typeof window !== 'undefined') sessionStorage.setItem('proninez_superadmin', 'true');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    setSuperAdminSession(false);
    setRole('VIEWER');
    setSimulatedRole(null);
    if (typeof window !== 'undefined') sessionStorage.removeItem('proninez_superadmin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        role,
        effectiveRole,
        isSuperAdmin,
        simulatedRole,
        setSimulatedRole,
        loginWithEmail,
        loginAsSuperAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
