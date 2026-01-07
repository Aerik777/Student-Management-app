import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStudentStats } from "@/lib/student-stats";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  // In a real app, link the User ID to the Student ID
  const stats = await getStudentStats(session?.user?.id as string);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome, {session?.user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Percentage Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Overall Attendance</h3>
          
          {/* Visual Progress Ring */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-200 stroke-current"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 stroke-current"
                strokeWidth="3"
                strokeDasharray={`${stats.percentage}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{stats.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Numeric Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <p className="text-indigo-600 text-sm font-bold uppercase">Total Classes</p>
            <p className="text-4xl font-bold text-indigo-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <p className="text-green-600 text-sm font-bold uppercase">Days Present</p>
            <p className="text-4xl font-bold text-green-900">{stats.present}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 col-span-2">
            <p className="text-red-600 text-sm font-bold uppercase">Days Absent</p>
            <p className="text-4xl font-bold text-red-900">{stats.absent}</p>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Your Courses</h2>
        <div className="bg-white border rounded-lg p-4 text-center text-gray-500 italic">
          No courses assigned yet.
        </div>
      </section>
    </div>
  );
}