import Link from "next/link";
import type { ServiceGuide } from "@/data/serviceGuides";
import { serviceProviders } from "@/data/serviceProviders";
import styles from "./ServiceGuide.module.scss";

type ServiceGuidePageProps = {
  guide: ServiceGuide;
};

function SparkIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6 38 25l19 7-19 6-6 20-6-20-19-6 19-7 6-19Z" /><path d="m52 8 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" /></svg>;
}

function PlumbingIllustration() {
  return (
    <svg className={styles.plumbingIllustration} viewBox="0 0 360 300" aria-hidden="true">
      <defs>
        <linearGradient id="plumbing-pipe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#68c6e8" />
          <stop offset="1" stopColor="#2485c8" />
        </linearGradient>
        <linearGradient id="plumbing-tool" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#a9c2d8" />
        </linearGradient>
        <linearGradient id="plumbing-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#70d5ec" />
          <stop offset="1" stopColor="#2585d0" />
        </linearGradient>
        <filter id="plumbing-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#527aa2" floodOpacity=".16" />
        </filter>
      </defs>
      <circle cx="180" cy="150" r="118" fill="#e1f0ff" />
      <circle cx="180" cy="150" r="96" fill="#eff7ff" stroke="#d4e6f8" strokeWidth="1.5" />
      <g filter="url(#plumbing-shadow)">
        <path d="M128 203v-54c0-25 20-45 45-45h43V78h25v39h-68c-18 0-32 14-32 32v54z" fill="url(#plumbing-pipe)" stroke="#1b5688" strokeWidth="7" strokeLinejoin="round" />
        <path d="M213 79h42m-30-13v13m18-13v13" fill="none" stroke="#1b5688" strokeWidth="8" strokeLinecap="round" />
        <path d="M146 207h83" fill="none" stroke="#1b5688" strokeWidth="10" strokeLinecap="round" />
        <path d="M146 207h83" fill="none" stroke="#8bd9ec" strokeWidth="3" strokeLinecap="round" />
        <path d="M266 177c0 20-15 35-33 35s-33-15-33-35c0-17 33-55 33-55s33 38 33 55Z" fill="url(#plumbing-drop)" stroke="#fff" strokeWidth="5" />
        <path d="M223 185c2 8 7 12 14 13" fill="none" stroke="#c7f5ff" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g transform="rotate(-38 113 168)" filter="url(#plumbing-shadow)">
        <path d="M103 106c-14 0-25 11-25 25 0 11 7 20 17 23v83c0 10 8 18 18 18s18-8 18-18v-83c10-3 17-12 17-23 0-14-11-25-25-25l-1 24h-18l-1-24Z" fill="url(#plumbing-tool)" stroke="#54718c" strokeWidth="6" strokeLinejoin="round" />
        <path d="M95 153h35m-17 0v83" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      </g>
      <circle cx="285" cy="82" r="7" fill="#f3b84e" />
      <circle cx="81" cy="209" r="5" fill="#5bbda6" />
    </svg>
  );
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function ServiceGuidePage({ guide }: ServiceGuidePageProps) {
  const serviceCardsLinkToProviders = guide.slug === "plumbing" || guide.slug === "electrical";
  const hasProviders = serviceProviders.some((item) => item.category === guide.category);
  const providerHref = hasProviders
    ? `/service-providers?service=${encodeURIComponent(guide.category)}`
    : "/service-providers";

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${guide.slug === "plumbing" ? styles.plumbingHero : ""}`}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href="/services">Services</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{guide.category}</span>
          </nav>
          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <span className={styles.categoryPill}><span aria-hidden="true">✦</span> KARDOFIX SERVICES</span>
              <h1>{guide.headline}</h1>
              <p>{guide.intro}</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} href={providerHref}>Explore providers <span aria-hidden="true">→</span></Link>
                <a className={styles.secondaryButton} href={`mailto:support@kardofix.com?subject=${encodeURIComponent(`Request ${guide.category} service`)}`}>Ask our team</a>
              </div>
              <div className={styles.previewNote}>
                <span aria-hidden="true">i</span>
                <p>Service descriptions and starting prices are sample estimates for preview. Confirm availability, scope, materials, and final cost before booking.</p>
              </div>
            </div>
            {guide.slug === "plumbing" ? (
              <PlumbingIllustration />
            ) : (
              <div className={styles.heroArt} aria-hidden="true">
                  <div className={styles.artHalo} />
                  <div className={styles.artCard}><SparkIcon /></div>
                  <span className={styles.artDot} />
                  <span className={styles.artRing} />
              </div>
            )}
          </div>
          <div className={styles.quickFacts}>
            <div><span className={styles.factIcon}>₹</span><span><strong>From ₹{guide.startingPrice.toLocaleString("en-IN")}</strong><small>Sample estimate</small></span></div>
            <div><span className={styles.factIcon}>✦</span><span><strong>{guide.offerings.length} service options</strong><small>Choose what you need</small></span></div>
            <div><span className={styles.factIcon}>⌖</span><span><strong>Area-based availability</strong><small>Confirm your location</small></span></div>
          </div>
        </div>
      </section>

      <section className={styles.offeringsSection} id="service-options">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>SERVICE MENU</p><h2>Explore {guide.category.toLowerCase()} services</h2></div>
            <p>Choose an option to explore providers and discuss the right scope for your home.</p>
          </div>
          <div className={styles.offerGrid}>
            {guide.offerings.map((offering, index) => {
              const providerHref = `/service-providers?service=${encodeURIComponent(offering.name)}`;
              const cardContent = (
                <>
                  <div className={styles.offerIcon} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span><SparkIcon /></div>
                  <h3>{offering.name}</h3>
                  <p>{offering.description}</p>
                  <div className={styles.offerBottom}>
                    <span>Sample estimate from <strong>₹{offering.startingPrice.toLocaleString("en-IN")}</strong></span>
                    {serviceCardsLinkToProviders ? (
                      <span className={styles.offerExplore}>Explore <span aria-hidden="true">→</span></span>
                    ) : (
                      <Link href={providerHref} aria-label={`Find providers for ${offering.name}`}>Explore <span aria-hidden="true">→</span></Link>
                    )}
                  </div>
                </>
              );

              return serviceCardsLinkToProviders ? (
                <Link
                  className={`${styles.offerCard} ${styles.offerCardLink}`}
                  href={providerHref}
                  aria-label={`Find providers for ${offering.name}`}
                  key={offering.name}
                >
                  {cardContent}
                </Link>
              ) : (
                <article className={styles.offerCard} key={offering.name}>
                  {cardContent}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyPanel}>
            <div className={styles.whyCopy}><p className={styles.eyebrow}>A THOUGHTFUL WAY TO GET STARTED</p><h2>Clear expectations make better service.</h2><p>Share the details that matter, review the scope together, and agree on the price before work begins.</p></div>
            <ul>{guide.benefits.map((benefit) => <li key={benefit}><span><CheckIcon /></span>{benefit}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>HOW IT WORKS</p><h2>Three simple steps</h2></div><p>We’ll help you move from a service request to a clear plan.</p></div>
          <div className={styles.stepsGrid}>{guide.steps.map((step, index) => <article key={step.title}><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>GOOD TO KNOW</p><h2>Frequently asked questions</h2></div></div>
          <div className={styles.faqList}>{guide.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
          <div className={styles.bottomCta}><div><h2>Ready to find the right help?</h2><p>Browse providers and share what you need done.</p></div><Link className={styles.primaryButton} href={providerHref}>Find a provider <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>
    </div>
  );
}