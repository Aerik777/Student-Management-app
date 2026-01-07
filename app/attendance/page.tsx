import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getStudentStats } from "@/lib/user";
import Student from "@/models/Student";
import { connectDB } from "@/lib/db";
import { CheckCircle, XCircle, Clock, Percent } from "lucide-react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure this path is correct

export default async function AttendancePage() {
  // 1. Get the session (passing authOptions is best practice for reliability)
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await connectDB();

  // 2. Fetch student by email (most reliable link between Auth and DB)
  const student = await Student.findOne({ email: session.user.email }).lean();
  
  if (!student) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Student record not found.</h2>
        <p className="text-gray-500">Please contact the administrator to link your account.</p>
      </div>
    );
  }

  const stats = await getStudentStats(student._id.toString());

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Attendance Dashboard</h1>
        <p className="text-gray-500">
          Logged in as: <span className="font-medium text-gray-700">{student.name}</span> | Roll: {student.rollNumber}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Total Classes" 
          value={stats.total} 
          icon={<Clock className="text-blue-500" />} 
        />
        <StatCard 
          label="Present" 
          value={stats.present} 
          icon={<CheckCircle className="text-green-500" />} 
          color="text-green-600"
        />
        <StatCard 
          label="Absent" 
          value={stats.absent} 
          icon={<XCircle className="text-red-500" />} 
          color="text-red-600"
        />
        <StatCard 
          label="Percentage" 
          value={`${stats.percentage}%`} 
          icon={<Percent className="text-purple-500" />} 
          color={stats.percentage < 75 ? "text-red-500" : "text-green-500"}
        />
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white border p-6 rounded-xl shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Course Progress</span>
          <span className="text-sm font-medium text-gray-700">{stats.percentage}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-4 w-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${stats.percentage < 75 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <p className="mt-4 text-sm">
          {stats.percentage < 75 
            ? "⚠️ Warning: Your attendance is below the required 75%. You may be ineligible for exams." 
            : "✅ Status: Your attendance is satisfactory."}
        </p>
      </div>
    </div>
  );
}

// Reusable StatCard Component
function StatCard({ label, value, icon, color = "text-gray-900" }: any) {
  return (
    <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center space-x-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}