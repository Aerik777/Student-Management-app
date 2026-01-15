import DashboardShell from '@/components/dashboard-shell';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <DashboardShell
      role='FACULTY'
      title='Faculty Hub'
      userName={session?.user?.name || undefined}
    >
      {children}
    </DashboardShell>
  );
}
