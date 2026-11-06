import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { getAuthenticatedAccount } from "@/lib/auth/account";
import AccountChoice from "./AccountChoice";

export default async function AccountChoiceRoute({ mode }: { mode: "login" | "register" }) {
  const { user, profile } = await getAuthenticatedAccount();
  if (user?.app_metadata.role === "admin") redirect("/admin/accounts");
  if (user && profile) redirect(`/dashboard/${profile.role}`);

  return (
    <>
      <Header />
      <AccountChoice mode={mode} />
      <Footer />
    </>
  );
}
