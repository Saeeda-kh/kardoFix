import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import InfoPage from "@/components/InfoPage/InfoPage";

export const metadata: Metadata = {
  title: "Help",
  description: "Contact KardoFix support for help with home services.",
};

export default function HelpPage() {
  return (
    <>
      <Header />
      <main>
        <InfoPage
          eyebrow="HERE TO HELP"
          title="How can we help?"
          description="Need help choosing a service or have a question about your request? Our support team is ready to hear from you."
          primaryLabel="Email support"
          primaryHref="mailto:support@kardofix.com"
          secondaryLabel="Explore services"
          secondaryHref="/services"
        />
      </main>
      <Footer />
    </>
  );
}
