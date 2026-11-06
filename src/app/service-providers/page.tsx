import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ServiceProviders from "@/components/ServiceProviders/ServiceProviders";
import { getServiceCategories, getServiceOfferings, getServiceProviders } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Service Providers",
  description: "Search KardoFix service providers by the home service you need.",
};

type ServiceProvidersPageProps = {
  searchParams: Promise<{ service?: string | string[]; category?: string | string[] }>;
};

function DirectoryFallback() {
  return <div aria-busy="true" aria-label="Loading service providers" />;
}

export default async function ServiceProvidersPage({ searchParams }: ServiceProvidersPageProps) {
  const [params, providers, categories, offerings] = await Promise.all([
    searchParams,
    getServiceProviders(),
    getServiceCategories(),
    getServiceOfferings(),
  ]);
  const serviceParam = params.service;
  const categoryParam = params.category;
  const initialService = Array.isArray(serviceParam) ? serviceParam[0] ?? "" : serviceParam ?? "";
  const initialCategory = Array.isArray(categoryParam) ? categoryParam[0] ?? "" : categoryParam ?? "";

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<DirectoryFallback />}>
          <ServiceProviders
            key={`${initialService}:${initialCategory}`}
            initialService={initialService}
            initialCategory={initialCategory}
            providers={providers}
            categories={categories}
            offerings={offerings}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
