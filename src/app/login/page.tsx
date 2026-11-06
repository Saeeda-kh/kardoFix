import type { Metadata } from "next";
import AccountChoiceRoute from "@/components/AccountAccess/AccountChoiceRoute";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your KardoFix customer or service provider account.",
};

export default function LoginPage() {
  return <AccountChoiceRoute mode="login" />;
}
