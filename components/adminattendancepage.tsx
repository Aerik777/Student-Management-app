import AttendanceTable from "./AttendanceTable"; // Path to your file

// ... inside your AdminAttendancePage function ...
<form action={markBulkAttendance} className="space-y-6">
  {/* Inputs for Date and Subject */}
  <div className="flex gap-4 mb-4">
     <input type="date" name="date" required className="border p-2 rounded" defaultValue={new Date().toISOString().split('T')[0]} />
     <input type="text" name="subject" placeholder="Subject Name" required className="border p-2 rounded flex-1" />
  </div>

  {/* Pass the students data to the Client Component */}
  <AttendanceTable students={students} />

  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
    Save Attendance
  </button>
</form>