import Link from "next/link";
import { serviceCategories } from "@/data/serviceCategories";
import styles from "./Footer.module.scss";

const services = serviceCategories.slice(0, 6);

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/", icon: <path d="M7 2.8h10A4.2 4.2 0 0 1 21.2 7v10a4.2 4.2 0 0 1-4.2 4.2H7A4.2 4.2 0 0 1 2.8 17V7A4.2 4.2 0 0 1 7 2.8Zm0 2A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8H7Zm5 2.1a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Zm0 2a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5.3-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" /> },
  { name: "Facebook", href: "https://www.facebook.com/", icon: <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" /> },
  { name: "LinkedIn", href: "https://www.linkedin.com/", icon: <path d="M5.2 7.8a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8ZM3.6 9.2h3.2V20H3.6V9.2Zm5.2 0h3.1v1.5h.1a3.4 3.4 0 0 1 3.1-1.7c3.3 0 3.9 2.2 3.9 5V20h-3.2v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H8.8V9.2Z" /> },
  { name: "YouTube", href: "https://www.youtube.com/", icon: <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10 15.4V8.6l5.8 3.4-5.8 3.4Z" /> },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.footerGrid}>
          <section className={styles.brandColumn} aria-label="About KardoFix">
            <Link className={styles.wordmark} href="/" aria-label="KardoFix home">
              <span className={styles.brandMark} aria-hidden="true">K</span>
              <span>Kardo<span>Fix</span></span>
            </Link>
            <p className={styles.brandDescription}>
              Reliable home services, made simple. Find trusted professionals for the work that matters at home.
            </p>
            <div className={styles.socialLinks} aria-label="Social media">
              {socials.map(({ name, href, icon }) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
                </a>
              ))}
            </div>
          </section>

          <nav className={styles.serviceColumn} aria-label="Our services">
            <h2>Our Services</h2>
            <ul>
              {services.map((service) => (
                <li key={service.slug}><Link href={service.href}>{service.label}</Link></li>
              ))}
            </ul>
          </nav>

          <section className={styles.contactColumn}>
            <h2>Get in touch</h2>
            <p>Questions or need a hand? We’d love to hear from you.</p>
            <a className={styles.emailLink} href="mailto:support@kardofix.com">support@kardofix.com</a>
          </section>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} KardoFix. All rights reserved.</span>
          <span>Making home care feel effortless.</span>
        </div>
      </div>
    </footer>
  );
}