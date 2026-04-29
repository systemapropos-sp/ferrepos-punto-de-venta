const DEMO_KEY = 'ferrepos_data';
const USER_KEY = 'ferrepos_user';

export interface Product {
  id: string; name: string; sku: string; category: string;
  price: number; cost: number; stock: number; minStock: number;
  unit: string; barcode: string; description: string; image?: string;
  supplierId: string | null; active: boolean;
}
export interface Customer {
  id: string; name: string; phone: string; email: string;
  address: string; rfc: string; type: 'general' | 'mayorista';
  creditLimit: number; balance: number; notes: string;
}
export interface Supplier {
  id: string; name: string; contact: string; phone: string;
  email: string; address: string; products: string[];
}
export interface SaleItem {
  productId: string; name: string; qty: number;
  price: number; cost: number; total: number;
}
export interface Sale {
  id: string; invoiceNumber: string; items: SaleItem[];
  subtotal: number; discount: number; tax: number; total: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  customerId: string | null; customerName: string;
  cashierId: string; cashierName: string;
  date: string; status: 'completada' | 'cancelada' | 'devolucion';
  notes: string;
}
export interface User {
  id: string; name: string; email: string; role: 'admin' | 'cajero' | 'gerente';
  pin: string; phone: string; active: boolean;
}
export interface Company {
  name: string; address: string; phone: string; email: string;
  rfc: string; taxRate: number; logo?: string;
}

const CATEGORIES = ['Herramientas','Pintura','Electricidad','Plomeria','Ferreteria General','Jardineria','Seguridad','Construccion','Automotriz','Limpieza'];

