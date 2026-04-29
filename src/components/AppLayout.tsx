import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden lg:block"><Sidebar /></div>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-3 lg:p-5 pb-24 lg:pb-5">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
