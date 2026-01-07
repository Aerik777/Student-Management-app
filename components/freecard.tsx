"use client";

import { createCheckoutSession } from "@/lib/payment-actions";

export default function FeeCard({ studentId, amount }: { studentId: string, amount: number }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-sm">
      <h3 className="text-lg font-bold text-gray-800">Semester Fees</h3>
      <p className="text-3xl font-bold text-indigo-600 my-2">${amount}</p>
      <p className="text-sm text-gray-500 mb-6">Due Date: 15th Jan 2026</p>
      
      <button 
        onClick={() => createCheckoutSession(studentId, amount)}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
      >
        Pay Now with Stripe
      </button>
    </div>
  );
}