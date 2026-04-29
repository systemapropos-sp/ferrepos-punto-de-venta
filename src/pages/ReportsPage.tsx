import { useMemo } from 'react';
import { getData } from '@/lib/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';

const COLORS = ['#f97316','#3b82f6','#10b981','#8b5cf6','#ef4444','#06b6d4','#f59e0b','#ec4899','#6366f1','#14b8a6'];

export default function ReportsPage() {
  const data = getData();
  const sales = data.sales.filter((s: any) => s.status === 'completada');

  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter((s: any) => s.date.startsWith(today));
  const todayTotal = todaySales.reduce((sum: number, s: any) => sum + s.total, 0);
  const totalSales = sales.reduce((sum: number, s: any) => sum + s.total, 0);
  const totalItems = sales.reduce((sum: number, s: any) => sum + s.items.reduce((iSum: number, i: any) => iSum + i.qty, 0), 0);

  const salesByDay = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days[d.toISOString().split('T')[0]] = 0; }
    sales.forEach((s: any) => { if (days[s.date.split('T')[0]] !== undefined) days[s.date.split('T')[0]] += s.total; });
    return Object.entries(days).map(([date, total]) => ({ date: date.slice(5), total }));
  }, [sales]);

  const salesByMethod = useMemo(() => {
    const methods: Record<string, number> = {};
    sales.forEach((s: any) => { methods[s.paymentMethod] = (methods[s.paymentMethod] || 0) + s.total; });
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const topProducts = useMemo(() => {
    const prods: Record<string, { name: string; qty: number; revenue: number }> = {};
    sales.forEach((s: any) => s.items.forEach((i: any) => {
      if (!prods[i.productId]) prods[i.productId] = { name: i.name, qty: 0, revenue: 0 };
      prods[i.productId].qty += i.qty; prods[i.productId].revenue += i.total;
    }));
    return Object.values(prods).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [sales]);

  const salesByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    sales.forEach((s: any) => s.items.forEach((item: any) => {
      const prod = data.products.find((p: any) => p.id === item.productId);
      if (prod) cats[prod.category] = (cats[prod.category] || 0) + item.total;
    }));
    return Object.entries(cats).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [sales, data.products]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Reportes</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-orange-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Ventas Hoy</p><p className="text-xl font-bold">${todayTotal.toLocaleString()}</p></div><DollarSign className="h-8 w-8 text-orange-500" /></div></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Ventas Totales</p><p className="text-xl font-bold">${totalSales.toLocaleString()}</p></div><TrendingUp className="h-8 w-8 text-blue-500" /></div></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">No. Ventas</p><p className="text-xl font-bold">{sales.length}</p></div><ShoppingCart className="h-8 w-8 text-green-500" /></div></CardContent></Card>
        <Card className="border-l-4 border-l-purple-500"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Items Vendidos</p><p className="text-xl font-bold">{totalItems}</p></div><Package className="h-8 w-8 text-purple-500" /></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Ventas 14 Dias</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={salesByDay}><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} /><Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Por Metodo de Pago</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={salesByMethod} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name">{salesByMethod.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Top 10 Productos Vendidos</CardTitle></CardHeader><CardContent>
          <div className="space-y-2">{topProducts.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded"><span className="text-sm truncate flex-1">{i+1}. {p.name}</span><div className="text-right"><p className="text-sm font-bold">${p.revenue.toLocaleString()}</p><p className="text-xs text-slate-500">{p.qty} vendidos</p></div></div>
          ))}</div>
        </CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Ventas por Categoria</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={220}><BarChart data={salesByCategory} layout="vertical"><XAxis type="number" /><YAxis dataKey="name" type="category" width={90} style={{ fontSize: 11 }} /><Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} /><Bar dataKey="value" fill="#f97316" /></BarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    </div>
  );
}
