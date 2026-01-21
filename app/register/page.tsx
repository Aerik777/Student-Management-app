'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/auth';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import CustomToast from '@/components/CustomToast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      setToast({
        message:
          'Registration Successful! Your account is pending admin approval. Redirecting...',
        type: 'success',
        isVisible: true,
      });
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12'>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <div className='max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100 overflow-hidden flex flex-col md:flex-row'>
        {/* Left Side - Info */}
        <div className='bg-indigo-600 md:w-5/12 p-8 text-white flex flex-col justify-between'>
          <div>
            <div className='flex items-center gap-2 mb-8'>
              <GraduationCap className='h-8 w-8' />
              <span className='text-xl font-bold tracking-tight'>
                EduManage
              </span>
            </div>
            <h2 className='text-3xl font-extrabold mb-4 leading-tight'>
              Join Our Academic Community
            </h2>
            <p className='text-indigo-100 text-sm opacity-90 leading-relaxed'>
              Create an account to access assignments, results, and real-time
              communication with your faculty.
            </p>
          </div>

          <div className='hidden md:block'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='bg-white/10 p-2 rounded-lg'>
                <UserCheck className='h-5 w-5 text-indigo-200' />
              </div>
              <div className='text-xs'>
                <p className='font-bold'>Admin Verified</p>
                <p className='text-indigo-200 opacity-70'>
                  Secure access control
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='md:w-7/12 p-8 md:p-12 bg-white'>
          <div className='mb-8'>
            <h3 className='text-2xl font-bold text-slate-900 mb-1'>
              Create Account
            </h3>
            <p className='text-slate-500 text-sm font-medium'>
              Enter your details to register
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider'>
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-5 w-5 text-slate-400' />
                <input
                  type='text'
                  required
                  placeholder='John Doe'
                  className='w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium'
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-5 w-5 text-slate-400' />
                <input
                  type='email'
                  required
                  placeholder='john@example.com'
                  className='w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium'
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-5 w-5 text-slate-400' />
                <input
                  type='password'
                  required
                  placeholder='••••••••'
                  className='w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-400 font-medium'
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider'>
                Register As
              </label>
              <select
                className='w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold appearance-none'
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value='STUDENT'>Student</option>
                <option value='FACULTY'>Faculty</option>
                <option value='ADMIN'>Administrator</option>
              </select>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group'
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  Register Now
                  <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>

            <div className='pt-4 text-center'>
              <p className='text-sm text-slate-500 font-medium'>
                Already have an account?{' '}
                <Link
                  href='/studentlogin'
                  className='text-indigo-600 font-bold hover:underline'
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
