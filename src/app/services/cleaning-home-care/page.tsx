import type { Metadata } from "next";
import CleaningHomeCareDetails from "@/components/CleaningHomeCareDetails/CleaningHomeCareDetails";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
  title: "Cleaning & Home Care",
  description: "Explore home cleaning, deep cleaning, kitchen, bathroom, and upholstery care services from KardoFix.",
};

export default function CleaningHomeCarePage() {
  return (
    <>
      <Header />
      <main>
        <CleaningHomeCareDetails />
      </main>
      <Footer />
    </>
  );
}
