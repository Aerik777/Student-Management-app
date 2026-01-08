import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';
import Student from '@/models/student';
import AttendanceList from '@/components/AttendanceList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AttendancePage() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className='p-8'>Please log in to mark attendance.</div>;
  }

  // Fetch students (you could filter by department or class here)
  const studentsData = await Student.find({}).lean();
  const formattedStudents = studentsData.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    rollNumber: s.rollNumber,
  }));

  return (
    <div className='max-w-4xl mx-auto py-10'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          Mark Daily Attendance
        </h1>
        <p className='text-gray-500'>Date: {new Date().toLocaleDateString()}</p>
      </header>

      <AttendanceList
        students={formattedStudents}
        facultyId={session?.user?.id as string}
      />
    </div>
  );
}
