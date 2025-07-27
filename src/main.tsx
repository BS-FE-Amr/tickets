import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './routes/login/login.tsx';
import ProtectedRoute from './routes/protected-route.tsx';
import NotFound from './routes/not-found.tsx';
import Dashboard from './routes/dashboard/dashboard.tsx';
import Navbar from './components/common/ui/navbar.tsx';
import UsersPage from './routes/users/users.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Navbar />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users" element={<UsersPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute isAnonymousRequired={true} />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

