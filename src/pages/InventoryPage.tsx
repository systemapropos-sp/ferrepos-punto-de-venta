import { useState } from 'react';
import { getData, saveData, CATEGORIES } from '@/lib/demoData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Plus, Package, AlertTriangle, Minus as MinusIcon, Plus as PlusIcon, Pencil, Barcode } from 'lucide-react';

export default function InventoryPage() {
  const [data, setData] = useState(() => getData());
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const [form, setForm] = useState({ name:'', sku:'', category:CATEGORIES[0], price:'', cost:'', stock:'', minStock:'', unit:'pza', barcode:'', description:'', supplierId:'' });

  const refresh = () => setData(getData());
  const filtered = data.products.filter((p: any) => {
    const match = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
    return match && (catFilter === 'Todas' || p.category === catFilter);
  });
  const lowStock = data.products.filter((p: any) => p.stock <= p.minStock);

  function saveProduct() {
    const newProduct = { id: editProduct?.id || 'p-' + Date.now(), name: form.name, sku: form.sku, category: form.category, price: Number(form.price)||0, cost: Number(form.cost)||0, stock: Number(form.stock)||0, minStock: Number(form.minStock)||5, unit: form.unit, barcode: form.barcode, description: form.description, supplierId: form.supplierId || null, active: true };
    const d = getData();
    if (editProduct) { d.products = d.products.map((p: any) => p.id === editProduct.id ? newProduct : p); }
    else { d.products.push(newProduct); }
    saveData(d); refresh(); setShowForm(false); setEditProduct(null);
    toast.success(editProduct ? 'Producto actualizado' : 'Producto creado');
  }

  function openEdit(p: any) { setEditProduct(p); setForm({ name:p.name, sku:p.sku, category:p.category, price:String(p.price), cost:String(p.cost), stock:String(p.stock), minStock:String(p.minStock), unit:p.unit, barcode:p.barcode, description:p.description||'', supplierId:p.supplierId||'' }); setShowForm(true); }

  function adjustStock() {
    if (!adjustId) return;
    const d = getData();
    d.products = d.products.map((p: any) => p.id === adjustId ? { ...p, stock: Math.max(0, p.stock + adjustQty) } : p);
    saveData(d); refresh(); setAdjustId(null); setAdjustQty(0);
    toast.success('Stock ajustado');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Inventario</h1>
        <Button onClick={() => { setEditProduct(null); setForm({ name:'', sku:'', category:CATEGORIES[0], price:'', cost:'', stock:'', minStock:'', unit:'pza', barcode:'', description:'', supplierId:'' }); setShowForm(true); }} className="bg-orange-500 hover:bg-orange-600"><Plus className="h-4 w-4 mr-2" /> Nuevo Producto</Button>
      </div>

      {lowStock.length > 0 && <Card className="border-red-200 bg-red-50"><CardContent className="p-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /><p className="text-sm text-red-700"><span className="font-bold">{lowStock.length}</span> productos con stock bajo</p></CardContent></Card>}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <div className="flex gap-1 overflow-x-auto"><button onClick={() => setCatFilter('Todas')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${catFilter==='Todas'?'bg-orange-500 text-white':'bg-slate-100'}`}>Todas</button>{CATEGORIES.map(c => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${catFilter===c?'bg-orange-500 text-white':'bg-slate-100'}`}>{c}</button>)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((p: any) => (
          <Card key={p.id} className={p.stock <= p.minStock ? 'border-red-200' : ''}><CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2"><div className="p-2 rounded-lg bg-orange-100"><Package className="h-4 w-4 text-orange-600" /></div><div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-slate-400">{p.sku} | {p.barcode}</p></div></div>
              <Badge variant={p.stock <= p.minStock ? 'destructive' : 'default'} className="text-[10px]">{p.stock}/{p.minStock}</Badge>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500"><span>Costo: ${p.cost}</span><span>Venta: ${p.price}</span><span>Ganancia: ${p.price - p.cost}</span></div>
            <div className="mt-2 flex gap-1">
              <Button variant="outline" size="sm" className="flex-1 text-xs h-7" onClick={() => openEdit(p)}><Pencil className="h-3 w-3 mr-1" />Editar</Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs h-7" onClick={() => { setAdjustId(p.id); setAdjustQty(0); }}><Barcode className="h-3 w-3 mr-1" />Ajustar</Button>
            </div>
          </CardContent></Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>{editProduct ? 'Editar' : 'Nuevo'} Producto</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Nombre" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
            <div className="grid grid-cols-2 gap-2"><Input placeholder="SKU" value={form.sku} onChange={e => setForm({...form,sku:e.target.value})} /><Input placeholder="Codigo de barras" value={form.barcode} onChange={e => setForm({...form,barcode:e.target.value})} /></div>
            <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <div className="grid grid-cols-3 gap-2"><Input placeholder="Precio" type="number" value={form.price} onChange={e => setForm({...form,price:e.target.value})} /><Input placeholder="Costo" type="number" value={form.cost} onChange={e => setForm({...form,cost:e.target.value})} /><Input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-2"><Input placeholder="Stock minimo" type="number" value={form.minStock} onChange={e => setForm({...form,minStock:e.target.value})} /><Input placeholder="Unidad" value={form.unit} onChange={e => setForm({...form,unit:e.target.value})} /></div>
            <Button onClick={saveProduct} className="w-full bg-orange-500">{editProduct ? 'Actualizar' : 'Crear'} Producto</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!adjustId} onOpenChange={() => setAdjustId(null)}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Ajustar Stock</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm">Stock actual: <span className="font-bold">{data.products.find((p: any) => p.id === adjustId)?.stock || 0}</span></p>
            <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => setAdjustQty(q => q - 1)}><MinusIcon className="h-4 w-4" /></Button><Input type="number" value={adjustQty} onChange={e => setAdjustQty(Number(e.target.value))} className="text-center" /><Button variant="outline" size="icon" onClick={() => setAdjustQty(q => q + 1)}><PlusIcon className="h-4 w-4" /></Button></div>
            <p className="text-sm">Nuevo stock: <span className="font-bold">{(data.products.find((p: any) => p.id === adjustId)?.stock || 0) + adjustQty}</span></p>
            <Button className="w-full bg-orange-500" onClick={adjustStock}>Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
