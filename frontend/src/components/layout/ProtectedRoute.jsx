import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../ui/LoadingScreen.jsx';

export default function ProtectedRoute() {
  const { status, isAuthenticated } = useAuth();
  const location = useLocation();

  if (status === 'idle' || status === 'loading') {
    return <LoadingScreen label="Verifying your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
