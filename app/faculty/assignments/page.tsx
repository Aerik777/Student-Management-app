import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import FacultyAssignmentsClient from '@/components/FacultyAssignmentsClient';

export default async function FacultyAssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  const userId = (session.user as any).id;

  return <FacultyAssignmentsClient teacherId={userId} />;
}
