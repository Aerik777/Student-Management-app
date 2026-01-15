import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProfileView from '@/components/profile-view';
import User from '@/models/user';
import connectDB from '@/lib/db';

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const userData = await User.findById((session?.user as any).id);

  return (
    <div className='h-full'>
      <ProfileView user={JSON.parse(JSON.stringify(userData))} />
    </div>
  );
}
