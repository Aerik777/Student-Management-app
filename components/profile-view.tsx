import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
    contact_no?: string;
    address?: string;
    admitted_at?: Date | string;
    rollNumber?: string;
  };
}

export default function ProfileView({ user }: ProfileProps) {
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-slate-900'>
        <div className='bg-indigo-600 h-32 px-8 flex items-end'>
          <div className='translate-y-12 bg-white p-2 rounded-2xl shadow-lg border border-slate-100'>
            <div className='w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center'>
              <User className='h-12 w-12 text-slate-400' />
            </div>
          </div>
        </div>

        <div className='pt-16 pb-8 px-8'>
          <h1 className='text-2xl font-bold'>{user.name}</h1>
          <div className='flex items-center gap-2 text-slate-600 mt-1 font-medium'>
            <Shield className='h-4 w-4' />
            <span className='text-sm capitalize'>
              {user.role.toLowerCase()} Account
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4'>
          <h2 className='text-lg font-bold border-b pb-2 text-slate-900'>
            Contact Information
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 text-slate-700'>
              <Mail className='h-4 w-4 text-indigo-500' />
              <div>
                <p className='text-[10px] font-bold uppercase text-slate-400'>
                  Email
                </p>
                <p className='text-sm font-semibold'>{user.email}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 text-slate-700'>
              <Phone className='h-4 w-4 text-indigo-500' />
              <div>
                <p className='text-[10px] font-bold uppercase text-slate-400'>
                  Contact Number
                </p>
                <p className='text-sm font-semibold'>
                  {user.contact_no || 'Not provided'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3 text-slate-700'>
              <MapPin className='h-4 w-4 text-indigo-500' />
              <div>
                <p className='text-[10px] font-bold uppercase text-slate-400'>
                  Address
                </p>
                <p className='text-sm font-semibold'>
                  {user.address || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4'>
          <h2 className='text-lg font-bold border-b pb-2 text-slate-900'>
            Account Details
          </h2>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 text-slate-700'>
              <Calendar className='h-4 w-4 text-indigo-500' />
              <div>
                <p className='text-[10px] font-bold uppercase text-slate-400'>
                  Registration Date
                </p>
                <p className='text-sm font-semibold'>
                  {user.admitted_at
                    ? new Date(user.admitted_at).toLocaleDateString()
                    : 'Information unavailable'}
                </p>
              </div>
            </div>
            {user.role === 'STUDENT' && (
              <>
                <div className='flex items-center gap-3 text-slate-700'>
                  <Shield className='h-4 w-4 text-indigo-500' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>
                      Roll Number
                    </p>
                    <p className='text-sm font-semibold'>
                      {user.rollNumber || 'N/A'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
