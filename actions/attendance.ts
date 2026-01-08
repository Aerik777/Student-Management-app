'use server';

import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Attendance, { IAttendance } from '@/models/attendance';
import { revalidatePath } from 'next/cache';

/**
 * Handles bulk attendance marking (used in admin/faculty dashboards)
 */
export async function markBulkAttendance(formData: FormData) {
  try {
    await connectDB();

    const dateStr = formData.get('date') as string;
    const subject = formData.get('subject') as string;
    const attendanceDate = new Date(dateStr);

    const operations = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('status-')) {
        const studentId = key.replace('status-', '');

        operations.push({
          updateOne: {
            filter: {
              studentId: new mongoose.Types.ObjectId(studentId), // Fixed to use ObjectId
              date: attendanceDate,
              courseId:
                subject && mongoose.isValidObjectId(subject)
                  ? new mongoose.Types.ObjectId(subject)
                  : undefined,
            },
            update: {
              $set: { status: value as IAttendance['status'] },
            },
            upsert: true,
          },
        });
      }
    }

    if (operations.length > 0) {
      await Attendance.bulkWrite(operations);
    }

    revalidatePath('/admin/attendance');
    revalidatePath('/faculty/attendance');
    return { success: true, message: `Updated ${operations.length} records.` };
  } catch (error) {
    console.error('Bulk Attendance Error:', error);
    return { success: false, error: 'Failed to update attendance.' };
  }
}

/**
 * Handles individual student attendance submission
 */
export async function submitAttendance(
  records: { studentId: string; status: string; markedBy: string }[]
) {
  await connectDB();

  try {
    // Note: We might want to check for duplicates before insertMany or use upsert logic
    const typedRecords = records.map((r) => ({
      ...r,
      studentId: new mongoose.Types.ObjectId(r.studentId),
      status: r.status as IAttendance['status'],
    }));
    await Attendance.insertMany(typedRecords);
    revalidatePath('/faculty/attendance');
    return { success: true };
  } catch (error) {
    console.error('Submit Attendance Error:', error);
    return { success: false, error: 'Failed to save attendance' };
  }
}

export async function updateAttendance(attendanceId: string, status: string) {
  await connectDB();
  await Attendance.findByIdAndUpdate(attendanceId, { status });
  revalidatePath('/admin/attendance');
  revalidatePath('/faculty/attendance');
}
