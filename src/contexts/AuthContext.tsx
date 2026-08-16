import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { apiFetch } from '../lib/api';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  role: UserRole;
  setRole: (role: UserRole) => void;
  loginAsDemoUser: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerAccount: (data: { name: string; email: string; phone?: string; password: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  customer: {
    id: 'usr_customer_001',
    email: 'customer@rentease.in',
    name: 'Rahul Sharma',
    role: 'customer',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru, Karnataka',
    kyc_status: 'Verified',
  },
  vendor: {
    id: 'usr_vendor_001',
    email: 'vendor@rentease.in',
    name: 'UrbanFurnish Logistics Vendor',
    role: 'vendor',
    phone: '+91 98110 99887',
    address: 'Warehouse 12, Hosur Road, Electronic City',
    city: 'Bengaluru, Karnataka',
    kyc_status: 'Verified',
  },
  admin: {
    id: 'usr_admin_001',
    email: 'admin@rentease.in',
    name: 'RentEase Super Admin',
    role: 'admin',
    phone: '+91 80 4123 9900',
    address: 'Embassy TechVillage, Outer Ring Road',
    city: 'Bengaluru, Karnataka',
    kyc_status: 'Verified',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  role: 'customer',
  setRole: () => {},
  loginAsDemoUser: () => {},
  loginWithCredentials: async () => ({ success: false }),
  registerAccount: async () => ({ success: false }),
  signOut: async () => {},
  updateProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('customer');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to decode base64 JWT payload safely with 24-hour clock skew tolerance
  const decodeToken = (token: string) => {
    try {
      const decoded = JSON.parse(atob(token));
      const nowInSecs = Math.floor(Date.now() / 1000);
      if (decoded && (decoded.exp + 86400) > nowInSecs) {
        return decoded;
      }
    } catch {}
    return null;
  };

  // Restore authenticated session on initial load or page refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('rentease_token');
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded) {
        const userRole = (decoded.role || 'customer').toLowerCase() as UserRole;
        setUser({
          id: decoded.id || 'usr_customer_001',
          email: decoded.email || 'customer@rentease.in',
          name: decoded.name || 'RentEase User',
          role: userRole,
          phone: decoded.phone || '+91 98765 43210',
          kyc_status: 'Verified',
        });
        setRoleState(userRole);
      } else {
        localStorage.removeItem('rentease_token');
        localStorage.removeItem('rentease_role');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  // Demo user fast login
  const loginAsDemoUser = (targetRole: UserRole) => {
    const demoUser = DEMO_USERS[targetRole];
    const tokenPayload = {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      role: targetRole.toUpperCase(),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    };
    const token = btoa(JSON.stringify(tokenPayload));
    
    localStorage.setItem('rentease_token', token);
    localStorage.setItem('rentease_role', targetRole);
    setUser(demoUser);
    setRoleState(targetRole);
  };

  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!data || data.success === false) {
        return { success: false, error: data?.error || 'Login failed' };
      }

      if (data.token) {
        localStorage.setItem('rentease_token', data.token);
      }

      const userRole = (data.user.role || 'CUSTOMER').toLowerCase() as UserRole;
      localStorage.setItem('rentease_role', userRole);

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: userRole,
        phone: data.user.phone,
        kyc_status: 'Verified',
      });
      setRoleState(userRole);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    } finally {
      setLoading(false);
    }
  };

  const registerAccount = async (formData: { name: string; email: string; phone?: string; password: string; role?: string }) => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!data || data.success === false) {
        return { success: false, error: data?.error || 'Registration failed' };
      }

      if (data.token) {
        localStorage.setItem('rentease_token', data.token);
      }

      const userRole = (data.user.role || 'CUSTOMER').toLowerCase() as UserRole;
      localStorage.setItem('rentease_role', userRole);

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: userRole,
        phone: data.user.phone,
        kyc_status: 'Verified',
      });
      setRoleState(userRole);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration error' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('rentease_token');
    localStorage.removeItem('rentease_role');
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, setRole, loginAsDemoUser, loginWithCredentials, registerAccount, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
