import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as any).role !== "CLIENT") redirect("/login");

  return (
    <DashboardLayout userRole="CLIENT" userName={session.user.name || "Клиент"}>
      {children}
    </DashboardLayout>
  );
}
