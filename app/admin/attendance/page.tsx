import AttendanceTable from '@/components/AttendanceTable';
import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';
import User from '@/models/user';
import Attendance from '@/models/attendance';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AttendancePage({ searchParams }: PageProps) {
  await connectDB();

  const query: any = { role: 'STUDENT' };

  // 2. Fetch students
  const studentsRaw = await User.find(query)
    .populate('classIds')
    .sort({ rollNumber: 1 })
    .lean();

  // 3. Fetch Attendance Stats
  const attendanceStats = await Attendance.aggregate([
    {
      $group: {
        _id: '$studentId',
        totalPresent: {
          $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] },
        },
        totalAbsent: {
          $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] },
        },
      },
    },
  ]);

  const statsMap = new Map(attendanceStats.map((s) => [s._id.toString(), s]));

  // 4. Serialize data
  const students = JSON.parse(JSON.stringify(studentsRaw)).map((s: any) => ({
    ...s,
    totalPresent: statsMap.get(s._id)?.totalPresent || 0,
    totalAbsent: statsMap.get(s._id)?.totalAbsent || 0,
    className: s.classIds?.[0]?.grade || 'N/A', // Simplified for sorting
  }));

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-950'>Mark Attendance</h1>
        <p className='text-slate-900 font-bold text-sm'>
          Select date and subject to record student presence.
        </p>
      </header>

      {/* Pass the serialized students to the Interactive Client Table */}
      <AttendanceTable students={students} />
    </div>
  );
}
