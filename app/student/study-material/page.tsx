import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import StudyMaterialClient from '@/components/StudyMaterialClient';
import User from '@/models/user';
import connectDB from '@/lib/db';

export default async function StudentStudyMaterialPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  await connectDB();
  const student = await User.findById((session.user as any).id);
  const classIds = student?.classIds?.map((id: any) => id.toString()) || [];

  return <StudyMaterialClient isTeacher={false} studentClassIds={classIds} />;
}
