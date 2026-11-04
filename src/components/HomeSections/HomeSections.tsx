import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeSections.module.scss";

const services = [
  ["ac", "AC Technician", "₹499"],
  ["plumbing", "Plumber", "₹399"],
  ["electrical", "Electrician", "₹299"],
  ["cleaning", "Home Maid", "₹699"],
  ["painting", "Painting", "₹999"],
  ["carpentry", "Carpentry", "₹499"],
];

const reasons = [
  ["♙", "Verified & Background Checked Pros", "All professionals are verified and experienced."],
  ["◇", "Transparent Pricing", "No hidden charges. What you see is what you pay."],
  ["◷", "On-time Service", "We value your time and ensure on-time service."],
  ["✥", "Satisfaction Guaranteed", "Not happy? We’ll make it right."],
];

const reviews = [
  ["Rohit Sharma", "Delhi", "Booked AC service and the technician was on time, polite and did a great job. Highly recommended!"],
  ["Pooja Verma", "Gurugram", "Very easy booking process and transparent pricing. The plumbing work was done perfectly."],
  ["Ankit Malhotra", "Noida", "I use KardoFix for regular home cleaning. The team is professional and always does a fantastic job."],
];

function ServiceIcon({ type }: { type: string }) {
  const paths: Record<string, ReactNode> = {
    ac: <><rect x="3" y="5" width="18" height="11" rx="2.5" /><path d="M6 9h12M7 12h.01M10 12h.01M13 12h.01M16 12h.01M8 19h8M12 16v3" /></>,
    plumbing: <><path d="M7 4v6a5 5 0 0 0 10 0V7h-3v3a2 2 0 0 1-4 0V4H7Z" /><path d="M17 7h3M5 4h4" /></>,
    electrical: <path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    cleaning: <><path d="m14 4 6 6M12 6l8 8M5 19l6-6M3 21l3-3M15 3l2-2" /><path d="M4 14 2 12l4-4 2 2" /></>,
    painting: <><path d="m14 4 6 6-9 9H5v-6l9-9Z" /><path d="m12 6 6 6M5 19l-2 2" /></>,
    carpentry: <><path d="m14.5 5.5 4 4M4 20l7.5-7.5M3 21l3-1 9-9-2-2-9 9-1 3Z" /><path d="m14 3 3-1 4 4-1 3" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export default function HomeSections() {
  return (
    <div className={styles.sections}>
      <section id="services" className={styles.services} aria-labelledby="services-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="services-title">Popular Services</h2>
          </div>
          <Link href="/services">View all services <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.serviceGrid}>
          {services.map(([icon, name, price]) => (
            <article className={styles.serviceCard} key={name}>
              {icon === "ac" || icon === "plumbing" || icon === "electrical" || icon === "cleaning" || icon === "painting" ? (
                <Image
                  className={styles.serviceIconImage}
                  src={
                    icon === "ac"
                      ? "/ac_repair_service_icon.jpg"
                      : icon === "plumbing"
                        ? "/plumbing_icon_v2.png"
                        : icon === "electrical"
                          ? "/electrical_icon.png"
                          : icon === "cleaning"
                            ? "/home_maid_icon.png"
                            : "/painting_icon.png"
                  }
                  alt=""
                  width={100}
                  height={80}
                />
              ) : (
                <div className={`${styles.serviceIcon} ${styles[`serviceIcon-${icon}`]}`}>
                  <ServiceIcon type={icon} />
                </div>
              )}
              <div className={styles.serviceCardContent}>
                <h3>{name}</h3>
                <small>Starting from</small>
                <strong>{price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.insights}>
        <article className={styles.reasonPanel}>
          <h2>Why Choose KardoFix?</h2>
          <ul>
            {reasons.map(([icon, title, detail]) => (
              <li key={title}>
                <span className={styles.reasonIcon}>{icon}</span>
                <span><strong>{title}</strong><small>{detail}</small></span>
              </li>
            ))}
          </ul>
        </article>
        <article className={styles.reviewPanel}>
          <div className={styles.panelHeading}>
            <h2>What Our Customers Say</h2>
          </div>
          <div className={styles.reviewGrid}>
            {reviews.map(([name, city, text]) => (
              <blockquote key={name}>
                <span className={styles.stars}>★★★★★</span>
                <p>“{text}”</p>
                <footer><strong>{name}</strong><small>{city}</small></footer>
              </blockquote>
            ))}
          </div>
        </article>
      </section>

    </div>
  );
}
