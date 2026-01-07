"use client";

import { useState } from "react";

export default function AttendanceTable({ students }: { students: any[] }) {
  // Local state to track changes before submission
  const [statuses, setStatuses] = useState<{ [key: string]: string }>(
    Object.fromEntries(students.map((s) => [s._id.toString(), "Present"]))
  );

  const toggleAll = (status: "Present" | "Absent") => {
    const updated = { ...statuses };
    students.forEach((s) => (updated[s._id.toString()] = status));
    setStatuses(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => toggleAll("Present")}
          className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-green-100 border"
        >
          Mark All Present
        </button>
        <button
          type="button"
          onClick={() => toggleAll("Absent")}
          className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-red-100 border"
        >
          Mark All Absent
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Roll No</th>
              <th className="p-4">Name</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id.toString()} className="border-b">
                <td className="p-4">{s.rollNumber}</td>
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`status-${s._id}`}
                        value="Present"
                        checked={statuses[s._id.toString()] === "Present"}
                        onChange={() =>
                          setStatuses({ ...statuses, [s._id.toString()]: "Present" })
                        }
                      />
                      Present
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`status-${s._id}`}
                        value="Absent"
                        checked={statuses[s._id.toString()] === "Absent"}
                        onChange={() =>
                          setStatuses({ ...statuses, [s._id.toString()]: "Absent" })
                        }
                      />
                      Absent
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}