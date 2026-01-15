import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ChatComponent from '@/components/Chat';

export default async function StudentMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please log in</div>;

  const userId = (session.user as any).id;

  return (
    <div className='h-full'>
      <h1 className='text-2xl font-bold mb-6 text-slate-950'>Messages</h1>
      <ChatComponent userId={userId} />
    </div>
  );
}
