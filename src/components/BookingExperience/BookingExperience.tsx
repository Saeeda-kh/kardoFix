"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import type { MarketplaceOffering, MarketplaceProvider, ServiceCategory } from "@/data/marketplace";
import MapLocationPicker from "@/components/MapLocationPicker/MapLocationPicker";
import type { MapCoordinates } from "@/components/MapLocationPicker/InteractiveMap";
import styles from "./BookingExperience.module.scss";

type BookingExperienceProps = {
  initialCategory: string;
  initialProviderId: string;
  initialService: string;
  categories: ServiceCategory[];
  providers: MarketplaceProvider[];
  offerings: MarketplaceOffering[];
};

const timeSlots = ["Morning · 8 am–12 pm", "Afternoon · 12–4 pm", "Evening · 4–8 pm"];

export default function BookingExperience({
  initialCategory,
  initialProviderId,
  initialService,
  categories,
  providers,
  offerings,
}: BookingExperienceProps) {
  const initialProvider = providers.find(({ id }) => id === initialProviderId);
  const initialCategoryLabel = categories.find(({ label }) =>
    label.toLocaleLowerCase() === (initialProvider?.category ?? initialCategory).trim().toLocaleLowerCase(),
  )?.label ?? "";
  const initialCategorySlug = categories.find(({ label }) => label === initialCategoryLabel)?.slug;
  const initialOffering = offerings.find(({ categorySlug, name }) =>
    categorySlug === initialCategorySlug && name.toLocaleLowerCase() === initialService.trim().toLocaleLowerCase(),
  );

  const [category, setCategory] = useState(initialCategoryLabel);
  const [providerId, setProviderId] = useState(initialProvider?.id ?? "");
  const [service, setService] = useState(initialOffering?.name ?? "");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState(timeSlots[0]);
  const [customerLocation, setCustomerLocation] = useState<MapCoordinates | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [requestReference, setRequestReference] = useState("");

  const selectedCategory = categories.find(({ label }) => label === category);
  const categoryProviders = useMemo(
    () => providers.filter((provider) => !category || provider.category === category),
    [category, providers],
  );
  const serviceOptions = useMemo(() => {
    const categoryOfferings = offerings.filter(({ categorySlug }) => categorySlug === selectedCategory?.slug);
    if (!providerId) return categoryOfferings;

    const selectedProvider = providers.find(({ id }) => id === providerId);
    return categoryOfferings.filter((offering) => selectedProvider?.services.includes(offering.name));
  }, [offerings, providers, providerId, selectedCategory?.slug]);

  function handleCategoryChange(value: string) {
    setCategory(value);
    setProviderId("");
    setService("");
  }

  function handleProviderChange(value: string) {
    const nextProvider = providers.find(({ id }) => id === value);
    setProviderId(value);
    if (nextProvider) {
      setCategory(nextProvider.category);
      setService(nextProvider.services.includes(service) ? service : "");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setRequestReference("");

    const selectedOffering = serviceOptions.find((offering) => offering.name === service);
    if (!selectedCategory || !selectedOffering) {
      setFeedback("Choose a valid category and service before submitting.");
      return;
    }
    if (!customerLocation) {
      setFeedback("Choose your service location on the map before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: selectedCategory.slug,
          offeringId: selectedOffering.id,
          providerId: providerId || null,
          preferredDate,
          preferredTime,
          customerLatitude: customerLocation.latitude,
          customerLongitude: customerLocation.longitude,
          customerName: customerName.trim(),
          phone: phone.trim(),
          details: details.trim(),
        }),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          response.ok
            ? "Your request may have been received, but we couldn’t confirm it. Please contact KardoFix support before submitting again."
            : "We couldn’t submit your request. Please try again.",
        );
      }
      if (!response.ok) {
        const message =
          result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "We couldn’t submit your request. Please try again.";
        throw new Error(message);
      }
      if (!result || typeof result !== "object" || !("reference" in result) || typeof result.reference !== "string") {
        throw new Error("Your request may have been received, but we couldn’t confirm it. Please contact KardoFix support before submitting again.");
      }

      setRequestReference(result.reference);
      setPreferredDate("");
      setCustomerLocation(null);
      setCustomerName("");
      setPhone("");
      setDetails("");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "We couldn’t submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/services">Services</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Service request</span>
        </nav>

        <header className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>KARDOFIX SERVICE REQUESTS</p>
            <h1>Tell us what you need.</h1>
            <p>Choose a service, share a few details, and send a request to the KardoFix team.</p>
          </div>
          <Link className={styles.browseLink} href="/service-providers">Browse providers <span aria-hidden="true">→</span></Link>
        </header>

        <div className={styles.notice} role="note">
          <span aria-hidden="true">i</span>
          <p><strong>Secure request handling:</strong> your selected map coordinates and request details are saved for the KardoFix team. Your location is not displayed publicly. This is not a confirmed booking; the team must confirm availability and final pricing.</p>
        </div>

        <div className={styles.layout}>
          <section className={styles.formCard} aria-labelledby="request-form-title">
            <div className={styles.cardHeading}>
              <span className={styles.step}>01</span>
              <div><h2 id="request-form-title">Plan your service</h2><p>Fields marked <span aria-hidden="true">*</span> are required.</p></div>
            </div>

            {requestReference && (
              <div className={styles.success} role="status">
                <strong>Request received</strong>
                <p>Your request is saved. Keep this reference for follow-up: <b>{requestReference}</b>. This is a request, not a confirmed booking.</p>
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Service category <span aria-hidden="true">*</span></span>
                  <select value={category} required onChange={(event) => handleCategoryChange(event.target.value)}>
                    <option value="">Choose a category</option>
                    {categories.map(({ slug, label }) => <option key={slug} value={label}>{label}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Service needed <span aria-hidden="true">*</span></span>
                  <select value={service} required onChange={(event) => setService(event.target.value)}>
                    <option value="">Choose a service</option>
                    {serviceOptions.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}
                  </select>
                </label>
              </div>

              <label className={styles.field}>
                <span>Preferred provider <span className={styles.optional}>Optional</span></span>
                <select value={providerId} onChange={(event) => handleProviderChange(event.target.value)}>
                  <option value="">No preference — find a match</option>
                  {categoryProviders.map((provider) => <option key={provider.id} value={provider.id}>{provider.name} · {provider.location}</option>)}
                </select>
                <small>Provider profiles and prices may be sample data and need confirmation.</small>
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Preferred date <span aria-hidden="true">*</span></span>
                  <input type="date" value={preferredDate} required onChange={(event) => setPreferredDate(event.target.value)} />
                </label>
                <label className={styles.field}>
                  <span>Preferred time <span aria-hidden="true">*</span></span>
                  <select value={preferredTime} required onChange={(event) => setPreferredTime(event.target.value)}>
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </label>
              </div>

              <MapLocationPicker
                label="Service location"
                value={customerLocation}
                onChange={setCustomerLocation}
              />

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Your name <span aria-hidden="true">*</span></span>
                  <input type="text" autoComplete="name" minLength={2} maxLength={80} value={customerName} required onChange={(event) => setCustomerName(event.target.value)} />
                </label>
                <label className={styles.field}>
                  <span>Phone number <span aria-hidden="true">*</span></span>
                  <input type="tel" autoComplete="tel" inputMode="tel" maxLength={18} placeholder="+91 98765 43210" value={phone} required onChange={(event) => setPhone(event.target.value)} />
                  <small>Used by KardoFix to respond to your request.</small>
                </label>
              </div>

              <label className={styles.field}>
                <span>What should the provider know? <span className={styles.optional}>Optional</span></span>
                <textarea maxLength={500} rows={4} placeholder="Describe the job briefly. Please don’t include sensitive information." value={details} onChange={(event) => setDetails(event.target.value)} />
                <small className={styles.characterCount}>{details.length}/500</small>
              </label>

              {feedback && <p className={styles.error} role="alert">{feedback}</p>}

              <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending request…" : "Send service request"} <span aria-hidden="true">→</span>
              </button>
              <p className={styles.formFootnote}>No payment is taken. KardoFix will contact you to confirm availability and final pricing.</p>
            </form>
          </section>

          <aside className={styles.sideColumn}>
            <section className={styles.helpCard}>
              <span className={styles.helpIcon} aria-hidden="true">✓</span>
              <h2>What happens next?</h2>
              <ol>
                <li><span>1</span><p>Your request is securely saved to the KardoFix database.</p></li>
                <li><span>2</span><p>The team reviews your details and checks provider availability.</p></li>
                <li><span>3</span><p>KardoFix contacts you to confirm the scope, schedule, and price.</p></li>
              </ol>
              <a href="mailto:support@kardofix.com?subject=Help%20with%20a%20service%20request">Need help? Contact support</a>
            </section>
            <section className={styles.privacyCard}>
              <h2>Your information</h2>
              <p>Your contact information and selected service coordinates are visible only to authorized KardoFix team members. Share only details needed to arrange your service.</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
