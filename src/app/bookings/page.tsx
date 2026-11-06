import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import BookingExperience from "@/components/BookingExperience/BookingExperience";
import { getAuthenticatedAccount } from "@/lib/auth/account";
import { getServiceCategories, getServiceOfferings, getServiceProviders } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Request a Service",
  description: "Create a service request and send it securely to KardoFix.",
};

type BookingsPageProps = {
  searchParams: Promise<{ service?: string | string[]; category?: string | string[]; provider?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const [params, categories, providers, offerings, account] = await Promise.all([
    searchParams,
    getServiceCategories(),
    getServiceProviders(),
    getServiceOfferings(),
    getAuthenticatedAccount(),
  ]);
  if (account.profile?.role === "provider") redirect("/dashboard/provider");
  if (account.user?.app_metadata.role === "admin") redirect("/admin/accounts");

  return (
    <>
      <Header />
      <main><BookingExperience
        initialService={firstParam(params.service)}
        initialCategory={firstParam(params.category)}
        initialProviderId={firstParam(params.provider)}
        categories={categories}
        providers={providers}
        offerings={offerings}
      /></main>
      <Footer />
    </>
  );
}
