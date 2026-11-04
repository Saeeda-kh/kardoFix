import Image from "next/image";
import styles from "./Hero.module.scss";

const benefits = ["Verified Professionals", "Transparent Pricing", "On-Time Service", "24/7 Support"];

const bookingHighlights = [
  ["10,000+", "Happy Customers", "♟"],
  ["4.7/5", "Average Rating", "☆"],
  ["100%", "Secure Booking", "◇"],
  ["24/7", "Customer Support", "◌"],
];

function BenefitIcon({ index }: { index: number }) {
  const paths = [
    "M12 3 19 6v5.4c0 4.5-2.9 7.9-7 9.6-4.1-1.7-7-5.1-7-9.6V6l7-3Zm-3.2 9 2.1 2.1 4.5-4.5",
    "M6 4h12v16H6zM9 8h6M9 12h6M9 16h3",
    "M12 5v7l4 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    "M5 6.5a7 7 0 0 1 14 0v5a2 2 0 0 1-2 2h-1v-5h3M5 8.5H3v5h2v-5Zm3 6h3",
  ];

  return (
    <span className={styles.benefitIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d={paths[index]} />
      </svg>
    </span>
  );
}

export default function Hero() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowText}>
              <span className={styles.animatedPhrase}>kaam hy?</span>
              <strong className={styles.animatedPhrase}>kardo<span>Fix</span></strong>
            </span>
          </p>
          <h1 id="hero-title">
            Ghar ka har kaam,
            <span>ab hoga aasaan.</span>
          </h1>
          <p className={styles.description}>
            Find trusted and verified professionals for all your home services — fast, easy and reliable.
          </p>

          <ul className={styles.benefits} aria-label="KardoFix benefits">
            {benefits.map((benefit, index) => (
              <li key={benefit}>
                <BenefitIcon index={index} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <Image
            src="/heros_image_home_page.png"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.heroImage}
          />
        </div>

      </div>
      </section>
      <div className={styles.bookingPanel}>
        <ul className={styles.bookingHighlights} aria-label="KardoFix service statistics">
          {bookingHighlights.map(([value, label, icon]) => (
            <li className={styles.bookingHighlight} key={label}>
              <span className={styles.bookingHighlightIcon} aria-hidden="true">{icon}</span>
              <span>
                <strong>{value}</strong>
                <small>{label}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
