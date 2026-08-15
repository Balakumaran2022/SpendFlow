import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import BulkDelete from '../pages/BulkDelete';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { NotFound } from '../pages/NotFound';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="bulk-delete" element={<BulkDelete />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
