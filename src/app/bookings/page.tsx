import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import InfoPage from "@/components/InfoPage/InfoPage";

export const metadata: Metadata = {
  title: "Bookings",
  description: "Get help arranging a home service with KardoFix.",
};

export default function BookingsPage() {
  return (
    <>
      <Header />
      <main>
        <InfoPage
          eyebrow="BOOKINGS"
          title="Your service bookings, made simple."
          description="Online booking management is not available yet. Browse our services or contact our team for help arranging a visit."
          primaryLabel="Explore services"
          primaryHref="/services"
          secondaryLabel="Contact support"
          secondaryHref="mailto:support@kardofix.com?subject=Booking%20help"
        />
      </main>
      <Footer />
    </>
  );
}
