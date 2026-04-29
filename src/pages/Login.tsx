import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Zap } from 'lucide-react';
import { getData, setCurrentUser } from '@/lib/demoData';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@ferrepos.com');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(email, pin)) navigate('/');
    else setError('Email o PIN incorrecto');
  }

  function enterDemo() {
    const data = getData();
    const admin = data.users.find((u: any) => u.email === 'admin@ferrepos.com');
    if (admin) { setCurrentUser(admin); window.location.href = '/'; }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Store className="h-14 w-14 text-orange-500 mx-auto mb-2" />
          <CardTitle className="text-2xl text-slate-800">FerrePOS</CardTitle>
          <p className="text-sm text-muted-foreground">Punto de Venta para Ferreterias</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>PIN</Label>
              <Input type="password" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Iniciar Sesion</Button>
          </form>
          <button onClick={enterDemo} className="w-full mt-3 py-2.5 px-4 border border-green-500 text-green-600 hover:bg-green-50 rounded-md font-medium text-sm flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" /> Entrar en Modo Demo
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">Demo: admin@ferrepos.com / 1234</p>
        </CardContent>
      </Card>
    </div>
  );
}
