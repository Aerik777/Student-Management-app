import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';
import User from '@/models/user';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  const hashedPassword = await bcrypt.hash('admin123', 12);

  await User.create({
    name: 'System Admin',
    email: 'admin@college.com',
    password: hashedPassword,
    role: 'ADMIN',
  });

  return NextResponse.json({ message: 'Admin Created' });
}
