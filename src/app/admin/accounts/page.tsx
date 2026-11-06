import type { Metadata } from "next";
import AdminProviderAccounts from "@/components/AdminProviderAccounts/AdminProviderAccounts";
import Header from "@/components/Header/Header";
import { requireAdminAccount } from "@/lib/auth/account";

export const metadata: Metadata = {
  title: "Provider Applications | KardoFix Staff",
  robots: { index: false, follow: false },
};

export default async function AdminProviderAccountsPage() {
  await requireAdminAccount();
  return (
    <>
      <Header />
      <AdminProviderAccounts />
    </>
  );
}
