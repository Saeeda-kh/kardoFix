import { getServiceCategories } from "@/lib/marketplace";
import { getAuthenticatedAccount } from "@/lib/auth/account";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [categories, account] = await Promise.all([
    getServiceCategories(),
    getAuthenticatedAccount(),
  ]);
  const accountRole = account.user?.app_metadata.role === "admin"
    ? "admin"
    : account.profile?.role ?? null;
  return <HeaderClient categories={categories} initialAccountRole={accountRole} />;
}
