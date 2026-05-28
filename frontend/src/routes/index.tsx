import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import Books from '../pages/Books';
import Members from '../pages/Members';
import Transactions from '../pages/Transactions';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {

  return (
    <Routes>
      {/* Public Authentication sector */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Protected administrative sector */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Dashboard />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Books />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Members />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Transactions />
            </RootLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
