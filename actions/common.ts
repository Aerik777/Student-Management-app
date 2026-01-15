'use server';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { revalidatePath } from 'next/cache';

export async function getStudents(query: string = '', classId: string = '') {
  await connectDB();
  const filter: any = { role: 'STUDENT' };
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { rollNumber: { $regex: query, $options: 'i' } },
    ];
  }
  if (classId) {
    filter.classIds = classId;
  }
  return await User.find(filter).populate('classIds').sort({ name: 1 }).lean();
}
