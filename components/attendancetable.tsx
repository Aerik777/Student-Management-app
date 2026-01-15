'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

interface StudentData {
  _id: string;
  name: string;
  rollNumber: string;
  className: string;
  totalPresent: number;
  totalAbsent: number;
}

export default function AttendanceTable({ students }: { students: any[] }) {
  const [statuses, setStatuses] = useState<{ [key: string]: string }>(
    Object.fromEntries(students.map((s) => [s._id.toString(), 'Present']))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StudentData | null;
    direction: 'ascending' | 'descending';
  }>({ key: 'className', direction: 'ascending' });

  const toggleAll = (status: 'Present' | 'Absent') => {
    const updated = { ...statuses };
    students.forEach((s) => (updated[s._id.toString()] = status));
    setStatuses(updated);
  };

  const sortedStudents = useMemo(() => {
    let sortableItems = [...students];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if ((a[sortConfig.key!] || '') < (b[sortConfig.key!] || '')) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if ((a[sortConfig.key!] || '') > (b[sortConfig.key!] || '')) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, sortConfig, searchTerm]);

  const requestSort = (key: keyof StudentData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col md:flex-row justify-between gap-4'>
        <div className='relative max-w-sm w-full'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <input
            type='text'
            placeholder='Search student...'
            className='pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex gap-2 self-end'>
          <button
            type='button'
            onClick={() => toggleAll('Present')}
            className='bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 border border-green-200 text-sm font-semibold transition-colors'
          >
            Mark All Present
          </button>
          <button
            type='button'
            onClick={() => toggleAll('Absent')}
            className='bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 border border-red-200 text-sm font-semibold transition-colors'
          >
            Mark All Absent
          </button>
        </div>
      </div>

      <div className='bg-white border rounded-xl overflow-hidden shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-xs tracking-wider'>
              <tr>
                <th
                  className='p-4 cursor-pointer hover:bg-slate-100'
                  onClick={() => requestSort('rollNumber')}
                >
                  <div className='flex items-center gap-2'>
                    Roll No <ArrowUpDown className='h-3 w-3' />
                  </div>
                </th>
                <th
                  className='p-4 cursor-pointer hover:bg-slate-100'
                  onClick={() => requestSort('name')}
                >
                  <div className='flex items-center gap-2'>
                    Name <ArrowUpDown className='h-3 w-3' />
                  </div>
                </th>
                <th
                  className='p-4 cursor-pointer hover:bg-slate-100'
                  onClick={() => requestSort('className')}
                >
                  <div className='flex items-center gap-2'>
                    Class <ArrowUpDown className='h-3 w-3' />
                  </div>
                </th>
                <th className='p-4 text-center'>History</th>
                <th className='p-4 text-center'>Today's Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {sortedStudents.map((s) => {
                const total = (s.totalPresent || 0) + (s.totalAbsent || 0);
                const percent =
                  total > 0 ? Math.round((s.totalPresent / total) * 100) : 0;

                return (
                  <tr
                    key={s._id}
                    className='hover:bg-slate-50 transition-colors'
                  >
                    <td className='p-4 text-slate-600 font-medium'>
                      {s.rollNumber}
                    </td>
                    <td className='p-4 font-bold text-slate-900'>{s.name}</td>
                    <td className='p-4 text-slate-600'>
                      <span className='bg-slate-100 px-2 py-1 rounded text-xs font-bold border'>
                        {s.className}
                      </span>
                    </td>
                    <td className='p-4 text-center'>
                      <div className='text-xs font-medium'>
                        <span className='text-green-600'>
                          {s.totalPresent} P
                        </span>{' '}
                        /{' '}
                        <span className='text-red-500'>{s.totalAbsent} A</span>
                        <div className='mt-1 text-slate-500'>
                          {percent}% Rate
                        </div>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className='flex justify-center gap-4'>
                        <label className='flex items-center gap-2 cursor-pointer bg-green-50 px-3 py-1.5 rounded-lg border border-transparent has-[:checked]:border-green-500 has-[:checked]:bg-green-100 transition-all'>
                          <input
                            type='radio'
                            name={`status-${s._id}`}
                            value='Present'
                            checked={statuses[s._id.toString()] === 'Present'}
                            onChange={() =>
                              setStatuses({
                                ...statuses,
                                [s._id.toString()]: 'Present',
                              })
                            }
                            className='accent-green-600'
                          />
                          <span className='text-xs font-bold text-green-800'>
                            Present
                          </span>
                        </label>
                        <label className='flex items-center gap-2 cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg border border-transparent has-[:checked]:border-red-500 has-[:checked]:bg-red-100 transition-all'>
                          <input
                            type='radio'
                            name={`status-${s._id}`}
                            value='Absent'
                            checked={statuses[s._id.toString()] === 'Absent'}
                            onChange={() =>
                              setStatuses({
                                ...statuses,
                                [s._id.toString()]: 'Absent',
                              })
                            }
                            className='accent-red-600'
                          />
                          <span className='text-xs font-bold text-red-800'>
                            Absent
                          </span>
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className='p-8 text-center text-slate-500'>
                    No students found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
