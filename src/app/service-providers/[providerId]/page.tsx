import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ProviderProfile from "@/components/ProviderProfile/ProviderProfile";
import { serviceProviders } from "@/data/serviceProviders";

type ProviderPageProps = {
  params: Promise<{ providerId: string }>;
};

export const metadata: Metadata = {
  title: "Service Provider Profile",
  description: "View provider services, experience, sample reviews, and booking information on KardoFix.",
};

export function generateStaticParams() {
  return serviceProviders.map(({ id }) => ({ providerId: id }));
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { providerId } = await params;
  const provider = serviceProviders.find((item) => item.id === providerId);

  if (!provider) notFound();

  return (
    <>
      <Header />
      <main><ProviderProfile provider={provider} /></main>
      <Footer />
    </>
  );
}