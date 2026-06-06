import Sidebar from './Sidebar';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}