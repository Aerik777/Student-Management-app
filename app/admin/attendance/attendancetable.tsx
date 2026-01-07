"use client";

import { useRef } from "react";

export default function AttendanceTable({ students }: { students: any[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const markAllPresent = () => {
    if (!formRef.current) return;
    // Find all radio inputs with the value ending in ":Present" and check them
    const inputs = formRef.current.querySelectorAll('input[value$=":Present"]');
    inputs.forEach((input: any) => (input.checked = true));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={markAllPresent}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full transition-colors"
        >
          Check All Present
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Roll No</th>
              <th className="p-4">Name</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm">{s.rollNumber}</td>
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4 flex justify-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      value={`${s._id}:Present`}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm group-hover:text-green-600">Present</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      value={`${s._id}:Absent`}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm group-hover:text-red-600">Absent</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}