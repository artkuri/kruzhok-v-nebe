import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "TEACHER" && role !== "ADMIN") redirect("/login");

  return (
    <DashboardLayout userRole="TEACHER" userName={session.user.name || "Педагог"}>
      {children}
    </DashboardLayout>
  );
}
