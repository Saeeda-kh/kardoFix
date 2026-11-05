import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ServiceGuidePage from "@/components/ServiceGuide/ServiceGuide";
import { serviceGuides, getServiceGuide } from "@/data/serviceGuides";

type ServicePageProps = {
  params: Promise<{ serviceSlug: string }>;
};

export function generateStaticParams() {
  return serviceGuides.map(({ slug }) => ({ serviceSlug: slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const guide = getServiceGuide(serviceSlug);

  if (!guide) return { title: "Service not found" };

  return {
    title: guide.category,
    description: guide.intro,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const guide = getServiceGuide(serviceSlug);

  if (!guide) notFound();

  return (
    <>
      <Header />
      <main><ServiceGuidePage guide={guide} /></main>
      <Footer />
    </>
  );
}