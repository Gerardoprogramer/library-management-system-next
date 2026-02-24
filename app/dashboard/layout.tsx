
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardShell from "@/app/dashboard/DashboardShell";


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

return <DashboardShell>{children}</DashboardShell>;
}