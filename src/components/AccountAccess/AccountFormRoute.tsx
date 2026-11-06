import { notFound, redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { getAuthenticatedAccount, type AccountRole } from "@/lib/auth/account";
import AccountAccessForm from "./AccountAccessForm";

type AccountFormRouteProps = {
  mode: "login" | "register";
  params: Promise<{ accountType: string }>;
};

export default async function AccountFormRoute({ mode, params }: AccountFormRouteProps) {
  const { accountType } = await params;
  if (accountType !== "customer" && accountType !== "provider") notFound();

  const role: AccountRole = accountType;
  const { user, profile } = await getAuthenticatedAccount();
  if (user?.app_metadata.role === "admin") redirect("/admin/accounts");
  if (user && profile) redirect(`/dashboard/${profile.role}`);

  return (
    <>
      <Header />
      <AccountAccessForm mode={mode} role={role} />
      <Footer />
    </>
  );
}
