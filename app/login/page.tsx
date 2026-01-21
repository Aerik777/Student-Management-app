'use client';

import {
  GraduationCap,
  ShieldCheck,
  Users,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const roles = [
    {
      title: 'Administrator',
      desc: 'System controls & users',
      href: '/adminlogin',
      icon: ShieldCheck,
      color: 'bg-indigo-600',
      light: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    {
      title: 'Faculty Hub',
      desc: 'Attendance & grading',
      href: '/facultylogin',
      icon: Users,
      color: 'bg-emerald-600',
      light: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      title: 'Student Portal',
      desc: 'Results & assignments',
      href: '/studentlogin',
      icon: BookOpen,
      color: 'bg-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
    },
  ];

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20'>
      <div className='max-w-4xl w-full'>
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-6 shadow-xl shadow-indigo-100'>
            <GraduationCap className='h-10 w-10 text-white' />
          </div>
          <h2 className='text-4xl font-extrabold text-slate-900 mb-4 tracking-tight'>
            Welcome Back to <span className='text-indigo-600'>EduManage</span>
          </h2>
          <p className='text-slate-500 font-medium text-lg max-w-lg mx-auto'>
            Please select your portal to continue to your dashboard.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {roles.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className='group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-1'
            >
              <div
                className={`${role.light} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <role.icon className={`h-7 w-7 ${role.text}`} />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                {role.title}
              </h3>
              <p className='text-slate-500 text-sm font-medium mb-6'>
                {role.desc}
              </p>
              <div
                className={`flex items-center gap-2 font-bold text-sm ${role.text}`}
              >
                Sign In
                <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
              </div>
            </Link>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-slate-500 font-medium'>
            Don't have an account?{' '}
            <Link
              href='/register'
              className='text-indigo-600 font-bold hover:underline'
            >
              Request Access / Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
