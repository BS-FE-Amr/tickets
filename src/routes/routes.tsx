import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from '../utils/protected-route';
import Navbar from '../components/navbar';
import DashboardPage from '../pages/dashboard-page';
import UsersPage from '../pages/users-page';
import LoginPage from '../pages/login-page';
import NotFound from '../pages/not-found';
import UsersProvider from '../providers/users-provider';
import TanstackQueryProvider from '../providers/tanstack-query-provider';

const AppRoutes = () => {
  return (
    <TanstackQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Navbar />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/dashboard/users"
                element={
                  <UsersProvider>
                    <UsersPage />
                  </UsersProvider>
                }
              />
            </Route>
          </Route>
          <Route element={<ProtectedRoute isAnonymousRequired={true} />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TanstackQueryProvider>
  );
};

export default AppRoutes;

