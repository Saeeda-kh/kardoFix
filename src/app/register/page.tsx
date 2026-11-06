import type { Metadata } from "next";
import AccountChoiceRoute from "@/components/AccountAccess/AccountChoiceRoute";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Choose a customer or service provider account for KardoFix.",
};

export default function RegisterPage() {
  return <AccountChoiceRoute mode="register" />;
}
