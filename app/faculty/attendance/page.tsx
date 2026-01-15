import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';
import User from '@/models/user';
import AttendanceList from '@/components/AttendanceList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AttendancePage() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className='p-8'>Please log in to mark attendance.</div>;
  }

  // Fetch students

  // Fetch students
  const studentsData = await User.find({ role: 'STUDENT' })
    .sort({ rollNumber: 1 })
    .lean();

  // Fetch today's attendance
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const attendanceRecords = await (
    await import('@/models/attendance')
  ).default
    .find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
    .lean();

  const attendanceMap = new Map();
  attendanceRecords.forEach((record: any) => {
    attendanceMap.set(record.studentId.toString(), record.status);
  });

  const formattedStudents = studentsData.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    rollNumber: s.rollNumber,
    initialStatus: attendanceMap.get(s._id.toString()) || 'Present', // Default to present only if not marked
  }));

  return (
    <div className='max-w-4xl mx-auto py-10'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-950'>
          Mark Daily Attendance
        </h1>
        <p className='text-slate-700 font-medium'>
          Date: {new Date().toLocaleDateString()}
        </p>
      </header>

      <AttendanceList
        students={formattedStudents}
        facultyId={session?.user?.id as string}
      />
    </div>
  );
}
