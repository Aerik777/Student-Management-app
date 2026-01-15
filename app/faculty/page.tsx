import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFacultyStats } from '@/actions/faculty';

export default async function FacultyDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  const stats = await getFacultyStats((session.user as any).id);

  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-950 mb-8'>
        Faculty Dashboard
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-sm'>
          <h3 className='text-lg font-bold text-slate-900 mb-2'>My Classes</h3>
          <p className='text-3xl font-bold text-emerald-600'>{stats.classes}</p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm'>
          <h3 className='text-lg font-bold text-slate-900 mb-2'>
            Active Assignments
          </h3>
          <p className='text-3xl font-bold text-orange-600'>
            {stats.assignments}
          </p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm'>
          <h3 className='text-lg font-bold text-slate-900 mb-2'>
            New Messages
          </h3>
          <p className='text-3xl font-bold text-blue-600'>{stats.messages}</p>
        </div>
      </div>
    </div>
  );
}
