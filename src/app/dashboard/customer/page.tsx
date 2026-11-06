import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import CustomerDashboard from "@/components/AccountDashboards/CustomerDashboard";
import { requireAccount } from "@/lib/auth/account";

export const metadata: Metadata = {
  title: "Customer Account",
  robots: { index: false, follow: false },
};

export default async function CustomerDashboardPage() {
  const { profile } = await requireAccount("customer");
  return (
    <>
      <Header />
      <CustomerDashboard profile={profile} />
      <Footer />
    </>
  );
}
