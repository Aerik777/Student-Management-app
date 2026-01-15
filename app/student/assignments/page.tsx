import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user';
import StudentAssignmentsList from '@/components/StudentAssignmentsList';

export default async function StudentAssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  await connectDB();
  const userId = (session.user as any).id;
  const user = await User.findById(userId);

  return (
    <StudentAssignmentsList
      studentId={userId}
      classIds={user?.classIds?.map((id: any) => id.toString()) || []}
    />
  );
}
