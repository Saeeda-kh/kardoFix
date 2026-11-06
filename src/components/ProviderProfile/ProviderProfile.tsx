import Link from "next/link";
import type { ServiceProvider } from "@/data/serviceProviders";
import styles from "./ProviderProfile.module.scss";

type ProviderProfileProps = {
  provider: ServiceProvider;
};

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.3" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 3v5.5c0 4.7-3.3 8-8 9.5-4.7-1.5-8-4.8-8-9.5V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></svg>;
}

function StarIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 1.8 2.5 5.1 5.7.8-4.1 4 .9 5.7-5-2.7-5 2.7.9-5.7-4.1-4 5.7-.8L10 1.8Z" /></svg>;
}

function ProviderPortrait({ name }: { name: string }) {
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");

  return (
    <div className={styles.portrait} role="img" aria-label={`Illustrated profile portrait for ${name}`}>
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <defs>
          <linearGradient id="portrait-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e8f3ff" />
            <stop offset="1" stopColor="#c8dcf5" />
          </linearGradient>
          <linearGradient id="portrait-shirt" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#367bd0" />
            <stop offset="1" stopColor="#153f81" />
          </linearGradient>
        </defs>
        <rect width="240" height="240" rx="34" fill="url(#portrait-bg)" />
        <circle cx="190" cy="45" r="32" fill="#fff" opacity=".45" />
        <path d="M28 240c5-53 40-82 92-82s87 29 92 82" fill="url(#portrait-shirt)" />
        <path d="M99 143h42v35c-11 13-31 13-42 0z" fill="#bf805e" />
        <path d="M68 104c0-47 20-70 53-70s54 25 52 72l-7 40c-8 23-25 37-45 37-22 0-40-16-47-39z" fill="#cb8e6d" />
        <path d="M65 107C58 52 80 22 121 22c46 0 66 34 52 92l-11-18-3-37c-21 17-49 22-79 18l-3 39-12 16z" fill="#28384d" />
        <path d="M90 105h.5m55 0h.5" stroke="#372b2a" strokeWidth="6" strokeLinecap="round" />
        <path d="M108 132c8 5 18 5 26 0" fill="none" stroke="#8f4e45" strokeWidth="4" strokeLinecap="round" />
        <path d="m93 176 28 24 28-24" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="5" />
        <circle cx="199" cy="193" r="28" fill="#fff" opacity=".76" />
        <text x="199" y="201" textAnchor="middle" fill="#1953a8" fontSize="19" fontFamily="Arial, sans-serif" fontWeight="700">{initials}</text>
      </svg>
    </div>
  );
}

