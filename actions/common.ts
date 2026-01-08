'use server';
import connectDB from '@/lib/db';
import Student from '@/models/student';
import { revalidatePath } from 'next/cache';

export async function getStudents(query: string = '', dept: string = '') {
  await connectDB();
  const filter: any = {};
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { rollNumber: { $regex: query, $options: 'i' } },
    ];
  }
  if (dept) {
    filter.department = dept;
  }
  return await Student.find(filter).sort({ rollNumber: 1 }).lean();
}
