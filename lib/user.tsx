import Attendance from "@/models/Attendance";
import { connectDB } from "@/lib/db";

export async function getStudentStats(studentId: string) {
  await connectDB();

  // Fetch all attendance records for this specific student
  const records = await Attendance.find({ student: studentId }).lean();

  const total = records.length;
  const present = records.filter((r: any) => r.status === "Present").length;
  const absent = total - present;
  
  // Calculate percentage (handle division by zero if no records exist)
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    total,
    present,
    absent,
    percentage,
  };
}