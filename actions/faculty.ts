'use server';

import connectDB from '@/lib/db';
import AssignmentQuestion from '@/models/assignmentQuestion';
import AssignmentAnswer from '@/models/assignmentAnswer';
import User from '@/models/user';
import StudyMaterial from '@/models/studyMaterial';
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
  remarks?: string,
  grade?: number
) {
  await connectDB();
  await AssignmentAnswer.findByIdAndUpdate(id, { status, remarks, grade });
  revalidatePath('/faculty/assignments');
}

export async function getClassesForTeacher(teacherId: string) {
  await connectDB();
  const teacher = await User.findById(teacherId).populate('classIds').lean();
  return JSON.parse(JSON.stringify(teacher?.classIds || []));
}

export async function uploadStudyMaterial(data: any) {
  await connectDB();
  try {
    const newMaterial = await StudyMaterial.create(data);
    revalidatePath('/faculty/study-material');
    return JSON.parse(JSON.stringify(newMaterial));
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getStudyMaterialsByTeacher(teacherId: string) {
  await connectDB();
  return await StudyMaterial.find({ teacherId }).populate('classId').lean();
}

export async function deleteStudyMaterial(id: string) {
  await connectDB();
  await StudyMaterial.findByIdAndDelete(id);
  revalidatePath('/faculty/study-material');
}

export async function getTeacherStudents(teacherId: string) {
  await connectDB();
  const teacher = await User.findById(teacherId).lean();
  if (!teacher || !teacher.classIds) return [];

  // Find all students who are in any of the classes the teacher teaches
  const students = await User.find({
    role: 'STUDENT',
    classIds: { $in: teacher.classIds },
  })
    .populate('classIds')
    .lean();

  return JSON.parse(JSON.stringify(students));
}

export async function getStudentGradeStats(studentId: string) {
  await connectDB();
  const answers = await AssignmentAnswer.find({
    studentId,
    status: 'accepted',
    grade: { $exists: true },
  }).lean();

  if (answers.length === 0) return [];

  // Group by some category or just return all for a simple chart
  // For a pie chart, maybe we show ranges? Or status? 
  // The user asked for "average assignment grades from the selected student".
  // A pie chart of "Average Grade" doesn't make sense (it's one number).
  // Maybe they mean a pie chart of grade distribution for that student (e.g. A, B, C or ranges).
  // Let's do ranges: 0-40, 41-60, 61-80, 81-100.

  const ranges = [
    { name: '0-40', value: 0 },
    { name: '41-60', value: 0 },
    { name: '61-80', value: 0 },
    { name: '81-100', value: 0 },
  ];

  answers.forEach((ans: any) => {
    if (ans.grade <= 40) ranges[0].value++;
    else if (ans.grade <= 60) ranges[1].value++;
    else if (ans.grade <= 80) ranges[2].value++;
    else ranges[3].value++;
  });

  return ranges;
}
