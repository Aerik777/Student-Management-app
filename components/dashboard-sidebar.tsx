'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  MessageSquare,
  CreditCard,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUnreadCount } from '@/actions/messages';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export default function DashboardSidebar({
  role,
  open = false,
  setOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = () => {
      // If we are currently on the messages page, don't show badges
      if (pathname.includes('/messages')) {
        setUnreadCount(0);
        return;
      }

      if (session?.user) {
        getUnreadCount((session.user as any).id).then(setUnreadCount);
      }
    };

    fetchUnread();

    // Event Handlers
    const handleDecrement = (e: any) => {
      const amount = e.detail || 0;
      setUnreadCount((prev) => Math.max(0, prev - amount));
    };

    const handleClear = () => {
      setUnreadCount(0);
    };

    window.addEventListener('decrement-unread', handleDecrement);
    window.addEventListener('clear-unread', handleClear);

    // Pusher for real-time sidebar updates
    if (session?.user) {
      const userId = (session.user as any).id;
      const { pusherClient } = require('@/lib/pusher-client');
      const channel = pusherClient.subscribe(`chat-${userId}`);

      channel.bind('new-message', () => {
        // Don't increment if we are already seeing the messages
        if (!pathname.includes('/messages')) {
          setUnreadCount((prev) => prev + 1);
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        window.removeEventListener('decrement-unread', handleDecrement);
        window.removeEventListener('clear-unread', handleClear);
      };
    }
  }, [session]);

  const routes = {
    ADMIN: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Manage Users', href: '/admin/users', icon: Users },
      { name: 'Manage Classes', href: '/admin/classes', icon: BookOpen },
      { name: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
      { name: 'Student Info', href: '/admin/student', icon: GraduationCap },
      { name: 'Profile', href: '/admin/profile', icon: UserCircle },
    ],
    FACULTY: [
      { name: 'Dashboard', href: '/faculty', icon: LayoutDashboard },
      { name: 'Assignments', href: '/faculty/assignments', icon: BookOpen },
      { name: 'Attendance', href: '/faculty/attendance', icon: CalendarCheck },
      {
        name: 'Messages',
        href: '/faculty/messages',
        icon: MessageSquare,
        badge: unreadCount,
      },
      { name: 'Profile', href: '/faculty/profile', icon: UserCircle },
    ],
    STUDENT: [
      { name: 'Overview', href: '/student', icon: LayoutDashboard },
      { name: 'Assignments', href: '/student/assignments', icon: BookOpen },
      {
        name: 'Messages',
        href: '/student/messages',
        icon: MessageSquare,
        badge: unreadCount,
      },
      { name: 'Profile', href: '/student/profile', icon: UserCircle },
    ],
  };

  const activeRoutes = routes[role] || [];

  const config = {
    ADMIN: {
      bg: 'bg-indigo-950',
      text: 'text-indigo-100',
      hover: 'hover:bg-indigo-900',
      active: 'bg-indigo-800',
    },
    FACULTY: {
      bg: 'bg-emerald-950',
      text: 'text-emerald-100',
      hover: 'hover:bg-emerald-900',
      active: 'bg-emerald-800',
    },
    STUDENT: {
      bg: 'bg-blue-950',
      text: 'text-blue-100',
      hover: 'hover:bg-blue-900',
      active: 'bg-blue-800',
    },
  }[role];

  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          'fixed md:relative z-50 h-full transition-all duration-300 ease-in-out border-r border-indigo-500/10 shadow-xl md:shadow-none',
          open ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
          collapsed && !open ? 'md:w-20' : 'md:w-64',
          config.bg,
          config.text
        )}
      >
        <div className='p-4 flex flex-col h-full'>
          <div className='flex items-center justify-between mb-8 px-2'>
            {(!collapsed || open) && (
              <div className='flex items-center gap-2'>
                <GraduationCap className='h-8 w-8' />
                <span className='text-xl font-bold tracking-tight'>
                  EduManage
                </span>
              </div>
            )}
            {collapsed && !open && (
              <GraduationCap className='h-8 w-8 mx-auto' />
            )}

            <div className='flex items-center gap-2'>
              {/* Close button for mobile */}
              <button
                onClick={() => setOpen && setOpen(false)}
                className='md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors'
              >
                <ChevronLeft className='h-6 w-6' />
              </button>

              {/* Collapse button for desktop */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className='hidden md:block p-1.5 rounded-lg hover:bg-white/10 transition-colors'
              >
                {collapsed ? (
                  <ChevronRight className='h-5 w-5' />
                ) : (
                  <ChevronLeft className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <nav className='space-y-1 flex-1'>
            {activeRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => {
                  setOpen && setOpen(false); // Close sidebar on nav click (mobile)
                  if (route.name === 'Messages') setUnreadCount(0); // Optimistic clear
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group',
                  config.hover,
                  pathname === route.href
                    ? config.active
                    : 'text-white/80 hover:bg-white/10',
                  collapsed && !open ? 'justify-center' : ''
                )}
                title={collapsed && !open ? route.name : undefined}
              >
                <route.icon className='h-5 w-5 min-h-[20px] min-w-[20px]' />
                {(!collapsed || open) && <span>{route.name}</span>}

                {/* Badge */}
                {(route as any).badge > 0 && (
                  <span
                    className={cn(
                      'absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      collapsed && !open ? 'top-0 right-0' : ''
                    )}
                  >
                    {(route as any).badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {(!collapsed || open) && (
            <div className='mt-auto pt-6 text-xs text-center opacity-60'>
              <p>&copy; 2026 EduManage</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
