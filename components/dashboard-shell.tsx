'use client';

import { useState } from 'react';
import DashboardSidebar from './dashboard-sidebar';
import DashboardHeader from './dashboard-header';

interface ShellProps {
  children: React.ReactNode;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
  title: string;
  userName?: string;
}

export default function DashboardShell({
  children,
  role,
  title,
  userName,
}: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      <DashboardSidebar
        role={role}
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
      />
      <div className='flex-1 flex flex-col min-w-0 transition-all duration-300'>
        <DashboardHeader
          title={title}
          userName={userName}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className='flex-1 overflow-y-auto p-4 md:p-8 relative'>
          {children}
          {/* Overlay for mobile sidebar */}
          {mobileMenuOpen && (
            <div
              className='fixed inset-0 bg-black/50 z-40 md:hidden'
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
