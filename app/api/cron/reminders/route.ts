import { NextResponse } from 'next/server';
import { checkAndSendReminders } from '@/lib/email';
import connectDB from '@/lib/db';

export async function GET(request: Request) {
  // Security: Check for a secret key to prevent unauthorized triggers
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await connectDB();
  await checkAndSendReminders();

  return NextResponse.json({ success: true, message: 'Reminders sent' });
}