const defaultProducts: Product[] = [
  {id:'p-001',name:'Martillo de carpintero 16oz',sku:'MART-016',category:'Herramientas',price:185,cost:95,stock:24,minStock:5,unit:'pza',barcode:'750123456001',description:'Martillo con mango de fibra de vidrio',supplierId:'s-001',active:true},
  {id:'p-002',name:'Pinza de presion 10"',sku:'PINZ-010',category:'Herramientas',price:145,cost:72,stock:18,minStock:5,unit:'pza',barcode:'750123456002',description:'Pinza de presion ajustable',supplierId:'s-001',active:true},
  {id:'p-003',name:'Desarmador plano 6"',sku:'DESP-006',category:'Herramientas',price:45,cost:20,stock:45,minStock:10,unit:'pza',barcode:'750123456003',description:'',supplierId:'s-001',active:true},
  {id:'p-004',name:'Cinta metrica 5m',sku:'CINT-005',category:'Herramientas',price:85,cost:40,stock:32,minStock:8,unit:'pza',barcode:'750123456004',description:'',supplierId:'s-001',active:true},
  {id:'p-005',name:'Nivel de burbuja 12"',sku:'NIVL-012',category:'Herramientas',price:120,cost:60,stock:15,minStock:4,unit:'pza',barcode:'750123456005',description:'',supplierId:'s-001',active:true},
  {id:'p-006',name:'Pintura vinilica blanca 19L',sku:'PINT-VB19',category:'Pintura',price:485,cost:280,stock:12,minStock:3,unit:'bote',barcode:'750123456006',description:'Pintura vinilica para interiores',supplierId:'s-002',active:true},
  {id:'p-007',name:'Pintura esmalte rojo 4L',sku:'PINT-ER4',category:'Pintura',price:245,cost:140,stock:8,minStock:3,unit:'bote',barcode:'750123456007',description:'',supplierId:'s-002',active:true},
  {id:'p-008',name:'Brocha 4" profesional',sku:'BROC-004',category:'Pintura',price:65,cost:30,stock:30,minStock:8,unit:'pza',barcode:'750123456008',description:'',supplierId:'s-002',active:true},
  {id:'p-009',name:'Rodillo para pintar 9"',sku:'RODL-009',category:'Pintura',price:95,cost:48,stock:20,minStock:5,unit:'pza',barcode:'750123456009',description:'',supplierId:'s-002',active:true},
  {id:'p-010',name:'Cinta masking 24mm x 50m',sku:'MASK-024',category:'Pintura',price:35,cost:15,stock:60,minStock:15,unit:'pza',barcode:'750123456010',description:'',supplierId:'s-002',active:true},
  {id:'p-011',name:'Cable THW 12 AWG (metro)',sku:'CABL-12',category:'Electricidad',price:18,cost:9,stock:500,minStock:100,unit:'m',barcode:'750123456011',description:'Cable cobre 12 AWG',supplierId:'s-003',active:true},
  {id:'p-012',name:'Apagador sencillo',sku:'APAG-SEN',category:'Electricidad',price:35,cost:16,stock:40,minStock:10,unit:'pza',barcode:'750123456012',description:'',supplierId:'s-003',active:true},
  {id:'p-013',name:'Contacto duplex',sku:'CONT-DUP',category:'Electricidad',price:28,cost:13,stock:50,minStock:12,unit:'pza',barcode:'750123456013',description:'',supplierId:'s-003',active:true},
  {id:'p-014',name:'Plafon circular LED 12W',sku:'PLAF-12W',category:'Electricidad',price:85,cost:42,stock:22,minStock:6,unit:'pza',barcode:'750123456014',description:'',supplierId:'s-003',active:true},
  {id:'p-015',name:'Extension electrica 10m',sku:'EXT-010M',category:'Electricidad',price:195,cost:98,stock:14,minStock:4,unit:'pza',barcode:'750123456015',description:'',supplierId:'s-003',active:true},
  {id:'p-016',name:'Tubo PVC 1/2" 6m',sku:'PVC-0506',category:'Plomeria',price:65,cost:32,stock:80,minStock:20,unit:'pza',barcode:'750123456016',description:'',supplierId:'s-004',active:true},
  {id:'p-017',name:'Cemento PVC 250ml',sku:'CEMPVC250',category:'Plomeria',price:45,cost:22,stock:35,minStock:8,unit:'pza',barcode:'750123456017',description:'',supplierId:'s-004',active:true},
  {id:'p-018',name:'Llave de paso 1/2"',sku:'LLAV-050',category:'Plomeria',price:55,cost:27,stock:28,minStock:7,unit:'pza',barcode:'750123456018',description:'',supplierId:'s-004',active:true},
  {id:'p-019',name:'Manguera jardin 1/2" 20m',sku:'MANG-05020',category:'Jardineria',price:175,cost:88,stock:16,minStock:4,unit:'pza',barcode:'750123456019',description:'',supplierId:'s-005',active:true},
  {id:'p-020',name:'Aspersor de jardin 360',sku:'ASPE-360',category:'Jardineria',price:85,cost:42,stock:20,minStock:5,unit:'pza',barcode:'750123456020',description:'',supplierId:'s-005',active:true},
  {id:'p-021',name:'Cerradura para puerta',sku:'CERR-001',category:'Seguridad',price:285,cost:145,stock:10,minStock:3,unit:'pza',barcode:'750123456021',description:'',supplierId:'s-006',active:true},
  {id:'p-022',name:'Candado 50mm',sku:'CAND-050',category:'Seguridad',price:75,cost:38,stock:25,minStock:6,unit:'pza',barcode:'750123456022',description:'',supplierId:'s-006',active:true},
  {id:'p-023',name:'Cemento gris 50kg',sku:'CEM-GR50',category:'Construccion',price:165,cost:95,stock:48,minStock:10,unit:'saco',barcode:'750123456023',description:'',supplierId:'s-007',active:true},
  {id:'p-024',name:'Varilla corrugada 3/8" 12m',sku:'VAR-03812',category:'Construccion',price:185,cost:98,stock:30,minStock:8,unit:'pza',barcode:'750123456024',description:'',supplierId:'s-007',active:true},
  {id:'p-025',name:'Silicon transparente 280ml',sku:'SIL-TR280',category:'Ferreteria General',price:55,cost:26,stock:40,minStock:10,unit:'pza',barcode:'750123456025',description:'',supplierId:'s-002',active:true},
  {id:'p-026',name:'Clavos 2" (kg)',sku:'CLAV-002',category:'Ferreteria General',price:35,cost:16,stock:100,minStock:25,unit:'kg',barcode:'750123456026',description:'',supplierId:'s-007',active:true},
  {id:'p-027',name:'Tornillos autorroscantes 1" (100pzas)',sku:'TOR-001100',category:'Ferreteria General',price:25,cost:12,stock:80,minStock:20,unit:'pza',barcode:'750123456027',description:'',supplierId:'s-007',active:true},
  {id:'p-028',name:'Guantes de trabajo',sku:'GUAN-TRB',category:'Seguridad',price:55,cost:25,stock:35,minStock:8,unit:'par',barcode:'750123456028',description:'',supplierId:'s-006',active:true},
  {id:'p-029',name:'Aceite para motor 20W-50',sku:'ACE-20501L',category:'Automotriz',price:95,cost:48,stock:24,minStock:6,unit:'litro',barcode:'750123456029',description:'',supplierId:'s-008',active:true},
  {id:'p-030',name:'Escoba industrial',sku:'ESCO-IND',category:'Limpieza',price:65,cost:30,stock:20,minStock:5,unit:'pza',barcode:'750123456030',description:'',supplierId:'s-005',active:true},
];

