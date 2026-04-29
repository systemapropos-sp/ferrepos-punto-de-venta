import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Receipt, Users, Settings } from 'lucide-react';

const items = [
  { path: '/', label: 'Inicio', icon: LayoutDashboard },
  { path: '/pos', label: 'Venta', icon: ShoppingCart },
  { path: '/inventory', label: 'Stock', icon: Package },
  { path: '/sales', label: 'Ventas', icon: Receipt },
  { path: '/customers', label: 'Clientes', icon: Users },
  { path: '/settings', label: 'Ajustes', icon: Settings },
];
export function MobileNav() {
  const navigate = useNavigate();
  const loc = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-1 pb-safe">
      <div className="flex justify-around">
        {items.map(i => {
          const I = i.icon;
          const active = loc.pathname === i.path;
          return (
            <button key={i.path} onClick={() => navigate(i.path)}
              className={`flex flex-col items-center py-2 px-1 text-[10px] ${active ? 'text-orange-500 font-medium' : 'text-slate-400'}`}>
              <I className="h-5 w-5 mb-0.5" />{i.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
