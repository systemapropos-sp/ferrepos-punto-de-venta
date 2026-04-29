import { useState } from 'react';
import { getData, saveData } from '@/lib/demoData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Search, Plus, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function SuppliersPage() {
  const [data, setData] = useState(() => getData());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', contact:'', phone:'', email:'', address:'' });
  const refresh = () => setData(getData());
  const filtered = data.suppliers.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));

  function saveSupplier() {
    const d = getData();
    d.suppliers.push({ id: 's-' + Date.now(), name: form.name, contact: form.contact, phone: form.phone, email: form.email, address: form.address, products: [] });
    saveData(d); refresh(); setShowForm(false);
    toast.success('Proveedor creado');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Proveedores</h1>
        <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-2" /> Nuevo Proveedor</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Buscar proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((s: any) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow"><CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100"><Truck className="h-5 w-5 text-green-600" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-slate-500">Contacto: {s.contact}</p>
                {s.phone && <p className="text-xs text-slate-500 flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</p>}
                {s.email && <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</p>}
                {s.address && <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" />{s.address}</p>}
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Nuevo Proveedor</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Nombre" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
            <Input placeholder="Contacto" value={form.contact} onChange={e => setForm({...form,contact:e.target.value})} />
            <div className="grid grid-cols-2 gap-2"><Input placeholder="Telefono" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /><Input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div>
            <Input placeholder="Direccion" value={form.address} onChange={e => setForm({...form,address:e.target.value})} />
            <Button onClick={saveSupplier} className="w-full bg-orange-500">Crear Proveedor</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
