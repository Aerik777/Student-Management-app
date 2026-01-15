'use client';

import { useState } from 'react';
import { submitAttendance } from '@/actions/attendance';

interface StudentProps {
  id: string;
  name: string;
  rollNumber: string;
}

export default function AttendanceList({
  students,
  facultyId,
}: {
  students: (StudentProps & { initialStatus?: string })[];
  facultyId: string;
}) {
  // Local state to track attendance selections
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>(
    Object.fromEntries(
      students.map((s) => [s.id, s.initialStatus || 'Present'])
    )
  );

  const toggleStatus = (id: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSave = async () => {
    const records = students.map((s) => ({
      studentId: s.id,
      status: attendanceMap[s.id],
      markedBy: facultyId,
      date: new Date(),
    }));

    const result = await submitAttendance(records);
    if (result.success) alert('Attendance marked successfully!');
  };

  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
      <table className='w-full text-left'>
        <thead className='bg-slate-100 border-b border-slate-300'>
          <tr>
            <th className='p-4 font-bold text-slate-900'>Roll No</th>
            <th className='p-4 font-bold text-slate-900'>Student Name</th>
            <th className='p-4 font-bold text-slate-900'>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className='border-b hover:bg-gray-50'>
              <td className='p-4 text-slate-800 font-medium'>
                {student.rollNumber}
              </td>
              <td className='p-4 font-bold text-slate-900'>{student.name}</td>
              <td className='p-4'>
                <button
                  onClick={() => toggleStatus(student.id)}
                  className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                    attendanceMap[student.id] === 'Present'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {attendanceMap[student.id]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='p-4 bg-gray-50 text-right'>
        <button
          onClick={handleSave}
          className='bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700'
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}
