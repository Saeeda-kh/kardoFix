import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceCategories } from "@/data/serviceCategories";
import styles from "./HomeSections.module.scss";

const services = [
  ["ac", "AC Technician", "₹499"],
  ["plumbing", "Plumber", "₹399"],
  ["electrical", "Electrician", "₹299"],
  ["maid", "Home Maid", "₹150"],
  ["cooking", "Cooking Services", "₹1200"],
  ["painting", "Painting", "₹999"],
  ["carpentry", "Carpentry", "₹499"],
  ["tutor", "Home Tutor", "₹500"],
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
    tutor: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c3.5 2.8 8.5 2.8 12 0v-5m4-2v7" /></>,
    maid: <><path d="M8 11a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" /><path d="M4 21c.7-4.2 3.3-6.3 8-6.3s7.3 2.1 8 6.3M17 4l3 3m-2-4 3 3" /></>,
    cooking: <><path d="M4 12h16l-1 8H5l-1-8Z" /><path d="M3 12a9 9 0 0 1 18 0M9 5c-1-2 1-2 0-4m6 4c-1-2 1-2 0-4" /></>,
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
          {services.map(([icon, name, price]) => {
            const cardContent = (
              <>
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
              </>
            );

            const categoryName = icon === "ac"
              ? "AC Services"
              : icon === "plumbing"
                ? "Plumbing"
                : icon === "electrical"
                  ? "Electrical"
                  : icon === "maid"
                    ? "Home Maid"
                    : icon === "cooking"
                      ? "Cooking Services"
                      : icon === "painting"
                        ? "Painting"
                        : icon === "carpentry"
                          ? "Carpentry & Furniture"
                          : "Home Tutor";
            const serviceHref = serviceCategories.find(({ label }) => label === categoryName)?.href;

            return (
              <Link
                className={styles.serviceCard}
                href={serviceHref ?? "/services"}
                key={name}
                aria-label={`Explore ${name}`}
              >
                {cardContent}
              </Link>
            );
          })}
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
