import Link from 'next/link';
import { GraduationCap, ShieldCheck, BookOpen, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Navigation */}
      <nav className='flex justify-between items-center px-8 py-6 bg-white shadow-sm'>
        <div className='flex items-center gap-2'>
          <GraduationCap className='h-8 w-8 text-indigo-600' />
          <span className='text-2xl font-bold text-slate-900 tracking-tight'>
            EduManage
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <Link
            href='/register'
            className='text-slate-600 hover:text-indigo-600 font-medium transition-colors'
          >
            Sign Up
          </Link>
          <Link
            href='/superadminlogin'
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all'
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className='max-w-7xl mx-auto px-8 py-20'>
        <div className='text-center mb-16'>
          <h1 className='text-5xl md:text-6xl font-extrabold text-slate-900 mb-6'>
            Smart Management for <br />
            <span className='text-indigo-600'>Modern Colleges</span>
          </h1>
          <p className='text-lg text-slate-800 font-medium max-w-2xl mx-auto'>
            A comprehensive ERP solution to streamline attendance, library
            assets, real-time communication, and academic performance tracking.
          </p>
          <div className='mt-10 flex justify-center gap-4'>
            <Link
              href='/register'
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-105'
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Feature Grid / Role Selection */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Admin Feature */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6'>
              <ShieldCheck className='text-indigo-600' />
            </div>
            <h3 className='text-xl font-bold text-slate-900 mb-3'>
              Admin Portal
            </h3>
            <p className='text-slate-800 font-medium mb-6'>
              Manage student records, faculty assignments, and system-wide
              configurations.
            </p>
            <Link
              href='/adminlogin'
              className='text-indigo-600 font-semibold hover:underline'
            >
              Access Admin →
            </Link>
          </div>

          {/* Faculty Feature */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6'>
              <Users className='text-emerald-600' />
            </div>
            <h3 className='text-xl font-bold text-slate-900 mb-3'>
              Faculty Hub
            </h3>
            <p className='text-slate-800 font-medium mb-6'>
              Mark daily attendance, manage course materials, and chat with
              students in real-time.
            </p>
            <Link
              href='/facultylogin'
              className='text-emerald-600 font-semibold hover:underline'
            >
              Access Faculty →
            </Link>
          </div>

          {/* Student Feature */}
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6'>
              <BookOpen className='text-blue-600' />
            </div>
            <h3 className='text-xl font-bold text-slate-900 mb-3'>
              Student Dashboard
            </h3>
            <p className='text-slate-700 mb-6'>
              View Result, attendance charts, check library book status, and pay
              semester fees securely.
            </p>
            <Link
              href='/studentlogin'
              className='text-blue-600 font-semibold hover:underline'
            >
              Access Dashboard →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-slate-200 mt-20 py-10 text-center text-slate-800 font-medium text-sm'>
        © 2026 EduManage ERP System. Built with Next.js 14 & MongoDB.
      </footer>
    </div>
  );
}
