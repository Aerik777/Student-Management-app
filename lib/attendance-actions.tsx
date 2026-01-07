'use server';

import { connectDB } from "./db";
import Attendance from "@/models/Attendance";
import { revalidatePath } from "next/cache";

export async function submitAttendance(records: { studentId: string; status: string; markedBy: string }[]) {
  await connectDB();
  
  // Optional: Add logic to prevent duplicate attendance for the same day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await Attendance.insertMany(records);
    revalidatePath('/faculty/attendance');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to save attendance" };
  }
}