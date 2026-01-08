'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest version
});

export async function createCheckoutSession(studentId: string, amount: number) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Semester Tuition Fees',
            description: `Payment for Student ID: ${studentId}`,
          },
          unit_amount: amount * 100, // Stripe uses cents (e.g., $1000 = 100000)
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/student/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/student/fees`,
    metadata: {
      studentId: studentId, // This helps you identify the user later
    },
  });

  redirect(session.url!);
}