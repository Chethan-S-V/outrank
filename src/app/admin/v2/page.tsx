import { redirect } from "next/navigation";
import { isServerAdminAuthenticated } from "@/lib/auth/admin";
import { AdminV2Dashboard } from "./admin-v2-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminV2Page() {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  return <AdminV2Dashboard />;
}
