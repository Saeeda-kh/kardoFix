import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ServicesCatalog from "@/components/ServicesCatalog/ServicesCatalog";

export const metadata: Metadata = {
  title: "Home Services",
  description: "Explore trusted home and everyday services from verified KardoFix professionals.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <ServicesCatalog />
      </main>
      <Footer />
    </>
  );
}
