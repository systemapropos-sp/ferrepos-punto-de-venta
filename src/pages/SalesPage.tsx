import { useState } from 'react';
import { getData } from '@/lib/demoData';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export default function SalesPage() {
  const data = getData();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('todas');

  const filtered = data.sales.filter((s: any) => {
    const matchSearch = s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || s.customerName.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || s.date.startsWith(dateFilter);
    const matchMethod = methodFilter === 'todas' || s.paymentMethod === methodFilter;
    return matchSearch && matchDate && matchMethod;
  });

  const totalSales = filtered.filter((s: any) => s.status === 'completada').reduce((sum: number, s: any) => sum + s.total, 0);
  const totalCount = filtered.filter((s: any) => s.status === 'completada').length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Historial de Ventas</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-orange-500"><CardContent className="p-4"><p className="text-xs text-slate-500">Total Filtrado</p><p className="text-xl font-bold">${totalSales.toLocaleString()}</p></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500"><CardContent className="p-4"><p className="text-xs text-slate-500">No. Ventas</p><p className="text-xl font-bold">{totalCount}</p></CardContent></Card>
        <Card className="border-l-4 border-l-green-500"><CardContent className="p-4"><p className="text-xs text-slate-500">Ticket Promedio</p><p className="text-xl font-bold">${totalCount ? Math.round(totalSales / totalCount).toLocaleString() : 0}</p></CardContent></Card>
        <Card className="border-l-4 border-l-purple-500"><CardContent className="p-4"><p className="text-xs text-slate-500">Total Historico</p><p className="text-xl font-bold">${data.sales.filter((s: any) => s.status === 'completada').reduce((sum: number, s: any) => sum + s.total, 0).toLocaleString()}</p></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Buscar folio o cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-40" />
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm"><option value="todas">Todos</option><option value="efectivo">Efectivo</option><option value="tarjeta">Tarjeta</option><option value="transferencia">Transferencia</option></select>
      </div>

      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="text-left p-3 font-medium">Folio</th><th className="text-left p-3 font-medium">Fecha</th><th className="text-left p-3 font-medium">Cliente</th><th className="text-left p-3 font-medium">Cajero</th><th className="text-left p-3 font-medium">Metodo</th><th className="text-right p-3 font-medium">Total</th><th className="text-center p-3 font-medium">Estado</th></tr></thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{s.invoiceNumber}</td>
                  <td className="p-3 text-slate-500">{new Date(s.date).toLocaleDateString('es-MX')}</td>
                  <td className="p-3">{s.customerName}</td>
                  <td className="p-3 text-slate-500">{s.cashierName}</td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px] capitalize">{s.paymentMethod}</Badge></td>
                  <td className="p-3 text-right font-bold">${s.total.toLocaleString()}</td>
                  <td className="p-3 text-center"><Badge className={s.status === 'completada' ? 'bg-green-500' : 'bg-red-500'}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-400 py-8">No hay ventas</p>}
      </CardContent></Card>
    </div>
  );
}
