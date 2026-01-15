'use server';

import connectDB from '@/lib/db';
import AssignmentAnswer from '@/models/assignmentAnswer';
import AssignmentQuestion from '@/models/assignmentQuestion';
import Attendance from '@/models/attendance';
import User from '@/models/user';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function createStudent(formData: FormData) {
  await connectDB();

  const name = formData.get('name');
  const email = formData.get('email');
  const rollNumber = formData.get('rollNumber');
  // password defaults to rollNumber for now or a default
  const password = rollNumber;

  if (!name || !email || !rollNumber) {
    throw new Error('Missing required fields');
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'STUDENT',
    rollNumber,
    classIds: [], // default to empty
  });

  revalidatePath('/admin/users'); // or wherever
}

export async function submitAssignment(data: any) {
  await connectDB();

  // Check if already exists, if so update it
  const existing = await AssignmentAnswer.findOne({
    studentId: data.studentId,
    questioneid: data.questioneid,
  });

  if (existing) {
    existing.file = data.file;
    existing.status = 'pending'; // Reset status to pending on resubmission
    existing.submitted_at = new Date();
    if (data.remarks) existing.remarks = data.remarks; // Optional update
    await existing.save();
    revalidatePath('/student/assignments');
    return JSON.parse(JSON.stringify(existing));
  } else {
    const submission = await AssignmentAnswer.create(data);
    revalidatePath('/student/assignments');
    return JSON.parse(JSON.stringify(submission));
  }
}

export async function getAssignmentsForStudent(classIds: string[]) {
  await connectDB();
  return await AssignmentQuestion.find({ assigned_class_id: { $in: classIds } })
    .populate('teacherId')
    .lean();
}

export async function getStudentSubmissions(studentId: string) {
  await connectDB();
  return await AssignmentAnswer.find({ studentId })
    .populate('questioneid')
    .lean();
}

export async function getStudentStats(studentId: string) {
  await connectDB();
  const attendance = await Attendance.find({ studentId });
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === 'Present').length;
  const absent = total - present;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);

  return {
    total,
    present,
    absent,
    percentage,
  };
}
