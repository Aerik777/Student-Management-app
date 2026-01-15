'use server';

import connectDB from '@/lib/db';
import User from '@/models/user';
import Class from '@/models/class';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function getUsers(filters?: {
  name?: string;
  role?: string;
  classId?: string;
}) {
  await connectDB();
  const query: any = {};

  if (filters?.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }
  if (filters?.role) {
    query.role = filters.role;
  }
  if (filters?.classId) {
    query.classIds = filters.classId;
  }

  return await User.find(query)
    .populate({ path: 'classIds', strictPopulate: false })
    .lean();
}

export async function createUser(data: any) {
  await connectDB();
  const {
    name,
    email,
    password,
    role,
    contact_no,
    address,
    classIds,
    rollNumber,
    qualification,
  } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    contact_no,
    address,
    classIds: classIds || [],
    rollNumber,
    qualification,
  });

  revalidatePath('/admin/users');
  return JSON.parse(JSON.stringify(user));
}

export async function updateUser(id: string, data: any) {
  await connectDB();
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/admin/users');
  return JSON.parse(JSON.stringify(user));
}

export async function deleteUser(id: string) {
  await connectDB();
  await User.findByIdAndDelete(id);
  revalidatePath('/admin/users');
  return { success: true };
}

export async function getClasses() {
  await connectDB();
  return await Class.find({}).lean();
}

export async function createClass(grade: string) {
  await connectDB();
  const newClass = await Class.create({ grade });
  revalidatePath('/admin/classes'); // Assuming we might have a classes page
  return JSON.parse(JSON.stringify(newClass));
}
