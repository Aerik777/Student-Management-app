'use server';

import connectDB from '@/lib/db';
import User from '@/models/user';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function registerUser(data: any) {
  await connectDB();

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error('User already exists with this email');

  // 2. Hash the password (Never store plain passwords!)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // 3. Create the user
  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
  });

  return { success: true };
}
