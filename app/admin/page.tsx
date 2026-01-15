import Link from 'next/link';
import { Users, BookOpen, Clock, Settings } from 'lucide-react';
import User from '@/models/user';
import connectDB from '@/lib/db';

export default async function AdminDashboard() {
  await connectDB();
  const userCount = await User.countDocuments();
  const facultyCount = await User.countDocuments({ role: 'FACULTY' });
  const studentCount = await User.countDocuments({ role: 'STUDENT' });

  const stats = [
    {
      label: 'Total Users',
      value: userCount,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      label: 'Faculty',
      value: facultyCount,
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      label: 'Students',
      value: studentCount,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Classes',
      value: '12',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-950 mb-8'>
        Admin Dashboard Overview
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {stats.map((stat, i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className='text-slate-700 text-sm font-semibold'>
              {stat.label}
            </h3>
            <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>
            Recent Actions
          </h2>
          <div className='space-y-4'>
            <Link
              href='/admin/users/add'
              className='block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <span className='font-bold text-slate-900'>Add New User</span>
              <p className='text-sm text-slate-800 font-medium'>
                Create a new student, faculty, or admin account.
              </p>
            </Link>
            <Link
              href='/admin/users'
              className='block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <span className='font-bold text-slate-900'>Manage Users</span>
              <p className='text-sm text-slate-800 font-medium'>
                View, edit, or remove existing users.
              </p>
            </Link>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold text-slate-900 mb-4'>
            System Status
          </h2>
          <div className='flex items-center gap-2 text-green-600'>
            <div className='h-2 w-2 bg-green-600 rounded-full animate-pulse'></div>
            <span className='text-sm font-medium'>Database Connected</span>
          </div>
          <p className='text-sm text-slate-700 font-medium mt-2'>
            All systems are running normally. Last update 2 mins ago.
          </p>
        </div>
      </div>
    </div>
  );
}
