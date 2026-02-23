import { SideNav } from '@/components/SideNav';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <SideNav />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}