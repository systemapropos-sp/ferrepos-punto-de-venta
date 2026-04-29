import { useState } from 'react';
import { getData, saveData } from '@/lib/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Building2, Users, Tag, Save, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const [data, setData] = useState(() => getData());
  const [company, setCompany] = useState(data.company);
  const refresh = () => { const d = getData(); setData(d); setCompany(d.company); };

  function saveCompany() {
    const d = getData(); d.company = company; saveData(d); refresh();
    toast.success('Configuracion guardada');
  }

  function resetData() {
    if (!confirm('Se borraran todos los datos y se restauraran los de demo. Continuar?')) return;
    localStorage.removeItem('ferrepos_data');
    localStorage.removeItem('ferrepos_user');
    window.location.reload();
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Configuracion</h1>
      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company"><Building2 className="h-4 w-4 mr-2" /> Empresa</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" /> Usuarios</TabsTrigger>
          <TabsTrigger value="system"><Tag className="h-4 w-4 mr-2" /> Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card><CardHeader><CardTitle className="text-sm">Informacion de la Empresa</CardTitle></CardHeader><CardContent className="space-y-3">
            <Input placeholder="Nombre" value={company.name} onChange={e => setCompany({...company,name:e.target.value})} />
            <Input placeholder="Direccion" value={company.address} onChange={e => setCompany({...company,address:e.target.value})} />
            <div className="grid grid-cols-2 gap-3"><Input placeholder="Telefono" value={company.phone} onChange={e => setCompany({...company,phone:e.target.value})} /><Input placeholder="Email" type="email" value={company.email} onChange={e => setCompany({...company,email:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3"><Input placeholder="RFC" value={company.rfc} onChange={e => setCompany({...company,rfc:e.target.value})} /><Input placeholder="IVA %" type="number" value={company.taxRate} onChange={e => setCompany({...company,taxRate:Number(e.target.value)})} /></div>
            <Button onClick={saveCompany} className="bg-orange-500"><Save className="h-4 w-4 mr-2" /> Guardar</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card><CardHeader><CardTitle className="text-sm">Usuarios del Sistema</CardTitle></CardHeader><CardContent className="space-y-2">
            {data.users.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-slate-500">{u.email} | PIN: {u.pin}</p></div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${u.role==='admin'?'bg-orange-100 text-orange-700':u.role==='gerente'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}`}>{u.role}</span>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card><CardHeader><CardTitle className="text-sm">Datos del Sistema</CardTitle></CardHeader><CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm"><p>Productos: <span className="font-bold">{data.products.length}</span></p><p>Clientes: <span className="font-bold">{data.customers.length}</span></p><p>Proveedores: <span className="font-bold">{data.suppliers.length}</span></p><p>Ventas: <span className="font-bold">{data.sales.length}</span></p></div>
            <Button variant="destructive" onClick={resetData} className="w-full"><RotateCcw className="h-4 w-4 mr-2" /> Restaurar Datos de Demo</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
