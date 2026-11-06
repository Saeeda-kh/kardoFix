"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { bookingRequestStorageKey, isBookingRequest, type BookingRequest } from "@/data/bookingRequests";
import { serviceCategories } from "@/data/serviceCategories";
import { serviceGuides } from "@/data/serviceGuides";
import { serviceProviders } from "@/data/serviceProviders";
import styles from "./BookingExperience.module.scss";

type BookingExperienceProps = {
  initialCategory: string;
  initialProviderId: string;
  initialService: string;
};

const timeSlots = ["Morning · 8 am–12 pm", "Afternoon · 12–4 pm", "Evening · 4–8 pm"];

function getLocalDateString(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function getEmailHref(request: BookingRequest) {
  const subject = `KardoFix service request: ${request.service}`;
  const body = [
    "Hello KardoFix,",
    "",
    "I would like help arranging this service:",
    `Service: ${request.service}`,
    `Category: ${request.category}`,
    `Preferred provider: ${request.providerName || "No preference"}`,
    `Preferred date: ${request.preferredDate}`,
    `Preferred time: ${request.preferredTime}`,
    `Service area: ${request.area}`,
    `Name: ${request.customerName}`,
    `Phone: ${request.phone}`,
    `Details: ${request.details || "Not provided"}`,
    "",
    "Please confirm availability and the final price before booking.",
  ].join("\n");

  return `mailto:support@kardofix.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function BookingExperience({
  initialCategory,
  initialProviderId,
  initialService,
}: BookingExperienceProps) {
  const initialProvider = serviceProviders.find(({ id }) => id === initialProviderId);
  const initialKnownCategory = serviceCategories.find(
    ({ label }) => label.toLocaleLowerCase() === initialCategory.trim().toLocaleLowerCase(),
  )?.label;
  const initialServiceCategory = serviceCategories.find(
    ({ label }) => label.toLocaleLowerCase() === initialService.trim().toLocaleLowerCase(),
  )?.label;
  const [category, setCategory] = useState(initialProvider?.category ?? initialKnownCategory ?? initialServiceCategory ?? "");
  const [providerId, setProviderId] = useState(initialProvider?.id ?? "");
  const [service, setService] = useState(initialProvider && initialProvider.services.includes(initialService)
    ? initialService
    : initialServiceCategory ? "" : initialService);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState(timeSlots[0]);
  const [area, setArea] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [minimumDate, setMinimumDate] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumDate(getLocalDateString(new Date()));
      try {
        const savedValue = window.localStorage.getItem(bookingRequestStorageKey);
        if (savedValue) {
          const parsed: unknown = JSON.parse(savedValue);
          if (!Array.isArray(parsed) || !parsed.every(isBookingRequest)) {
            throw new Error("Saved requests have an unexpected format.");
          }
          setRequests(parsed);
        }
      } catch (error) {
        setStorageError(
          error instanceof Error && error.message === "Saved requests have an unexpected format."
            ? "Saved requests could not be read because their data is invalid. You can clear the saved requests below."
            : "This browser could not access saved requests. Check your browser storage settings and try again.",
        );
      } finally {
        setIsReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const categoryProviders = useMemo(
    () => serviceProviders.filter((provider) => !category || provider.category === category),
    [category],
  );
  const selectedProvider = serviceProviders.find(({ id }) => id === providerId);
  const serviceOptions = useMemo(() => {
    const providers = providerId
      ? serviceProviders.filter(({ id }) => id === providerId)
      : categoryProviders;
    const guideServices = providerId
      ? []
      : serviceGuides
        .filter((guide) => !category || guide.category === category)
        .flatMap((guide) => guide.offerings.map(({ name }) => name));
    const options = Array.from(new Set([...providers.flatMap(({ services }) => services), ...guideServices]));
    return (options.length > 0 ? options : category ? [`General ${category} request`] : [])
      .sort((a, b) => a.localeCompare(b));
  }, [category, categoryProviders, providerId]);

  function persistRequests(nextRequests: BookingRequest[]) {
    try {
      window.localStorage.setItem(bookingRequestStorageKey, JSON.stringify(nextRequests));
      setRequests(nextRequests);
      setStorageError("");
      return true;
    } catch {
      setStorageError("Your browser could not save this request. Check available storage and try again.");
      return false;
    }
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setProviderId("");
    setService("");
  }

  function handleProviderChange(value: string) {
    const nextProvider = serviceProviders.find(({ id }) => id === value);
    setProviderId(value);
    if (nextProvider) {
      setCategory(nextProvider.category);
      setService(nextProvider.services.includes(service) ? service : "");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (!isReady || storageError) {
      setFeedback("Please resolve the browser storage issue before saving your request.");
      return;
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      setFeedback("Enter a valid phone number with 10 to 13 digits.");
      return;
    }
    if (preferredDate < getLocalDateString(new Date())) {
      setFeedback("Choose today or a future date for your service request.");
      return;
    }

    const request: BookingRequest = {
      id: window.crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      service,
      category,
      providerId,
      providerName: selectedProvider?.name ?? "",
      preferredDate,
      preferredTime,
      area: area.trim(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      details: details.trim(),
    };

    if (persistRequests([request, ...requests])) {
      setFeedback("Your request is saved on this device. It has not been sent to KardoFix yet.");
      setPreferredDate("");
      setArea("");
      setCustomerName("");
      setPhone("");
      setDetails("");
    }
  }

  function removeRequest(id: string) {
    if (persistRequests(requests.filter((request) => request.id !== id))) {
      setFeedback("The saved request was removed from this device.");
    }
  }

  function clearRequests() {
    try {
      window.localStorage.removeItem(bookingRequestStorageKey);
      setRequests([]);
      setStorageError("");
      setFeedback("All saved requests were removed from this device.");
    } catch {
      setStorageError("Your browser could not remove the saved requests. Check your browser storage settings.");
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
            <p>Choose a service, share a few details, and save a request to continue when you’re ready.</p>
          </div>
          <Link className={styles.browseLink} href="/service-providers">Browse providers <span aria-hidden="true">→</span></Link>
        </header>

        <div className={styles.notice} role="note">
          <span aria-hidden="true">i</span>
          <p><strong>Stored in this browser:</strong> request details, including your phone number, are saved in this device’s browser storage and are not encrypted. Nothing is sent to KardoFix until you choose “Email KardoFix” and send it from your email app. This demo does not confirm a booking.</p>
        </div>

        <div className={styles.layout}>
          <section className={styles.formCard} aria-labelledby="request-form-title">
            <div className={styles.cardHeading}>
              <span className={styles.step}>01</span>
              <div><h2 id="request-form-title">Plan your service</h2><p>Fields marked <span aria-hidden="true">*</span> are required.</p></div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Service category <span aria-hidden="true">*</span></span>
                  <select value={category} required onChange={(event) => handleCategoryChange(event.target.value)}>
                    <option value="">Choose a category</option>
                    {serviceCategories.map(({ label }) => <option key={label} value={label}>{label}</option>)}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Service needed <span aria-hidden="true">*</span></span>
                  <select value={service} required onChange={(event) => setService(event.target.value)}>
                    <option value="">Choose a service</option>
                    {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              </div>

              <label className={styles.field}>
                <span>Preferred provider <span className={styles.optional}>Optional</span></span>
                <select
                  value={providerId}
                  onChange={(event) => handleProviderChange(event.target.value)}
                >
                  <option value="">No preference — find a match</option>
                  {categoryProviders.map((provider) => <option key={provider.id} value={provider.id}>{provider.name} · {provider.location}</option>)}
                </select>
                <small>Provider profiles and prices are sample data and need confirmation.</small>
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Preferred date <span aria-hidden="true">*</span></span>
                  <input type="date" min={minimumDate || undefined} value={preferredDate} required onChange={(event) => setPreferredDate(event.target.value)} />
                </label>
                <label className={styles.field}>
                  <span>Preferred time <span aria-hidden="true">*</span></span>
                  <select value={preferredTime} required onChange={(event) => setPreferredTime(event.target.value)}>
                    {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </label>
              </div>

              <label className={styles.field}>
                <span>Service area <span aria-hidden="true">*</span></span>
                <input type="text" autoComplete="address-level2" maxLength={100} placeholder="Neighbourhood or locality (no full address)" value={area} required onChange={(event) => setArea(event.target.value)} />
                <small>Please share only your locality here. Don’t include a full street address.</small>
              </label>

              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span>Your name <span aria-hidden="true">*</span></span>
                  <input type="text" autoComplete="name" maxLength={80} value={customerName} required onChange={(event) => setCustomerName(event.target.value)} />
                </label>
                <label className={styles.field}>
                  <span>Phone number <span aria-hidden="true">*</span></span>
                  <input type="tel" autoComplete="tel" inputMode="tel" maxLength={18} placeholder="+91 98765 43210" value={phone} required onChange={(event) => setPhone(event.target.value)} />
                  <small>Saved on this device; shared only if you email the request.</small>
                </label>
              </div>

              <label className={styles.field}>
                <span>What should the provider know? <span className={styles.optional}>Optional</span></span>
                <textarea maxLength={500} rows={4} placeholder="Describe the job briefly. Please don’t include sensitive information." value={details} onChange={(event) => setDetails(event.target.value)} />
                <small className={styles.characterCount}>{details.length}/500</small>
              </label>

              {feedback && <p className={styles.feedback} role="status">{feedback}</p>}
              {storageError && <p className={styles.error} role="alert">{storageError} <button type="button" onClick={clearRequests}>Clear saved requests</button></p>}

              <button className={styles.submitButton} type="submit" disabled={!isReady || Boolean(storageError)}>
                Save request on this device <span aria-hidden="true">→</span>
              </button>
              <p className={styles.formFootnote}>No payment is taken. Availability and final pricing must be confirmed before a booking is agreed.</p>
            </form>
          </section>

          <aside className={styles.sideColumn}>
            <section className={styles.helpCard}>
              <span className={styles.helpIcon} aria-hidden="true">✓</span>
              <h2>What happens next?</h2>
              <ol>
                <li><span>1</span><p>Save your request in this browser.</p></li>
                <li><span>2</span><p>Review it below and choose to email KardoFix.</p></li>
                <li><span>3</span><p>Send the email yourself. KardoFix must confirm availability and price.</p></li>
              </ol>
              <a href="mailto:support@kardofix.com?subject=Help%20with%20a%20service%20request">Need help? Contact support</a>
            </section>
            <section className={styles.privacyCard}>
              <h2>Manage saved details</h2>
              <p>This prototype has no booking server. Your saved requests stay in this browser and can be removed at any time. Browser storage is not encrypted, so avoid saving personal details on a shared device.</p>
            </section>
          </aside>
        </div>

        <section className={styles.savedSection} aria-labelledby="saved-requests-title">
          <div className={styles.savedHeading}>
            <div><p className={styles.eyebrow}>SAVED ON THIS DEVICE</p><h2 id="saved-requests-title">Your service requests <span>{requests.length}</span></h2></div>
            {requests.length > 0 && <button className={styles.clearButton} type="button" onClick={clearRequests}>Remove all</button>}
          </div>

          {!isReady ? (
            <p className={styles.emptyState}>Loading saved requests…</p>
          ) : requests.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon} aria-hidden="true">⌁</span>
              <h3>No saved requests yet</h3>
              <p>Complete the form above to save a service request on this device.</p>
            </div>
          ) : (
            <div className={styles.requestList}>
              {requests.map((request) => (
                <article className={styles.requestCard} key={request.id}>
                  <div className={styles.requestTop}>
                    <div><span className={styles.status}>Saved · not sent</span><h3>{request.service}</h3><p>{request.category}{request.providerName ? ` · ${request.providerName}` : " · No provider preference"}</p></div>
                    <button className={styles.removeButton} type="button" onClick={() => removeRequest(request.id)} aria-label={`Remove ${request.service} request`}>Remove</button>
                  </div>
                  <dl className={styles.requestDetails}>
                    <div><dt>Date & time</dt><dd>{request.preferredDate} · {request.preferredTime}</dd></div>
                    <div><dt>Area</dt><dd>{request.area}</dd></div>
                    <div><dt>Contact</dt><dd>{request.customerName} · {request.phone}</dd></div>
                  </dl>
                  {request.details && <p className={styles.requestNote}>{request.details}</p>}
                  <a className={styles.emailButton} href={getEmailHref(request)}>Email KardoFix <span aria-hidden="true">↗</span></a>
                  <p className={styles.emailNote}>Opens your email app with these details. The request is sent only if you send that email.</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
