'use client';

import { useState, useEffect } from 'react';
import { getTeacherStudents, getStudentGradeStats } from '@/actions/faculty';
import {
  Users,
  Search,
  PieChart as PieChartIcon,
  TrendingUp,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#f87171', '#fbbf24', '#34d399', '#6366f1'];

export default function FacultyDashboardClient({
  teacherId,
}: {
  teacherId: string;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [gradeData, setGradeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getTeacherStudents(teacherId);
    setStudents(data);
    setLoading(false);
  };

  const handleSelectStudent = async (student: any) => {
    setSelectedStudent(student);
    const stats = await getStudentGradeStats(student._id);
    setGradeData(stats);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='mt-10 space-y-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Student Data Table */}
        <div className='lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
          <div className='p-6 border-b border-slate-50 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-indigo-50 p-2 rounded-xl'>
                <Users className='h-5 w-5 text-indigo-600' />
              </div>
              <h2 className='text-xl font-bold text-slate-900'>My Students</h2>
            </div>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <input
                type='text'
                placeholder='Search students...'
                className='pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 transition-all font-medium placeholder:text-slate-400'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className='overflow-x-auto'>
            {loading ? (
              <div className='p-10 text-center animate-pulse text-slate-400 font-bold'>
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className='p-10 text-center text-slate-500 font-bold'>
                No students found.
              </div>
            ) : (
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50/50'>
                    <th className='p-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='p-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Roll No
                    </th>
                    <th className='p-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Classes
                    </th>
                    <th className='p-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-50'>
                  {filteredStudents.map((s) => (
                    <tr
                      key={s._id}
                      className={`hover:bg-indigo-50/30 transition-colors cursor-pointer ${selectedStudent?._id === s._id ? 'bg-indigo-50/50' : ''}`}
                      onClick={() => handleSelectStudent(s)}
                    >
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 uppercase'>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className='font-bold text-slate-900 text-sm'>
                              {s.name}
                            </p>
                            <p className='text-xs text-slate-500 truncate max-w-[150px]'>
                              {s.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 text-sm font-bold text-slate-600'>
                        {s.rollNumber || 'N/A'}
                      </td>
                      <td className='p-4'>
                        <div className='flex flex-wrap gap-1'>
                          {s.classIds?.map((c: any) => (
                            <span
                              key={c._id}
                              className='px-2 py-0.5 bg-slate-100 text-[10px] font-bold rounded-full text-slate-600'
                            >
                              {c.grade}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className='p-4'>
                        <button className='text-xs font-bold text-indigo-600 hover:underline'>
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Grade Analysis Pie Chart */}
        <div className='bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='bg-amber-50 p-2 rounded-xl'>
              <PieChartIcon className='h-5 w-5 text-amber-600' />
            </div>
            <h2 className='text-xl font-bold text-slate-900'>Grade Analysis</h2>
          </div>

          {!selectedStudent ? (
            <div className='flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200'>
              <TrendingUp className='h-10 w-10 text-slate-300 mb-4' />
              <p className='text-slate-500 font-bold'>
                Select a student from the table to view their performance
                analysis.
              </p>
            </div>
          ) : gradeData.length === 0 ? (
            <div className='flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl'>
              <p className='text-slate-500 font-bold'>
                No graded assignments found for {selectedStudent.name}.
              </p>
            </div>
          ) : (
            <>
              <div className='mb-6'>
                <h3 className='font-bold text-slate-900'>
                  {selectedStudent.name}
                </h3>
                <p className='text-xs text-slate-500'>
                  Score Distribution Index
                </p>
              </div>
              <div className='h-[250px] w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={gradeData}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey='value'
                    >
                      {gradeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className='mt-8 space-y-3'>
                <div className='p-3 bg-slate-50 rounded-2xl flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4 text-indigo-600' />
                    <span className='text-xs font-bold text-slate-600'>
                      Average Performance
                    </span>
                  </div>
                  <span className='text-sm font-extrabold text-slate-900'>
                    {Math.round(
                      gradeData.reduce(
                        (acc, curr, idx) => acc + curr.value * (idx * 25 + 20),
                        0,
                      ) / gradeData.reduce((acc, curr) => acc + curr.value, 0),
                    )}
                    %
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