const defaultCustomers: Customer[] = [
  {id:'c-001',name:'Juan Perez',phone:'555-0101',email:'juan@email.com',address:'Calle Principal 123',rfc:'PEPJ800101',type:'general',creditLimit:0,balance:0,notes:''},
  {id:'c-002',name:'Constructora del Norte',phone:'555-0202',email:'ventas@cdn.com',address:'Av Industrial 456',rfc:'CDN990202',type:'mayorista',creditLimit:50000,balance:12500,notes:''},
  {id:'c-003',name:'Maria Garcia',phone:'555-0303',email:'maria@email.com',address:'Calle Flores 789',rfc:'GARM750303',type:'general',creditLimit:0,balance:0,notes:''},
  {id:'c-004',name:'Inmobiliaria Centro',phone:'555-0404',email:'compras@icentro.com',address:'Centro Historico 10',rfc:'ICE050404',type:'mayorista',creditLimit:100000,balance:45000,notes:''},
  {id:'c-005',name:'Pedro Lopez',phone:'555-0505',email:'pedro@email.com',address:'Colonia Reforma 55',rfc:'LOPP850505',type:'general',creditLimit:0,balance:0,notes:''},
  {id:'c-006',name:'Electricos Hernandez',phone:'555-0606',email:'eh@email.com',address:'Av Tecnologico 200',rfc:'EHE100606',type:'mayorista',creditLimit:30000,balance:8000,notes:''},
  {id:'c-007',name:'Sofia Martinez',phone:'555-0707',email:'sofia@email.com',address:'Calle Jardin 33',rfc:'MASS900707',type:'general',creditLimit:0,balance:0,notes:''},
  {id:'c-008',name:'Plomeros Express',phone:'555-0808',email:'px@email.com',address:'Av Servicios 77',rfc:'PEX150808',type:'mayorista',creditLimit:25000,balance:12000,notes:''},
];

const defaultSuppliers: Supplier[] = [
  {id:'s-001',name:'Herramientas MX',contact:'Roberto Diaz',phone:'555-1100',email:'rd@hmex.com',address:'Parque Industrial Nte',products:['Martillos','Pinzas','Desarmadores']},
  {id:'s-002',name:'Pinturas y Complementos SA',contact:'Laura Ruiz',phone:'555-2200',email:'laura@pycsa.com',address:'Zona Comercial Sur',products:['Pinturas','Brocas','Cintas']},
  {id:'s-003',name:'Electrica Nacional',contact:'Carlos Soto',phone:'555-3300',email:'cs@enac.com',address:'Av Circuito 88',products:['Cables','Contactos','Plafones']},
  {id:'s-004',name:'Tuberias y Valvulas del Centro',contact:'Ana Flores',phone:'555-4400',email:'ana@tyvc.com',address:'Carr Central km 12',products:['PVC','Valvulas','Conexiones']},
  {id:'s-005',name:'Jardin y Hogar',contact:'Miguel Torres',phone:'555-5500',email:'mt@jyh.com',address:'Blvd Verde 45',products:['Mangueras','Aspersores','Escobas']},
  {id:'s-006',name:'Seguridad Total',contact:'Diana Cruz',phone:'555-6600',email:'dc@stotal.com',address:'Poligono Industrial 7',products:['Cerraduras','Candados','Guantes']},
  {id:'s-007',name:'Materiales de Construccion Lopez',contact:'Fernando Lopez',phone:'555-7700',email:'fl@mclopez.com',address:'Carretera Norte 150',products:['Cemento','Varilla','Clavos']},
  {id:'s-008',name:'Lubricantes Automotrices',contact:'Jorge Vargas',phone:'555-8800',email:'jv@lubauto.com',address:'Av Automotriz 22',products:['Aceites','Grasas','Aditivos']},
];

