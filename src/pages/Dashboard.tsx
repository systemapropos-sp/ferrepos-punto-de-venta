import { useMemo } from 'react';
import { getData, CATEGORIES } from '@/lib/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, Package, TrendingUp, AlertTriangle, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#f97316','#3b82f6','#10b981','#8b5cf6','#ef4444','#06b6d4','#f59e0b','#ec4899','#6366f1','#14b8a6'];

export default function Dashboard() {
  const { user } = useAuth();
  const data = useMemo(() => getData(), []);
  const today = new Date().toISOString().split('T')[0];

  const todaySales = data.sales.filter((s: any) => s.date.startsWith(today) && s.status === 'completada');
  const todayTotal = todaySales.reduce((sum: number, s: any) => sum + s.total, 0);
  const monthSales = data.sales.filter((s: any) => { const d = new Date(s.date); return d.getMonth() === new Date().getMonth() && s.status === 'completada'; });
  const monthTotal = monthSales.reduce((sum: number, s: any) => sum + s.total, 0);
  const lowStock = data.products.filter((p: any) => p.stock <= p.minStock);
  const totalProducts = data.products.length;

  const salesByDay = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days[d.toISOString().split('T')[0]] = 0; }
    data.sales.filter((s: any) => s.status === 'completada').forEach((s: any) => { if (days[s.date.split('T')[0]] !== undefined) days[s.date.split('T')[0]] += s.total; });
    return Object.entries(days).map(([date, total]) => ({ date: date.slice(5), total }));
  }, [data.sales]);

  const salesByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    data.sales.filter((s: any) => s.status === 'completada').forEach((s: any) => {
      s.items.forEach((item: any) => {
        const prod = data.products.find((p: any) => p.id === item.productId);
        if (prod) { cats[prod.category] = (cats[prod.category] || 0) + item.total; }
      });
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [data]);

  const recentSales = data.sales.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">Bienvenido, {user?.name}</p>
        </div>
        <p className="text-sm text-slate-400">{new Date().toLocaleDateString('es-MX',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-orange-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Ventas Hoy</p><p className="text-xl font-bold">${todayTotal.toLocaleString()}</p></div><DollarSign className="h-8 w-8 text-orange-500" /></div><p className="text-xs text-slate-400 mt-1">{todaySales.length} tickets</p></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Ventas Mes</p><p className="text-xl font-bold">${monthTotal.toLocaleString()}</p></div><TrendingUp className="h-8 w-8 text-blue-500" /></div><p className="text-xs text-slate-400 mt-1">{monthSales.length} ventas</p></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Productos</p><p className="text-xl font-bold">{totalProducts}</p></div><Package className="h-8 w-8 text-green-500" /></div><p className="text-xs text-slate-400 mt-1">{CATEGORIES.length} categorias</p></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Stock Bajo</p><p className="text-xl font-bold">{lowStock.length}</p></div><AlertTriangle className="h-8 w-8 text-red-500" /></div><p className="text-xs text-slate-400 mt-1">Requieren atencion</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Ventas Ultimos 7 Dias</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={200}><BarChart data={salesByDay}><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} /><Bar dataKey="total" fill="#f97316" /></BarChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Ventas por Categoria</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={salesByCategory} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name">{salesByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} /></PieChart></ResponsiveContainer>
        </CardContent></Card>
      </div>

      <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Receipt className="h-4 w-4" /> Ventas Recientes</CardTitle></CardHeader><CardContent className="space-y-2">
        {recentSales.map((s: any) => (
          <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <div><p className="text-sm font-medium">{s.invoiceNumber}</p><p className="text-xs text-slate-500">{s.customerName} - {new Date(s.date).toLocaleDateString('es-MX')}</p></div>
            <div className="text-right"><p className="text-sm font-bold">${s.total.toLocaleString()}</p><Badge variant={s.paymentMethod === 'efectivo' ? 'default' : 'outline'} className="text-[10px]">{s.paymentMethod}</Badge></div>
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}
