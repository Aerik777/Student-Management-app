import Attendance from "@/models/Attendance";
import { connectDB } from "./db";

export async function getStudentStats(studentId: string) {
  await connectDB();

  const totalRecords = await Attendance.countDocuments({ studentId });
  const presentRecords = await Attendance.countDocuments({ studentId, status: "Present" });

  const percentage = totalRecords > 0 
    ? Math.round((presentRecords / totalRecords) * 100) 
    : 0;

  return {
    total: totalRecords,
    present: presentRecords,
    absent: totalRecords - presentRecords,
    percentage
  };
}