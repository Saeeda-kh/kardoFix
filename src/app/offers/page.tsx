import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import InfoPage from "@/components/InfoPage/InfoPage";

export const metadata: Metadata = {
  title: "Offers",
  description: "Ask KardoFix about current home service offers.",
};

export default function OffersPage() {
  return (
    <>
      <Header />
      <main>
        <InfoPage
          eyebrow="KARDOFIX OFFERS"
          title="A little extra care for your home."
          description="Our offers page is being prepared. Browse our services or get in touch with the team to ask about current promotions."
          primaryLabel="Browse services"
          primaryHref="/services"
          secondaryLabel="Ask about offers"
          secondaryHref="mailto:support@kardofix.com?subject=Current%20offers"
        />
      </main>
      <Footer />
    </>
  );
}
