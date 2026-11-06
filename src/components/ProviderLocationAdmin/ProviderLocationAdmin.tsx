"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { MapCoordinates } from "@/components/MapLocationPicker/InteractiveMap";
import MapLocationPicker from "@/components/MapLocationPicker/MapLocationPicker";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { Database } from "@/lib/supabase/database.types";
import styles from "./ProviderLocationAdmin.module.scss";

type BrowserClient = ReturnType<typeof createSupabaseBrowserClient>;
type ProviderLocation = Pick<
  Database["public"]["Tables"]["service_providers"]["Row"],
  "id" | "name" | "location" | "business_latitude" | "business_longitude"
>;

export default function ProviderLocationAdmin() {
  const [client, setClient] = useState<BrowserClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [providers, setProviders] = useState<ProviderLocation[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [locationDraft, setLocationDraft] = useState<{
    providerId: string;
    coordinates: MapCoordinates | null;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [providersLoaded, setProvidersLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      try {
        const browserClient = createSupabaseBrowserClient();
        if (active) setClient(browserClient);
      } catch (error) {
        if (active) {
          setFeedback(error instanceof Error ? error.message : "Supabase is not configured.");
          setFeedbackIsError(true);
          setIsLoading(false);
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!client) return;
    let active = true;

    client.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (active) setSession(data.session);
    }).catch((error: unknown) => {
      if (active) {
        setFeedback(error instanceof Error ? error.message : "Could not check the staff session.");
        setFeedbackIsError(true);
      }
    }).finally(() => {
      if (active) setIsLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setFeedback("");
      if (nextSession?.user.app_metadata.role !== "admin") {
        setProvidersLoaded(false);
        setProviders([]);
        setSelectedProviderId("");
        setLocationDraft(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client]);

  const isAdmin = session?.user.app_metadata.role === "admin";
  const selectedProvider = useMemo(
    () => providers.find(({ id }) => id === selectedProviderId) ?? null,
    [providers, selectedProviderId],
  );
  const coordinates = selectedProvider && locationDraft?.providerId === selectedProvider.id
    ? locationDraft.coordinates
    : selectedProvider &&
        selectedProvider.business_latitude !== null &&
        selectedProvider.business_longitude !== null
      ? {
          latitude: selectedProvider.business_latitude,
          longitude: selectedProvider.business_longitude,
        }
      : null;

  useEffect(() => {
    if (!client || !isAdmin) return;

    let active = true;
    async function loadProviders(supabase: BrowserClient) {
      try {
        const { data, error } = await supabase
          .from("service_providers")
          .select("id, name, location, business_latitude, business_longitude")
          .order("name");
        if (error) throw error;
        if (active) {
          setProviders(data);
          setSelectedProviderId(data[0]?.id ?? "");
        }
      } catch (error) {
        if (active) {
          setFeedback(error instanceof Error ? error.message : "Could not load service providers.");
          setFeedbackIsError(true);
        }
      } finally {
        if (active) setIsLoading(false);
        if (active) setProvidersLoaded(true);
      }
    }

    void loadProviders(client);

    return () => {
      active = false;
    };
  }, [client, isAdmin]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) return;
    setFeedback("");
    setFeedbackIsError(false);
    try {
      const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      setPassword("");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not sign in.");
      setFeedbackIsError(true);
    }
  }

  async function handleSignOut() {
    if (!client) return;
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not sign out.");
      setFeedbackIsError(true);
    }
  }

  async function handleSave() {
    if (!client || !selectedProvider || !coordinates) {
      setFeedback("Choose a provider and place its business pin on the map.");
      setFeedbackIsError(true);
      return;
    }

    setIsSaving(true);
    setFeedback("");
    setFeedbackIsError(false);
    try {
      const { data, error } = await client
        .from("service_providers")
        .update({
          business_latitude: coordinates.latitude,
          business_longitude: coordinates.longitude,
        })
        .eq("id", selectedProvider.id)
        .select("id, business_latitude, business_longitude")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setFeedback("No provider location was updated. Confirm that your staff account has the admin role.");
        setFeedbackIsError(true);
      } else {
        setProviders((current) => current.map((provider) =>
          provider.id === data.id
            ? {
                ...provider,
                business_latitude: data.business_latitude,
                business_longitude: data.business_longitude,
              }
            : provider,
        ));
        setFeedback("Provider business location saved.");
      }
    } catch (error) {
      setFeedback(`Could not save this provider location: ${error instanceof Error ? error.message : "unexpected error"}`);
      setFeedbackIsError(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>KARDOFIX STAFF</p>
        <h1>Provider business locations</h1>
        <p className={styles.intro}>Set each provider’s exact business pin on the map. Only coordinates are saved; no address needs to be typed.</p>

        {feedback && (
          <p className={feedbackIsError ? styles.error : styles.success} role={feedbackIsError ? "alert" : "status"}>
            {feedback}
          </p>
        )}

        {isLoading ? <p className={styles.status}>Loading…</p> : null}

        {!isLoading && !session && (
          <form className={styles.signIn} onSubmit={handleSignIn}>
            <label>
              Staff email
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              Password
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button type="submit" disabled={!client}>Sign in</button>
          </form>
        )}

        {!isLoading && session && !isAdmin && (
          <div className={styles.accessMessage}>
            <p>This account does not have the KardoFix admin role.</p>
            <button type="button" onClick={handleSignOut}>Sign out</button>
          </div>
        )}

        {!isLoading && isAdmin && (
          <div className={styles.editor}>
            <div className={styles.toolbar}>
              <label>
                Service provider
                <select
                  value={selectedProviderId}
                  onChange={(event) => setSelectedProviderId(event.target.value)}
                  disabled={providers.length === 0}
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} · {provider.location}
                    </option>
                  ))}
                </select>
              </label>
              <button className={styles.signOut} type="button" onClick={handleSignOut}>Sign out</button>
            </div>
            {selectedProvider ? (
              <>
                <MapLocationPicker
                  key={selectedProvider.id}
                  label="Business location"
                  value={coordinates}
                  onChange={(nextCoordinates) => setLocationDraft({
                    providerId: selectedProvider.id,
                    coordinates: nextCoordinates,
                  })}
                />
                <button className={styles.saveButton} type="button" onClick={handleSave} disabled={!coordinates || isSaving}>
                  {isSaving ? "Saving location…" : "Save business location"}
                </button>
              </>
            ) : (
              <p className={styles.status}>
                {providersLoaded ? "No providers are available to update." : "Loading providers…"}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
