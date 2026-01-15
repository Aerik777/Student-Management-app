import { getStudents } from '@/actions/common';
import { getClasses } from '@/actions/admin';
import SearchFilters from '@/components/SearchFilters';

export default async function StudentListPage({
  searchParams,
}: {
  searchParams?: { query?: string; classId?: string };
}) {
  const query = searchParams?.query || '';
  const classId = searchParams?.classId || '';

  const students = await getStudents(query, classId);
  const classes = await getClasses();

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-slate-950 mb-4'>
        Manage Students
      </h1>

      <SearchFilters classes={classes} />

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-slate-100 uppercase text-xs font-bold text-slate-900 border-b border-slate-300'>
            <tr>
              <th className='p-4'>Name</th>
              <th className='p-4'>Class</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student._id} className='border-t hover:bg-gray-50'>
                <td className='p-4 font-bold text-slate-900'>{student.name}</td>
                <td className='p-4'>
                  {student.classIds && student.classIds.length > 0 ? (
                    <div className='flex gap-2 flex-wrap'>
                      {student.classIds.map((cls: any) => (
                        <span
                          key={cls._id}
                          className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'
                        >
                          {cls.grade}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className='text-gray-400 text-sm'>
                      No class assigned
                    </span>
                  )}
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
