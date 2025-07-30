import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from '../utils/protected-route';
import Navbar from '../components/navbar';
import DashboardPage from '../pages/dashboard-page';
import UsersPage from '../pages/users-page';
import LoginPage from '../pages/login-page';
import NotFound from '../pages/not-found';
import UsersProvider from '../providers/users-provider';
import TanstackQueryProvider from '../providers/tanstack-query-provider';
import SwrProvider from '../providers/swr-provider';
import NewTodoPage from '../pages/todos/new-todo';
import EditTodoPage from '../pages/todos/edit-todo';
import TodoDetails from '../pages/todos/todo-details';
import { Toaster } from 'react-hot-toast';

const AppRoutes = () => {
  return (
    <SwrProvider>
      <TanstackQueryProvider>
        <Toaster position="top-center" reverseOrder={false} />

        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<Navbar />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/todos/new" element={<NewTodoPage />} />
                <Route path="/todos/:id/edit" element={<EditTodoPage />} />
                <Route path="/todos/:id" element={<TodoDetails />} />

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
    </SwrProvider>
  );
};

export default AppRoutes;

