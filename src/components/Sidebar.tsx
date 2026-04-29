import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ShoppingCart, Package, Receipt, Users, Truck, BarChart3, Settings, LogOut, Store } from 'lucide-react';

const nav = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
  { path: '/inventory', label: 'Inventario', icon: Package },
  { path: '/sales', label: 'Ventas', icon: Receipt },
  { path: '/customers', label: 'Clientes', icon: Users },
  { path: '/suppliers', label: 'Proveedores', icon: Truck },
  { path: '/reports', label: 'Reportes', icon: BarChart3 },
  { path: '/settings', label: 'Configuracion', icon: Settings },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-60 flex flex-col border-r bg-white">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Store className="h-7 w-7 text-orange-500" />
        <span className="font-bold text-lg text-slate-800">FerrePOS</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {nav.map(item => {
          const I = item.icon;
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}>
              <I className="h-5 w-5" />{item.label}
            </button>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="mb-2 text-sm">
          <p className="font-medium text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" />Salir
        </button>
      </div>
    </aside>
  );
}
