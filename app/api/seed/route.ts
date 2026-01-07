import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();
  const hashedPassword = await bcrypt.hash("admin123", 12);
  
  await User.create({
    name: "System Admin",
    email: "admin@college.com",
    password: hashedPassword,
    role: "ADMIN",
  });

  return NextResponse.json({ message: "Admin Created" });
}