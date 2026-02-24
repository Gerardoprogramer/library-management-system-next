import { SideNav } from '@/components/dashboard/SideNav';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle  from "@/components/landing/ThemeToggle";

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
<div className="min-h-screen bg-background">
      <SideNav />

      {/* Contenido principal */}
      <div className="ml-64 flex flex-col min-h-screen">

        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar className="w-9 h-9 border border-border">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Children */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}