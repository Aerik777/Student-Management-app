'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName?: string;
  onMenuClick?: () => void;
}

export default function DashboardHeader({
  title,
  userName,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className='h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 shadow-sm z-30 sticky top-0'>
      <div className='flex items-center gap-4'>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className='md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg'
          >
            <Menu className='h-6 w-6' />
          </button>
        )}
        <h1 className='text-lg md:text-xl font-bold text-slate-950 truncate'>
          {title}
        </h1>
      </div>

      <div className='flex items-center gap-2 md:gap-4'>
        {userName && (
          <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200'>
            <User className='h-4 w-4 text-slate-600' />
            <span className='text-xs font-semibold text-slate-700'>
              {userName}
            </span>
          </div>
        )}

        <Button
          variant='ghost'
          size='sm'
          onClick={() => signOut({ callbackUrl: '/' })}
          className='flex items-center gap-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium'
        >
          <LogOut className='h-4 w-4' />
          <span className='hidden sm:inline'>Logout</span>
        </Button>
      </div>
    </header>
  );
}
