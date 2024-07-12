import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/validate-request";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/sign-in");
  }
  if (user.role !== "admin") {
    return redirect("/");
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block bg-white">
        <AdminSidebar />
      </div>
      <div className="flex flex-col">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}
