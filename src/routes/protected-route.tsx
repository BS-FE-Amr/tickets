import { Navigate, Outlet } from 'react-router-dom';
import type { ProtectedRouteProps } from '../types/general.types';
import useLoginData from '../hooks/use-login-data';

export default function ProtectedRoute({
  isAnonymousRequired = false,
}: ProtectedRouteProps) {
  const { token } = useLoginData();
  if (isAnonymousRequired) {
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

