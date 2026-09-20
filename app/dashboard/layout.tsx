import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell from "@/app/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  if (!accessToken && !refreshToken) {
    redirect("/auth/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
