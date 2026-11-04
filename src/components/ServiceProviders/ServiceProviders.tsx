"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cleaningServiceNames, serviceProviders } from "@/data/serviceProviders";
import styles from "./ServiceProviders.module.scss";

type ServiceProvidersProps = {
  initialService: string;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m10 1.8 2.5 5.1 5.7.8-4.1 4 .9 5.7-5-2.7-5 2.7.9-5.7-4.1-4 5.7-.8L10 1.8Z" />
    </svg>
  );
}

const portraitPalettes = [
  { background: "#DCEEFF", skin: "#D99A70", hair: "#28364E", clothing: "#2F6FB5" },
  { background: "#FCE8E3", skin: "#C98260", hair: "#3A2D2A", clothing: "#A95C6F" },
  { background: "#E5F4ED", skin: "#E3B18A", hair: "#3B302A", clothing: "#398A72" },
  { background: "#F2EAFE", skin: "#A9674E", hair: "#241E21", clothing: "#765DAF" },
  { background: "#FFF1D9", skin: "#D5966F", hair: "#41332B", clothing: "#D18B37" },
  { background: "#E5F1F7", skin: "#F0C09B", hair: "#79513C", clothing: "#487C99" },
] as const;

function ProviderPortrait({ name, index }: { name: string; index: number }) {
  const palette = portraitPalettes[index % portraitPalettes.length];
  const hairStyle = index % 3;

  return (
    <span className={styles.providerPortrait} role="img" aria-label={`Illustrated profile portrait of ${name}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <defs>
          <linearGradient id={`portrait-bg-${index}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset="1" stopColor={palette.background} />
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="22" fill={palette.background} />
        <path d="M8 80c2-17 13-27 32-27s30 10 32 27" fill={palette.clothing} />
        <path d="M32 51h16v13c-5 5-11 5-16 0z" fill={palette.skin} />
        <path d="M23 33c0-15 7-23 18-23 12 0 19 9 18 24l-3 15c-3 9-10 14-16 14-8 0-15-6-17-15z" fill={palette.skin} />
        {hairStyle === 0 && (
          <path d="M22 37c-5-21 4-31 19-31 17 0 23 12 17 33l-4-7-2-12c-7 6-16 8-27 7l1 10-3 6z" fill={palette.hair} />
        )}
        {hairStyle === 1 && (
          <path d="M20 40c-5-23 4-34 21-34 18 0 25 14 19 39l-2 13-8-4 3-18c-9 2-17 1-27-3l1 22-7 4z" fill={palette.hair} />
        )}
        {hairStyle === 2 && (
          <path d="M22 35C20 15 28 6 41 6c15 0 21 9 18 28l-5-6-2-10c-7 5-16 7-28 6l1 12-3 5z" fill={palette.hair} />
        )}
        <path d="M32 37h.3m15 0h.3" stroke="#382B29" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M38 45c1 1 3 1 4 0" fill="none" stroke="#A65E4C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 51c3 2 7 2 10 0" fill="none" stroke="#8D4E48" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m31 63 9 7 9-7" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="2" />
        <rect width="80" height="80" rx="22" fill={`url(#portrait-bg-${index})`} opacity=".22" />
      </svg>
    </span>
  );
}

export default function ServiceProviders({ initialService }: ServiceProvidersProps) {
  const [serviceQuery, setServiceQuery] = useState(initialService);
  const normalizedQuery = serviceQuery.trim().toLocaleLowerCase();

  const filteredProviders = useMemo(() => {
    if (!normalizedQuery) return serviceProviders;

    return serviceProviders.filter((provider) =>
      provider.services.some((service) => service.toLocaleLowerCase().includes(normalizedQuery)),
    );
  }, [normalizedQuery]);

  const activeService = cleaningServiceNames.find(
    (service) => service.toLocaleLowerCase() === normalizedQuery,
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Service Providers</span>
          </nav>

          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>KARDOFIX PROVIDER DIRECTORY</p>
            <h1>Find the right professional for your home.</h1>
            <p>Search by service name and explore providers who offer the help you need.</p>
          </div>

          <form className={styles.searchPanel} role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="provider-service-search">What service do you need?</label>
            <div className={styles.searchControls}>
              <span className={styles.searchInput}>
                <SearchIcon />
                <input
                  id="provider-service-search"
                  type="search"
                  list="provider-service-options"
                  placeholder="Try Home Cleaning or Plumbing"
                  value={serviceQuery}
                  onChange={(event) => setServiceQuery(event.target.value)}
                  autoComplete="off"
                />
                <datalist id="provider-service-options">
                  {Array.from(new Set(serviceProviders.flatMap((provider) => provider.services))).map((service) => (
                    <option key={service} value={service} />
                  ))}
                </datalist>
              </span>
              {serviceQuery && (
                <button className={styles.clearButton} type="button" onClick={() => setServiceQuery("")}>
                  Clear search
                </button>
              )}
            </div>
            <p className={styles.searchHint}>
              {filteredProviders.length} {filteredProviders.length === 1 ? "provider" : "providers"}
              {activeService ? ` offer ${activeService}` : normalizedQuery ? ` match “${serviceQuery.trim()}”` : " across our service categories"}
            </p>
          </form>
        </div>
      </section>

      <section className={styles.directory} aria-labelledby="directory-title">
        <div className={styles.container}>
          <div className={styles.directoryHeading}>
            <div>
              <p className={styles.eyebrow}>{activeService ? "MATCHING PROVIDERS" : "OUR PROVIDER NETWORK"}</p>
              <h2 id="directory-title">{activeService ? `Providers for ${activeService}` : "Browse service providers"}</h2>
            </div>
            <span className={styles.providerCount}>
              {filteredProviders.length} {filteredProviders.length === 1 ? "provider" : "providers"}
            </span>
          </div>

          <div className={styles.providerInvite}>
            <p><strong>Are you a skilled professional?</strong> Join KardoFix and build your provider profile.</p>
            <a href="mailto:support@kardofix.com?subject=Join%20KardoFix%20as%20a%20service%20provider">
              Get in touch <span aria-hidden="true">→</span>
            </a>
          </div>

          <p className={styles.directoryNote}>
            Sample profiles for preview only. Ratings, reviews, experience, and prices are placeholders until verified provider profiles are available.
          </p>

          {filteredProviders.length > 0 ? (
            <div className={styles.providerGrid}>
              {filteredProviders.map((provider, index) => (
                <article className={styles.providerCard} key={provider.id}>
                  <div className={styles.providerHeader}>
                    <ProviderPortrait name={provider.name} index={index} />
                    <div className={styles.providerIdentity}>
                      <p className={styles.providerCategory}>{provider.category}</p>
                      <h3>{provider.name}</h3>
                    </div>
                  </div>
                  <div className={styles.ratingRow} aria-label={`${provider.rating} out of 5, ${provider.reviewCount} sample reviews`}>
                    <span className={styles.ratingValue}><StarIcon />{provider.rating.toFixed(1)}</span>
                    <span className={styles.reviewCount}>({provider.reviewCount} reviews)</span>
                  </div>
                  <p className={styles.providerDescription}>{provider.description}</p>
                  <div className={styles.providerStats}>
                    <div><span>Experience</span><strong>{provider.experienceYears} years</strong></div>
                    <div><span>Starting price</span><strong>₹{provider.startingPrice.toLocaleString("en-IN")}</strong></div>
                  </div>
                  <p className={styles.offersLabel}>Services offered</p>
                  <ul className={styles.serviceTags}>
                    {provider.services.map((service) => (
                      <li key={service}>
                        <Link href={`/service-providers?service=${encodeURIComponent(service)}`}>{service}</Link>
                      </li>
                    ))}
                  </ul>
                  <blockquote className={styles.review}>
                    <span aria-hidden="true">“</span>{provider.featuredReview}
                  </blockquote>
                  <div className={styles.providerFooter}>
                    <span className={styles.location}>
                      <LocationIcon />
                      {provider.location}
                    </span>
                    <a
                      href={`mailto:support@kardofix.com?subject=${encodeURIComponent(`Request service from ${provider.name}`)}&body=${encodeURIComponent(`Hello KardoFix, I would like to request a service from ${provider.name}. Services offered: ${provider.services.join(", ")}.`)}`}
                    >
                      Request service <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span aria-hidden="true"><SearchIcon /></span>
              <h3>No matching providers found</h3>
              <p>Try a different service name or browse all providers.</p>
              <button type="button" onClick={() => setServiceQuery("")}>Show all providers</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
