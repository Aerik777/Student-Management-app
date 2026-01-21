import { getUsers, getClasses } from '@/actions/admin';
import Link from 'next/link';
import { Search, CheckCircle, Clock } from 'lucide-react';
import UserApprovalButton from '@/components/UserApprovalButton';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    role?: string;
    classId?: string;
    status?: string;
  };
}) {
  const isActiveFilter =
    searchParams.status === 'active'
      ? true
      : searchParams.status === 'pending'
        ? false
        : undefined;

  const users = await getUsers({
    name: searchParams.q,
    role: searchParams.role,
    classId: searchParams.classId,
    isActive: isActiveFilter,
  });

  const classes = await getClasses();

  return (
    <div className='p-4 md:p-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <h1 className='text-2xl font-bold text-slate-950'>Manage Users</h1>
        <Link
          href='/admin/users/add'
          className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full md:w-auto text-center'
        >
          Add New User
        </Link>
      </div>

      {/* Filter Section - Using a simple Form for Server Side Filtering */}
      <div className='bg-white p-4 rounded-lg shadow-sm mb-6 border border-slate-200'>
        <form className='flex flex-col md:flex-row gap-4 items-end'>
          <div className='flex-1 w-full'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Search
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
              <input
                name='q'
                defaultValue={searchParams.q}
                placeholder='Search by name...'
                className='pl-9 w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none'
              />
            </div>
          </div>
          <div className='w-full md:w-48'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Role
            </label>
            <select
              name='role'
              defaultValue={searchParams.role || ''}
              className='w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900'
            >
              <option value=''>All Roles</option>
              <option value='STUDENT'>Student</option>
              <option value='FACULTY'>Faculty</option>
              <option value='ADMIN'>Admin</option>
            </select>
          </div>
          <div className='w-full md:w-48'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Class
            </label>
            <select
              name='classId'
              defaultValue={searchParams.classId || ''}
              className='w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900'
            >
              <option value=''>All Classes</option>
              {classes.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.grade}
                </option>
              ))}
            </select>
          </div>
          <div className='w-full md:w-32'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Status
            </label>
            <select
              name='status'
              defaultValue={searchParams.status || ''}
              className='w-full border border-slate-300 rounded-md p-2 text-sm text-slate-900'
            >
              <option value=''>All</option>
              <option value='active'>Active</option>
              <option value='pending'>Pending</option>
            </select>
          </div>
          <button
            type='submit'
            className='bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-bold w-full md:w-auto hover:bg-slate-800'
          >
            Filter
          </button>
          {(searchParams.q || searchParams.role || searchParams.classId) && (
            <Link
              href='/admin/users'
              className='text-slate-500 text-sm underline px-2'
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden overflow-x-auto'>
        <table className='w-full text-left min-w-[600px]'>
          <thead className='bg-slate-100 uppercase text-xs font-bold text-slate-900 border-b border-slate-300'>
            <tr>
              <th className='p-4'>Name</th>
              <th className='p-4'>Email</th>
              <th className='p-4'>Role</th>
              <th className='p-4'>Class</th>
              <th className='p-4'>Status</th>
              <th className='p-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id} className='border-t hover:bg-gray-50'>
                <td className='p-4 font-bold text-slate-900'>{user.name}</td>
                <td className='p-4 text-slate-800 font-medium'>{user.email}</td>
                <td className='p-4'>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'FACULTY'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className='p-4 text-slate-800 font-medium'>
                  {user.classIds && user.classIds.length > 0
                    ? user.classIds.map((c: any) => c.grade).join(', ')
                    : 'N/A'}
                </td>
                <td className='p-4'>
                  {user.isActive ? (
                    <div className='flex items-center text-green-600 font-bold text-xs uppercase'>
                      <CheckCircle className='w-3 h-3 mr-1' /> Active
                    </div>
                  ) : (
                    <div className='flex items-center text-orange-600 font-bold text-xs uppercase'>
                      <Clock className='w-3 h-3 mr-1' /> Pending
                    </div>
                  )}
                </td>
                <td className='p-4 space-x-2'>
                  {!user.isActive && (
                    <UserApprovalButton userId={user._id.toString()} />
                  )}
                  <Link
                    href={`/admin/users/edit/${user._id}`}
                    className='text-indigo-600 hover:text-indigo-900 text-sm font-medium'
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className='p-10 text-center text-slate-800 font-bold'>
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
