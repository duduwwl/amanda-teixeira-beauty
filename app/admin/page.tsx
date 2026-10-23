import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { chatGPTSignInPath } from "@/app/chatgpt-auth";
import { getAuthorizedAdmin } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { addDays, format } from "date-fns";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administração" };

export default async function AdminPage() {
  const user = await getAuthorizedAdmin();
  if (!user) redirect(chatGPTSignInPath("/admin"));
  const now = new Date();
  return <AdminDashboard displayName={user.displayName} today={format(now,"yyyy-MM-dd")} weekEnd={format(addDays(now,7),"yyyy-MM-dd")} />;
}
