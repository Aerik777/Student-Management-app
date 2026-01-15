import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await User.findById(params.id).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 44 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
