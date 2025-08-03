import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from '../utils/protected-route';
import Navbar from '../components/navbar';
import UsersProvider from '../providers/users-provider';
import { Suspense, lazy } from 'react';
import Loading from '../components/loading';
import DashboardPage from '../pages/dashboard-page';
import TodosProvider from '../providers/todo-provider';

const LazyEditTodo = lazy(() => import('../pages/todos/edit-todo'));
const LazyNewTodo = lazy(() => import('../pages/todos/new-todo'));
const LazyLogin = lazy(() => import('../pages/login-page'));
const LazyTodoDetails = lazy(() => import('../pages/todos/todo-details'));
const LazyUsers = lazy(() => import('../pages/users-page'));
const LazyNotFound = lazy(() => import('../pages/not-found'));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Navbar />}>
            <Route
              path="/dashboard"
              element={
                <TodosProvider>
                  <DashboardPage />
                </TodosProvider>
              }
            />
            <Route
              path="/todos/new"
              element={
                <Suspense fallback={<Loading />}>
                  <LazyNewTodo />
                </Suspense>
              }
            />
            <Route
              path="/todos/:id/edit"
              element={
                <Suspense fallback={<Loading />}>
                  <LazyEditTodo />
                </Suspense>
              }
            />
            <Route
              path="/todos/:id"
              element={
                <Suspense fallback={<Loading />}>
                  <LazyTodoDetails />
                </Suspense>
              }
            />

            <Route
              path="/dashboard/users"
              element={
                <Suspense fallback={<Loading />}>
                  <UsersProvider>
                    <LazyUsers />
                  </UsersProvider>
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute isAnonymousRequired={true} />}>
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loading />}>
                <LazyLogin />
              </Suspense>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<Loading />}>
              <LazyNotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

