import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import BookingExperience from "@/components/BookingExperience/BookingExperience";

export const metadata: Metadata = {
  title: "Request a Service",
  description: "Create a service request and review it before emailing KardoFix.",
};

type BookingsPageProps = {
  searchParams: Promise<{ service?: string | string[]; category?: string | string[]; provider?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main><BookingExperience
        initialService={firstParam(params.service)}
        initialCategory={firstParam(params.category)}
        initialProviderId={firstParam(params.provider)}
      /></main>
      <Footer />
    </>
  );
}
