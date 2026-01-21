import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFacultyStats } from '@/actions/faculty';
import FacultyDashboardClient from '@/components/FacultyDashboardClient';

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  const teacherId = (session.user as any).id;
  const stats = await getFacultyStats(teacherId);

  return (
    <div className='p-6'>
      <div className='mb-10'>
        <h1 className='text-4xl font-extrabold text-slate-950 tracking-tight'>
          Faculty Dashboard
        </h1>
        <p className='text-slate-500 font-medium mt-1'>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:shadow-emerald-50/50 transition-all'>
          <div className='bg-emerald-50 p-4 rounded-2xl'>
            <div className='h-6 w-6 text-emerald-600 font-bold'>CL</div>
          </div>
          <div>
            <p className='text-sm font-bold text-slate-500 uppercase tracking-wider'>
              My Classes
            </p>
            <p className='text-3xl font-extrabold text-slate-900'>
              {stats.classes}
            </p>
          </div>
        </div>

        <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:shadow-orange-50/50 transition-all'>
          <div className='bg-orange-50 p-4 rounded-2xl'>
            <div className='h-6 w-6 text-orange-600 font-bold'>AS</div>
          </div>
          <div>
            <p className='text-sm font-bold text-slate-500 uppercase tracking-wider'>
              Assignments
            </p>
            <p className='text-3xl font-extrabold text-slate-900'>
              {stats.assignments}
            </p>
          </div>
        </div>

        <div className='bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:shadow-blue-50/50 transition-all'>
          <div className='bg-blue-50 p-4 rounded-2xl'>
            <div className='h-6 w-6 text-blue-600 font-bold'>MS</div>
          </div>
          <div>
            <p className='text-sm font-bold text-slate-500 uppercase tracking-wider'>
              Messages
            </p>
            <p className='text-3xl font-extrabold text-slate-900'>
              {stats.messages}
            </p>
          </div>
        </div>
      </div>

      <FacultyDashboardClient teacherId={teacherId} />
    </div>
  );
}
