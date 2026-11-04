import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ServiceProviders from "@/components/ServiceProviders/ServiceProviders";

export const metadata: Metadata = {
  title: "Service Providers",
  description: "Search KardoFix service providers by the home service you need.",
};

type ServiceProvidersPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

function DirectoryFallback() {
  return <div aria-busy="true" aria-label="Loading service providers" />;
}

export default async function ServiceProvidersPage({ searchParams }: ServiceProvidersPageProps) {
  const serviceParam = (await searchParams).service;
  const initialService = Array.isArray(serviceParam) ? serviceParam[0] ?? "" : serviceParam ?? "";

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<DirectoryFallback />}>
          <ServiceProviders key={initialService} initialService={initialService} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