const defaultUsers: User[] = [
  {id:'u-001',name:'Admin FerrePOS',email:'admin@ferrepos.com',role:'admin',pin:'1234',phone:'555-0001',active:true},
  {id:'u-002',name:'Carlos Mendez',email:'carlos@ferrepos.com',role:'cajero',pin:'1111',phone:'555-0002',active:true},
  {id:'u-003',name:'Diana Ruiz',email:'diana@ferrepos.com',role:'cajero',pin:'2222',phone:'555-0003',active:true},
  {id:'u-004',name:'Gerardo Flores',email:'gerardo@ferrepos.com',role:'gerente',pin:'3333',phone:'555-0004',active:true},
];

const defaultCompany: Company = {
  name:'Ferreteria El Constructor',address:'Av Principal 123, Ciudad',phone:'555-123-4567',email:'ventas@elconstructor.com',rfc:'FEC010101ABC',taxRate:16,
};

function generateSales(): Sale[] {
  const sales: Sale[] = [];
  const methods: Sale['paymentMethod'][] = ['efectivo','tarjeta','transferencia'];
  const cashierIds = ['u-001','u-002','u-003'];
  const cashierNames = ['Admin FerrePOS','Carlos Mendez','Diana Ruiz'];
  const customerIds = [null,'c-001','c-002','c-003','c-004','c-005'];
  const customerNames = ['Publico en general','Juan Perez','Constructora del Norte','Maria Garcia','Inmobiliaria Centro','Pedro Lopez'];
  
  for (let i = 0; i < 45; i++) {
    const date = new Date(); date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items: SaleItem[] = [];
    let subtotal = 0;
    for (let j = 0; j < numItems; j++) {
      const prod = defaultProducts[Math.floor(Math.random() * defaultProducts.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      items.push({productId:prod.id,name:prod.name,qty,price:prod.price,cost:prod.cost,total:prod.price*qty});
      subtotal += prod.price * qty;
    }
    const discount = Math.random() > 0.7 ? Math.round(subtotal * 0.05) : 0;
    const tax = Math.round((subtotal - discount) * 0.16);
    const total = subtotal - discount + tax;
    const ci = Math.floor(Math.random() * customerIds.length);
    const cashierIdx = Math.floor(Math.random() * cashierIds.length);
    sales.push({
      id:`sale-${i+1}`,invoiceNumber:`F-${(1000+i+1).toString().slice(1)}`,items,subtotal,discount,tax,total,
      paymentMethod:methods[Math.floor(Math.random()*methods.length)],
      customerId:customerIds[ci],customerName:customerNames[ci],
      cashierId:cashierIds[cashierIdx],cashierName:cashierNames[cashierIdx],
      date:date.toISOString(),status:'completada',notes:''
    });
  }
  return sales.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getData() {
  const stored = localStorage.getItem(DEMO_KEY);
  if (stored) return JSON.parse(stored);
  const data = {products:defaultProducts,customers:defaultCustomers,suppliers:defaultSuppliers,users:defaultUsers,company:defaultCompany,sales:generateSales(),categories:CATEGORIES};
  localStorage.setItem(DEMO_KEY,JSON.stringify(data));
  return data;
}

export function saveData(data: any) { localStorage.setItem(DEMO_KEY,JSON.stringify(data)); }

export function getCurrentUser(): User | null { const s = localStorage.getItem(USER_KEY); return s?JSON.parse(s):null; }
export function setCurrentUser(u: User | null) { u?localStorage.setItem(USER_KEY,JSON.stringify(u)):localStorage.removeItem(USER_KEY); }

export { CATEGORIES };
