import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import HomeSections from "@/components/HomeSections/HomeSections";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HomeSections />
      </main>
      <Footer />
    </>
  );
}