import Image from "next/image";
import styles from "./Hero.module.scss";

function LocationIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 17s5-4.5 5-9a5 5 0 1 0-10 0c0 4.5 5 9 5 9Zm0-7.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="12" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="12" width="5" height="5" rx="1" />
      <rect x="12" y="12" width="5" height="5" rx="1" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5.25 7.5 4.75 4.75 4.75-4.75" />
    </svg>
  );
}

const benefits = ["Verified Professionals", "Transparent Pricing", "On-Time Service", "24/7 Support"];

export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Trusted. Verified. At Your Service.</p>
          <h1 id="hero-title">
            Ghar ka har kaam,
            <span>ab hoga aasaan.</span>
          </h1>
          <p className={styles.description}>
            Find trusted and verified professionals for all your home services — fast, easy and reliable.
          </p>

          <ul className={styles.benefits} aria-label="KardoFix benefits">
            {benefits.map((benefit) => (
              <li key={benefit}>
                <span className={styles.check} aria-hidden="true">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <Image
            src="/heros_image_home_page.png"
            alt="KardoFix service professionals"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.heroImage}
          />
        </div>

        <div className={styles.search}>
          <button type="button" className={styles.selectControl}>
            <LocationIcon />
            <span>Lahore</span>
            <ChevronIcon />
          </button>
          <button type="button" className={styles.selectControl}>
            <GridIcon />
            <span>What service do you need?</span>
            <ChevronIcon />
          </button>
          <button type="button" className={styles.searchButton}>
            Find Services
          </button>
        </div>
      </div>
    </section>
  );
}
