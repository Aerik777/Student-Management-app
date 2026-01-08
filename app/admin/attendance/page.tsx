import AttendanceTable from '@/components/AttendanceTable';
import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';
import Student from '@/models/student';


interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AttendancePage({ searchParams }: PageProps) {
  await connectDB();

  // 1. Handle Department Filtering from URL
  const dept =
    typeof searchParams.dept === 'string' ? searchParams.dept : undefined;
  const query = dept ? { department: dept } : {};

  // 2. Fetch students
  const studentsRaw = await Student.find(query).sort({ rollNumber: 1 }).lean();

  // 3. Serialize data for the Client Component (Fixes ObjectId errors)
  const students = JSON.parse(JSON.stringify(studentsRaw));

  return (
    <div className='p-8 max-w-5xl mx-auto'>
      <header className='mb-6'>
        <h1 className='text-2xl font-bold'>
          Mark Attendance {dept ? `— ${dept}` : ''}
        </h1>
        <p className='text-gray-500 text-sm'>
          Select date and subject to record student presence.
        </p>
      </header>

      {/* Pass the serialized students to the Interactive Client Table */}
      <AttendanceTable students={students} />
    </div>
  );
}
