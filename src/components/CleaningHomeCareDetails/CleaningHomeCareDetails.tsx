import Image from "next/image";
import Link from "next/link";
import { cleaningServiceNames } from "@/data/serviceProviders";
import styles from "./CleaningHomeCareDetails.module.scss";

const cleaningServices = [
  {
    title: "Home Cleaning",
    description: "A thoughtful clean for everyday rooms, surfaces, and floors.",
    icon: "home",
  },
  {
    title: "Deep Cleaning",
    description: "A detailed top-to-bottom clean for the places that need extra care.",
    icon: "sparkle",
  },
  {
    title: "Kitchen Cleaning",
    description: "Help with countertops, cabinets, appliances, and hard-to-reach areas.",
    icon: "kitchen",
  },
  {
    title: "Bathroom Cleaning",
    description: "Refresh bathroom surfaces, fixtures, tiles, and floors.",
    icon: "bathroom",
  },
  {
    title: "Sofa & Upholstery",
    description: "Care for sofas and upholstered furniture to lift everyday dust and dirt.",
    icon: "sofa",
  },
  {
    title: "Move-in / Move-out Cleaning",
    description: "Prepare a home for its next chapter with a detailed clean.",
    icon: "moving",
  },
] satisfies { title: (typeof cleaningServiceNames)[number]; description: string; icon: string }[];

function CleaningServiceIcon({ name }: { name: string }) {
  const props = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return <svg {...props}><path d="m4 14 12-10 12 10" /><path d="M7.5 12v15h17V12M13 27v-9h6v9" /></svg>;
    case "sparkle":
      return <svg {...props}><path d="m16 3 2.4 8.6L27 14l-8.6 2.4L16 25l-2.4-8.6L5 14l8.6-2.4L16 3Z" /><path d="m26 22 .9 3.1L30 26l-3.1.9L26 30l-.9-3.1L22 26l3.1-.9L26 22Z" /></svg>;
    case "kitchen":
      return <svg {...props}><path d="M5 8h22v18H5zM8 8V5h16v3M5 14h22" /><path d="M10 11v1m5-1v1m5-1v1M9 19h14" /></svg>;
    case "bathroom":
      return <svg {...props}><path d="M6 17h20l-2 7H8l-2-7ZM8 17V9a4 4 0 0 1 8 0v2" /><path d="M16 11h7v4M10 27v1m12-1v1" /></svg>;
    case "sofa":
      return <svg {...props}><path d="M7 17v-5a3 3 0 0 1 6 0v3h6v-3a3 3 0 0 1 6 0v5" /><path d="M5 16a2 2 0 0 0-2 2v5h26v-5a2 2 0 0 0-2-2M7 23v4m18-4v4" /></svg>;
    default:
      return <svg {...props}><path d="M4 10h16v13H4zM20 14h5l3 4v5h-8z" /><circle cx="10" cy="25" r="2" /><circle cx="24" cy="25" r="2" /><path d="M8 14h8m-8 4h5" /></svg>;
  }
}

export default function CleaningHomeCareDetails() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Cleaning &amp; Home Care</span>
          </nav>

          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>KARDOFIX HOME CARE</p>
              <h1>A cleaner home, made easy.</h1>
              <p className={styles.heroDescription}>
                Find reliable help for everyday cleaning and the deeper refresh your home needs.
                Choose a service and tell us what works for you.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#cleaning-services">Explore cleaning services</a>
                <a className={styles.secondaryButton} href="mailto:support@kardofix.com?subject=Cleaning%20and%20Home%20Care">
                  Talk to our team
                </a>
              </div>
              <div className={styles.assurance}>
                <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg></span>
                <p><strong>Care you can count on</strong><small>Support from booking request to service completion</small></p>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.visualGlow} />
              <Image
                src="/home_maid_icon.png"
                alt="Illustration of a home cleaning professional"
                width={620}
                height={620}
                priority
                sizes="(max-width: 700px) 80vw, 42vw"
              />
              <div className={styles.visualNote}>
                <span aria-hidden="true">✦</span>
                <p><strong>Made for your home</strong><small>Cleaning options for every room</small></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection} id="cleaning-services">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>CLEANING &amp; HOME CARE</p>
              <h2>Choose the care your home needs</h2>
            </div>
            <p>From a quick refresh to a detailed clean, find the right kind of help for your space.</p>
          </div>

          <div className={styles.serviceGrid}>
            {cleaningServices.map((service) => (
              <Link
                className={`${styles.serviceCard} ${styles.serviceCardLink}`}
                href={`/service-providers?service=${encodeURIComponent(service.title)}&category=${encodeURIComponent("Cleaning & Home Care")}`}
                key={service.title}
                aria-label={`Find providers for ${service.title}`}
              >
                <span className={styles.serviceIcon}><CleaningServiceIcon name={service.icon} /></span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className={styles.serviceAction}>
                  Find providers <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>SIMPLE FROM START TO FINISH</p>
          <h2>Getting started is easy</h2>
          <div className={styles.steps}>
            <article><span>01</span><h3>Choose a service</h3><p>Pick the cleaning option that best suits your home.</p></article>
            <article><span>02</span><h3>Share your details</h3><p>Tell us about your space and preferred timing.</p></article>
            <article><span>03</span><h3>We’ll help arrange it</h3><p>Our team will follow up to help with your request.</p></article>
          </div>
          <a className={styles.primaryButton} href="mailto:support@kardofix.com?subject=Cleaning%20and%20Home%20Care">
            Request cleaning help
          </a>
        </div>
      </section>
    </div>
  );
}
