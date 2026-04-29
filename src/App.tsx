import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PosPage from './pages/PosPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import CustomersPage from './pages/CustomersPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
