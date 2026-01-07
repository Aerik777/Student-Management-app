"use server";

import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { revalidatePath } from "next/cache";

export async function markBulkAttendance(formData: FormData) {
  try {
    await connectDB();

    const dateStr = formData.get("date") as string;
    const subject = formData.get("subject") as string;
    const attendanceDate = new Date(dateStr);

    const operations = [];

    // Use the "status-" prefix logic to extract student IDs and values
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("status-")) {
        const studentId = key.replace("status-", "");

        operations.push({
          updateOne: {
            filter: { 
              student: studentId, 
              date: attendanceDate, 
              subject: subject 
            },
            update: { 
              $set: { status: value } 
            },
            upsert: true, // Creates a new record if one doesn't exist
          },
        });
      }
    }

    if (operations.length > 0) {
      await Attendance.bulkWrite(operations);
    }

    revalidatePath("/admin/attendance");
    return { success: true, message: `Updated ${operations.length} records.` };
    
  } catch (error) {
    console.error("Bulk Attendance Error:", error);
    return { success: false, error: "Failed to update attendance." };
  }
}