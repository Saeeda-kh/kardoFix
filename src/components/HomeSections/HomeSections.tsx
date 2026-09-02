import styles from "./HomeSections.module.scss";

const services = [
  ["▣", "AC Repair & Service", "₹499"],
  ["⌁", "Plumbing", "₹399"],
  ["ϟ", "Electrical", "₹299"],
  ["♧", "Home Cleaning", "₹699"],
  ["▰", "Painting", "₹999"],
  ["⚒", "Carpentry", "₹499"],
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

export default function HomeSections() {
  return (
    <div className={styles.sections}>
      <section className={styles.services} aria-labelledby="services-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>Popular Services</p>
            <h2 id="services-title">Most Booked Services</h2>
          </div>
          <a href="#services">View all services <span aria-hidden="true">→</span></a>
        </div>
        <div className={styles.serviceGrid}>
          {services.map(([icon, name, price]) => (
            <article className={styles.serviceCard} key={name}>
              <div className={styles.serviceIcon}>{icon}</div>
              <h3>{name}</h3>
              <small>Starting from</small>
              <strong>{price}</strong>
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
            <a href="#reviews">View all reviews →</a>
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

      <section className={styles.brands} aria-label="Trusted brands">
        <span>TRUSTED BY THOUSANDS</span>
        <strong>DLF</strong><strong>Godrej</strong><strong>PHILIPS</strong>
        <strong>OYO</strong><strong>HAVELLS</strong><strong>Berger</strong><strong>amazon</strong>
      </section>
    </div>
  );
}
