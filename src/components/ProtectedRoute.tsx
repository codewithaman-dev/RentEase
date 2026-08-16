import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        Authenticating session...
      </div>
    );
  }

  // If not logged in, send to standard login page with callback URL
  if (!user) {
    return <Navigate to={`/login?callbackUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check Role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = (role || 'customer').toLowerCase() as UserRole;
    if (!allowedRoles.includes(currentRole)) {
      if (currentRole === 'admin') return <Navigate to="/admin" replace />;
      if (currentRole === 'vendor') return <Navigate to="/vendor" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
