import type { Metadata } from "next";
import AccountFormRoute from "@/components/AccountAccess/AccountFormRoute";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your KardoFix customer or service provider account.",
};

export default function LoginAccountPage({ params }: { params: Promise<{ accountType: string }> }) {
  return <AccountFormRoute mode="login" params={params} />;
}
