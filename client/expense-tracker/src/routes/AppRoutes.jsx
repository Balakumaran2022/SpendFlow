import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
