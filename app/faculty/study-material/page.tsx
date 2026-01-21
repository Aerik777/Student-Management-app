import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import StudyMaterialClient from '@/components/StudyMaterialClient';

export default async function FacultyStudyMaterialPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  const teacherId = (session.user as any).id;

  return <StudyMaterialClient teacherId={teacherId} isTeacher={true} />;
}
