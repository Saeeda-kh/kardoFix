import type { Metadata } from "next";
import AccountFormRoute from "@/components/AccountAccess/AccountFormRoute";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create your KardoFix customer or service provider account.",
};

export default function RegisterAccountPage({ params }: { params: Promise<{ accountType: string }> }) {
  return <AccountFormRoute mode="register" params={params} />;
}