export default function ProviderProfile({ provider }: ProviderProfileProps) {
  const bookingHref = `/bookings?provider=${encodeURIComponent(provider.id)}&category=${encodeURIComponent(provider.category)}&service=${encodeURIComponent(provider.services[0] ?? "")}`;
  const serviceArea = provider.location.includes(",") ? provider.location : `${provider.location}, Delhi, India`;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/service-providers">Service providers</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{provider.name}</span>
        </nav>

        <p className={styles.previewNotice}>
          <span aria-hidden="true">i</span>
          Preview profile: ratings, reviews, pricing, and experience shown here are sample content and must be confirmed before launch.
        </p>

        <section className={styles.profileHero} aria-labelledby="provider-name">
          <div className={styles.profileIdentity}>
            <ProviderPortrait name={provider.name} />
            <div className={styles.identityCopy}>
              <span className={styles.category}>{provider.category}</span>
              <h1 id="provider-name">{provider.name}</h1>
              <p>{provider.description}</p>
              <div className={styles.identityMeta}>
                <span><PinIcon />Serving {serviceArea}</span>
                <span className={styles.previewBadge}><ShieldIcon />Profile preview</span>
              </div>
            </div>
          </div>
          <Link className={styles.primaryButton} href={bookingHref}>Request this provider <span aria-hidden="true">→</span></Link>
        </section>

        <section className={styles.stats} aria-label="Provider highlights">
          <div><span className={styles.statIcon}><StarIcon /></span><span><strong>{provider.rating.toFixed(1)} / 5</strong><small>Sample rating</small></span></div>
          <div><span className={styles.statIcon}>✦</span><span><strong>{provider.reviewCount}</strong><small>Sample reviews</small></span></div>
          <div><span className={styles.statIcon}>⌁</span><span><strong>{provider.experienceYears} years</strong><small>Sample experience</small></span></div>
          <div><span className={styles.statIcon}>✓</span><span><strong>Not provided</strong><small>Completed tasks</small></span></div>
        </section>

        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <section className={styles.panel} aria-labelledby="about-title">
              <div className={styles.sectionTitle}><span>01</span><h2 id="about-title">About the professional</h2></div>
              <p className={styles.aboutText}>{provider.description} Service details and availability can be confirmed when you send a request through KardoFix.</p>
              <div className={styles.detailGrid}>
                <div><span>Experience</span><strong>{provider.experienceYears} years <small>(sample)</small></strong></div>
                <div><span>Service request</span><strong>Available by email</strong></div>
                <div><span>Completed tasks</span><strong>Not provided yet</strong></div>
                <div><span>Response details</span><strong>Confirmed after request</strong></div>
              </div>
              {provider.category === "Home Tutor" && (
                <div className={styles.tutorDetails}>
                  {provider.tutorLevels?.length ? <p><strong>Student levels:</strong> {provider.tutorLevels.join(", ")}</p> : null}
                  {provider.subjects?.length ? <p><strong>Subjects:</strong> {provider.subjects.join(", ")}</p> : null}
                  <p><strong>Online lessons:</strong> {provider.onlineClasses ? "Available (sample)" : "Not listed"}</p>
                </div>
              )}
            </section>

            <section className={styles.panel} aria-labelledby="services-title">
              <div className={styles.sectionTitle}><span>02</span><h2 id="services-title">Services offered</h2></div>
              <p className={styles.sectionIntro}>Choose a service to see matching professionals.</p>
              <ul className={styles.serviceList}>
                {provider.services.map((service) => (
                  <li key={service}><Link href={`/service-providers?service=${encodeURIComponent(service)}`}><span aria-hidden="true">✓</span>{service}<span aria-hidden="true">↗</span></Link></li>
                ))}
              </ul>
            </section>

            <section className={styles.panel} aria-labelledby="reviews-title">
              <div className={styles.sectionTitle}><span>03</span><h2 id="reviews-title">Customer reviews</h2></div>
              <div className={styles.reviewSummary}>
                <strong>{provider.rating.toFixed(1)}</strong><span><span className={styles.stars} aria-label="Sample rating">★★★★★</span><small>Based on {provider.reviewCount} sample reviews</small></span>
              </div>
              <blockquote className={styles.reviewCard}>
                <span className={styles.reviewLabel}>SAMPLE REVIEW</span>
                <p>“{provider.featuredReview}”</p>
                <footer><span className={styles.reviewerAvatar} aria-hidden="true">KF</span><span><strong>KardoFix customer</strong><small>Example review for preview</small></span><span className={styles.reviewStars} aria-label="5 out of 5 stars">★★★★★</span></footer>
              </blockquote>
            </section>
          </div>

          <aside className={styles.sidebar} aria-label="Provider contact and pricing">
            <section className={styles.contactCard} aria-labelledby="contact-title">
              <p className={styles.contactEyebrow}>STARTING FROM</p>
              <h2 className={styles.price}>
                {provider.startingPrice === null
                  ? "Price on request"
                  : <>₹{provider.startingPrice.toLocaleString("en-IN")}<small> / service</small></>}
              </h2>
              <p className={styles.priceNote}>
                {provider.startingPrice === null
                  ? "Ask KardoFix to confirm an estimate for your service."
                  : "Final price depends on the service details and will be confirmed before booking."}
              </p>
              <Link className={styles.primaryButton} href={bookingHref}>Request a booking <span aria-hidden="true">→</span></Link>
              <div className={styles.contactDivider}><span>PROVIDER DETAILS</span></div>
              <dl className={styles.contactDetails}>
                <div><dt>Business address</dt><dd><PinIcon />{serviceArea}<small>Service area only; exact business address not provided.</small></dd></div>
                <div><dt>Contact number</dt><dd>Not shared publicly<small>Request contact through KardoFix.</small></dd></div>
                <div><dt>Service requests</dt><dd>Send by email<small>Availability and final pricing need confirmation.</small></dd></div>
              </dl>
              <Link className={styles.emailLink} href="/bookings">Contact KardoFix support</Link>
            </section>
            <p className={styles.safetyNote}><ShieldIcon /><span><strong>Book with confidence</strong><small>Confirm provider identity, scope, and final price before work begins.</small></span></p>
          </aside>
        </div>
      </div>
    </div>
  );
}