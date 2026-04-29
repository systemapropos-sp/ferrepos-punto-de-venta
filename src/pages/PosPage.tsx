import { useState, useMemo } from 'react';
import { getData, saveData, CATEGORIES } from '@/lib/demoData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, ArrowRightLeft, X, User, Receipt } from 'lucide-react';

interface CartItem { productId: string; name: string; price: number; cost: number; qty: number; }

export default function PosPage() {
  const { user } = useAuth();
  const [data, setDataState] = useState(() => getData());
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo'|'tarjeta'|'transferencia'>('efectivo');
  const [customerId, setCustomerId] = useState<string>('');
  const [discount, setDiscount] = useState(0);

  const filtered = useMemo(() => {
    return data.products.filter((p: any) => p.active).filter((p: any) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
      const matchCat = catFilter === 'Todas' || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [data.products, search, catFilter]);

  const addToCart = (p: any) => {
    if (p.stock <= 0) { toast.error('Sin stock'); return; }
    setCart(prev => {
      const existing = prev.find(i => i.productId === p.id);
      if (existing) {
        if (existing.qty >= p.stock) { toast.error('Stock maximo alcanzado'); return prev; }
        return prev.map(i => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { productId: p.id, name: p.name, price: p.price, cost: p.cost, qty: 1 }];
    });
    setShowCart(true);
  };

  const updateQty = (pid: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId !== pid) return i;
      const newQty = i.qty + delta;
      if (newQty <= 0) return i;
      const prod = data.products.find((p: any) => p.id === pid);
      if (prod && newQty > prod.stock) { toast.error('Sin stock suficiente'); return i; }
      return { ...i, qty: newQty };
    }).filter(i => i.qty > 0));
  };

  const removeFromCart = (pid: string) => setCart(prev => prev.filter(i => i.productId !== pid));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const taxable = subtotal - discountAmount;
  const tax = Math.round(taxable * 0.16);
  const total = taxable + tax;

  const completeSale = () => {
    if (cart.length === 0) return;
    const customer = data.customers.find((c: any) => c.id === customerId);
    const newSale = {
      id: 'sale-' + Date.now(),
      invoiceNumber: 'F-' + String(data.sales.length + 1).padStart(4, '0'),
      items: cart.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price, cost: i.cost, total: i.price * i.qty })),
      subtotal, discount: discountAmount, tax, total,
      paymentMethod, customerId: customerId || null,
      customerName: customer?.name || 'Publico en general',
      cashierId: user?.id, cashierName: user?.name,
      date: new Date().toISOString(), status: 'completada', notes: ''
    };

    const updatedProducts = data.products.map((p: any) => {
      const cartItem = cart.find(i => i.productId === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.qty } : p;
    });

    const newData = { ...data, products: updatedProducts, sales: [newSale, ...data.sales] };
    saveData(newData);
    setDataState(newData);
    setCart([]);
    setDiscount(0);
    setShowPayment(false);
    toast.success(`Venta ${newSale.invoiceNumber} completada: $${total.toLocaleString()}`);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-3">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 shrink-0">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Buscar producto, SKU o codigo de barras..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            <button onClick={() => setCatFilter('Todas')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${catFilter === 'Todas' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Todas</button>
            {CATEGORIES.map(c => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${catFilter === c ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{c}</button>)}
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
            {filtered.map((p: any) => (
              <Card key={p.id} className={`cursor-pointer hover:shadow-md transition-shadow ${p.stock <= p.minStock ? 'border-red-200' : ''}`} onClick={() => addToCart(p)}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <Badge variant="outline" className="text-[9px]">{p.category}</Badge>
                    {p.stock <= p.minStock && <span className="text-[9px] text-red-500 font-bold">BAJO</span>}
                  </div>
                  <p className="text-sm font-medium line-clamp-2 leading-tight">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sku}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-orange-600">${p.price}</p>
                    <p className="text-xs text-slate-400">{p.stock} {p.unit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center text-slate-400 py-8">No se encontraron productos</p>}
        </div>
      </div>

      {/* Cart Panel */}
      <div className={`lg:w-96 flex flex-col gap-3 ${showCart ? 'block' : 'hidden lg:flex'}`}>
        <Card className="flex-1 flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-orange-500" /><span className="font-bold">Carrito</span><Badge className="bg-orange-500">{cart.reduce((s,i)=>s+i.qty,0)}</Badge></div>
            <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline">Vaciar</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {cart.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">Agrega productos al carrito</p>}
            {cart.map(item => (
              <div key={item.productId} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-slate-500">${item.price} c/u</p></div>
                <div className="flex items-center gap-1"><button onClick={() => updateQty(item.productId, -1)} className="p-1 rounded hover:bg-slate-200"><Minus className="h-3 w-3" /></button><span className="text-sm font-bold w-6 text-center">{item.qty}</span><button onClick={() => updateQty(item.productId, 1)} className="p-1 rounded hover:bg-slate-200"><Plus className="h-3 w-3" /></button></div>
                <p className="text-sm font-bold w-16 text-right">${(item.price * item.qty).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.productId)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="p-3 border-t space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="flex-1 text-sm border rounded px-2 py-1 bg-white">
                <option value="">Publico en general</option>
                {data.customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm items-center"><span>Descuento:</span><div className="flex items-center gap-1"><Input type="number" min={0} max={100} value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-14 h-7 text-right text-sm" /><span>%</span></div></div>
            {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Ahorro:</span><span>-${discountAmount.toLocaleString()}</span></div>}
            <div className="flex justify-between text-sm"><span>IVA (16%):</span><span>${tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-bold border-t pt-2"><span>TOTAL:</span><span className="text-orange-600">${total.toLocaleString()}</span></div>
            <Button onClick={() => { if (cart.length === 0) { toast.error('Carrito vacio'); return; } setShowPayment(true); }} className="w-full bg-orange-500 hover:bg-orange-600 text-lg h-12" disabled={cart.length === 0}>
              <Receipt className="h-5 w-5 mr-2" /> Cobrar ${total.toLocaleString()}
            </Button>
          </div>
        </Card>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-4 border-b flex items-center justify-between"><h3 className="font-bold text-lg">Metodo de Pago</h3><button onClick={() => setShowPayment(false)}><X className="h-5 w-5" /></button></div>
            <div className="p-4 space-y-4">
              <div className="text-center"><p className="text-sm text-slate-500">Total a pagar</p><p className="text-3xl font-bold text-orange-600">${total.toLocaleString()}</p></div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setPaymentMethod('efectivo')} className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition ${paymentMethod === 'efectivo' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}><Banknote className="h-6 w-6" /><span className="text-xs font-medium">Efectivo</span></button>
                <button onClick={() => setPaymentMethod('tarjeta')} className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition ${paymentMethod === 'tarjeta' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}><CreditCard className="h-6 w-6" /><span className="text-xs font-medium">Tarjeta</span></button>
                <button onClick={() => setPaymentMethod('transferencia')} className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition ${paymentMethod === 'transferencia' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}><ArrowRightLeft className="h-6 w-6" /><span className="text-xs font-medium">Transferencia</span></button>
              </div>
              <Button onClick={completeSale} className="w-full bg-green-500 hover:bg-green-600 h-12 text-lg">Confirmar Pago</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Mobile cart toggle */}
      <button onClick={() => setShowCart(!showCart)} className="lg:hidden fixed bottom-20 right-4 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg"><ShoppingCart className="h-6 w-6" /></button>
    </div>
  );
}
