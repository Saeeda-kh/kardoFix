import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ServiceGuidePage from "@/components/ServiceGuide/ServiceGuide";
import { getServiceGuide, hasProvidersForCategory } from "@/lib/marketplace";

type ServicePageProps = {
  params: Promise<{ serviceSlug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const guide = await getServiceGuide(serviceSlug);

  if (!guide) return { title: "Service not found" };

  return {
    title: guide.category,
    description: guide.intro,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const guide = await getServiceGuide(serviceSlug);

  if (!guide) notFound();
  const hasProviders = await hasProvidersForCategory(guide.categorySlug);

  return (
    <>
      <Header />
      <main><ServiceGuidePage guide={guide} hasProviders={hasProviders} /></main>
      <Footer />
    </>
  );
}