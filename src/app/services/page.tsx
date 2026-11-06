import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ServicesCatalog from "@/components/ServicesCatalog/ServicesCatalog";
import { getServiceCategories } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Home Services",
  description: "Explore trusted home and everyday services from verified KardoFix professionals.",
};

export default async function ServicesPage() {
  const serviceCategories = await getServiceCategories();

  return (
    <>
      <Header />
      <main>
        <ServicesCatalog serviceCategories={serviceCategories} />
      </main>
      <Footer />
    </>
  );
}
