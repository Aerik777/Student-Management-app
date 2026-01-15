import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user';
import AssignmentAnswer from '@/models/assignmentAnswer';
import Attendance from '@/models/attendance';

export default async function StudentOverview() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  await connectDB();
  const userId = (session.user as any).id;
  const user = await User.findById(userId).populate({
    path: 'classIds',
    strictPopulate: false,
  });

  const submissionCount = await AssignmentAnswer.countDocuments({
    studentId: userId,
  });
  // Attendance is complex, just sample for now

  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-950 mb-8'>
        Welcome back, {user?.name}
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-slate-700 text-sm font-semibold'>
            Assigned Class
          </h3>
          <p className='text-2xl font-bold text-gray-900'>
            {user?.classIds && user.classIds.length > 0
              ? user.classIds.map((c: any) => c.grade).join(', ')
              : 'N/A'}
          </p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-slate-700 text-sm font-semibold'>
            Assignments Submitted
          </h3>
          <p className='text-2xl font-bold text-blue-600'>{submissionCount}</p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-slate-700 text-sm font-semibold'>
            Attendance Rate
          </h3>
          <p className='text-2xl font-bold text-green-600'>92%</p>
        </div>
      </div>

      <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
        <h2 className='text-xl font-bold text-slate-900 mb-4'>
          Your Profile Details
        </h2>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div className='text-slate-900 font-bold'>Email:</div>
          <div className='font-semibold text-slate-700'>{user?.email}</div>
          <div className='text-slate-900 font-bold'>Contact:</div>
          <div className='font-semibold text-slate-700'>
            {user?.contact_no || 'Not set'}
          </div>
          <div className='text-slate-900 font-bold'>Roll Number:</div>
          <div className='font-semibold text-slate-700'>
            {user?.rollNumber || 'N/A'}
          </div>

          <div className='text-slate-900 font-bold'>Address:</div>
          <div className='font-semibold text-slate-700'>
            {user?.address || 'Not set'}
          </div>
          <div className='text-slate-900 font-bold'>Admitted At:</div>
          <div className='font-semibold text-slate-700'>
            {user?.admitted_at
              ? new Date(user.admitted_at).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
