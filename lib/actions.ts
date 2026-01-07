'use server';
import { connectDB } from "./db";
import Student from "@/models/Student";
import { revalidatePath } from "next/cache";

export async function createStudent(formData: FormData) {
  await connectDB();
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    rollNumber: formData.get('rollNumber') as string,
    department: formData.get('department') as string,
  };
  await Student.create(data);
  revalidatePath('/admin');
}