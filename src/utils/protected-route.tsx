import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAnonymousRequired?: boolean;
}

export default function ProtectedRoute({
  isAnonymousRequired = false,
}: ProtectedRouteProps) {
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  const tokens = !!access_token && !!refresh_token;

  if (isAnonymousRequired) {
    return tokens ? <Navigate to="/dashboard" replace /> : <Outlet />;
  }

  return tokens ? <Outlet /> : <Navigate to="/login" replace />;
}

