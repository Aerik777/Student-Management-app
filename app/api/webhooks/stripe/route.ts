import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/db';
import User from '@/models/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  await connectDB();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const studentId = session.metadata?.studentId;

    if (studentId) {
      // Update student fee status or user status
      await User.findByIdAndUpdate(studentId, { isFeesPaid: true });
    }
  }

  return NextResponse.json({ received: true });
}
