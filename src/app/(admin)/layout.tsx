import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as any).role !== "ADMIN") redirect("/login");

  return (
    <DashboardLayout userRole="ADMIN" userName={session.user.name || "Администратор"}>
      {children}
    </DashboardLayout>
  );
}
