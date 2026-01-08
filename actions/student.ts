'use server';

import Attendance from '@/models/attendance';
import connectDB from '@/lib/db';
import Student from '@/models/student';
import { revalidatePath } from 'next/cache';

export async function getStudentStats(studentId: string) {
  await connectDB();

  // Ensuring we use studentId as defined in our updated model
  const totalRecords = await Attendance.countDocuments({ studentId });
  const presentRecords = await Attendance.countDocuments({
    studentId,
    status: 'Present',
  });

  const percentage =
    totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  return {
    total: totalRecords,
    present: presentRecords,
    absent: totalRecords - presentRecords,
    percentage,
  };
}

export async function createStudent(formData: FormData) {
  await connectDB();
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    rollNumber: formData.get('rollNumber') as string,
    department: formData.get('department') as string,
  };
  await Student.create(data);
  revalidatePath('/admin/student');
}
