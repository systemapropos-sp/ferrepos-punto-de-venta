import { useState } from 'react';
import { getData, saveData } from '@/lib/demoData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Plus, UserCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function CustomersPage() {
  const [data, setData] = useState(() => getData());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', rfc:'', type:'general' as 'general'|'mayorista', creditLimit:'', notes:'' });
  const refresh = () => setData(getData());
  const filtered = data.customers.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.rfc.toLowerCase().includes(search.toLowerCase()));

  function saveCustomer() {
    const d = getData();
    d.customers.push({ id: 'c-' + Date.now(), name: form.name, phone: form.phone, email: form.email, address: form.address, rfc: form.rfc, type: form.type, creditLimit: Number(form.creditLimit)||0, balance: 0, notes: form.notes });
    saveData(d); refresh(); setShowForm(false);
    toast.success('Cliente creado');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-2" /> Nuevo Cliente</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((c: any) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow"><CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100"><UserCircle className="h-5 w-5 text-blue-600" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between"><p className="font-medium truncate">{c.name}</p><Badge variant={c.type==='mayorista'?'default':'outline'} className="text-[10px]">{c.type}</Badge></div>
                {c.phone && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="h-3 w-3" />{c.phone}</p>}
                {c.email && <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</p>}
                {c.address && <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{c.address}</p>}
                {c.type === 'mayorista' && <p className="text-xs text-slate-500 mt-1">Credito: ${c.creditLimit.toLocaleString()} | Saldo: ${c.balance.toLocaleString()}</p>}
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Nombre" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
            <div className="grid grid-cols-2 gap-2"><Input placeholder="Telefono" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /><Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div>
            <Input placeholder="Direccion" value={form.address} onChange={e => setForm({...form,address:e.target.value})} />
            <div className="grid grid-cols-2 gap-2"><Input placeholder="RFC" value={form.rfc} onChange={e => setForm({...form,rfc:e.target.value})} /><Input placeholder="Limite de credito" type="number" value={form.creditLimit} onChange={e => setForm({...form,creditLimit:e.target.value})} /></div>
            <select value={form.type} onChange={e => setForm({...form,type:e.target.value as any})} className="w-full border rounded-md px-3 py-2 text-sm"><option value="general">General</option><option value="mayorista">Mayorista</option></select>
            <Button onClick={saveCustomer} className="w-full bg-orange-500">Crear Cliente</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
