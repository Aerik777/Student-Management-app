'use server';

import connectDB from '@/lib/db';
import AssignmentQuestion from '@/models/assignmentQuestion';
import AssignmentAnswer from '@/models/assignmentAnswer';
import User from '@/models/user';
import { revalidatePath } from 'next/cache';

export async function createAssignment(data: any) {
  await connectDB();
  try {
    const newAssignment = await AssignmentQuestion.create(data);
    revalidatePath('/faculty/assignments');
    return JSON.parse(JSON.stringify(newAssignment));
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getFacultyStats(teacherId: string) {
  await connectDB();
  const Assignment = (await import('@/models/assignmentQuestion')).default;
  const Message = (await import('@/models/message')).default;
  const Class = (await import('@/models/class')).default;
  const User = (await import('@/models/user')).default;

  // Count classes assigned to this teacher
  const classCount = await Class.countDocuments({
    _id: { $in: (await User.findById(teacherId))?.classIds || [] },
  });

  const assignmentCount = await Assignment.countDocuments({ teacherId });

  const unreadMessages = await Message.countDocuments({
    receiverId: teacherId,
    read: false,
  });

  return {
    classes: classCount || 0,
    assignments: assignmentCount || 0,
    messages: unreadMessages || 0,
  };
}

export async function getAssignmentsByTeacher(teacherId: string) {
  await connectDB();
  return await AssignmentQuestion.find({ teacherId })
    .populate('assigned_class_id')
    .lean();
}

export async function getSubmissions(assignmentId: string) {
  await connectDB();
  return await AssignmentAnswer.find({ questioneid: assignmentId })
    .populate('studentId')
    .lean();
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
  remarks?: string
) {
  await connectDB();
  await AssignmentAnswer.findByIdAndUpdate(id, { status, remarks });
  revalidatePath('/faculty/assignments');
}

export async function getClassesForTeacher(teacherId: string) {
  await connectDB();
  const teacher = await User.findById(teacherId).populate('classIds').lean();
  /* 
     Ideally we trust classIds. 
     If classIds is just IDs, populate will make them objects. 
     We return the array.
  */
  return JSON.parse(JSON.stringify(teacher?.classIds || []));
}
