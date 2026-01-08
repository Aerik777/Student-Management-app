import { getStudents } from '@/actions/common';
import SearchFilters from '@/components/SearchFilters';

export default async function StudentListPage({
  searchParams,
}: {
  searchParams?: { query?: string; dept?: string };
}) {
  const query = searchParams?.query || '';
  const dept = searchParams?.dept || '';

  const students = await getStudents(query, dept);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Manage Students</h1>

      <SearchFilters />

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 uppercase text-xs font-semibold text-gray-600'>
            <tr>
              <th className='p-4'>Name</th>
              <th className='p-4'>Roll Number</th>
              <th className='p-4'>Department</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student._id} className='border-t hover:bg-gray-50'>
                <td className='p-4 font-medium'>{student.name}</td>
                <td className='p-4'>{student.rollNumber}</td>
                <td className='p-4'>
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'>
                    {student.department}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className='p-10 text-center text-gray-500'>
            No students found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
