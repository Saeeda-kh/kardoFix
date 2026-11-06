"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AccountRole } from "@/lib/auth/account";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "./AccountAccess.module.scss";

type AccountAccessFormProps = {
  mode: "login" | "register";
  role: AccountRole;
};

const roleLabels = {
  customer: "Customer",
  provider: "Service provider",
} as const;

export default function AccountAccessForm({ mode, role }: AccountAccessFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setFeedbackIsError(false);
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      if (isRegister) {
        if (role === "provider") {
          const formData = new FormData(event.currentTarget);
          formData.set("redirectTo", `${window.location.origin}/auth/callback`);
          const response = await fetch("/api/provider-applications", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Could not submit the provider application.");

          if (result.confirmationRequired) {
            setFeedback("Check your email for a confirmation link. Your private provider documents were submitted securely.");
            return;
          }

          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });
          if (signInError) throw signInError;
          router.replace("/dashboard/provider");
          router.refresh();
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              account_type: role,
              display_name: displayName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        if (!data.session) {
          setFeedback("Check your email for a confirmation link. After confirming, sign in to continue.");
          return;
        }
        router.replace(`/dashboard/${role}`);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profileError) throw profileError;

      if (profile?.role !== role) {
        await supabase.auth.signOut();
        setFeedback(
          profile
            ? `This is not a ${roleLabels[role].toLowerCase()} account. Use the ${roleLabels[profile.role].toLowerCase()} sign-in instead.`
            : "This account does not have a KardoFix customer or provider profile. Contact support.",
        );
        setFeedbackIsError(true);
        return;
      }

      router.replace(`/dashboard/${role}`);
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "We could not complete that account request.");
      setFeedbackIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>KARDOFIX · {roleLabels[role].toUpperCase()}</p>
        <h1>{isRegister ? `Create your ${roleLabels[role].toLowerCase()} account` : `${roleLabels[role]} sign in`}</h1>
        <p className={styles.intro}>
          {role === "provider" && isRegister
            ? "Provider accounts are reviewed by the KardoFix team before approval."
            : role === "customer"
              ? "Your sign-in opens the customer experience."
              : "Your sign-in opens the service provider experience."}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Full name
              <input
                type="text"
                name="display_name"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                required
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {isRegister && <small>Use at least 8 characters.</small>}
          </label>

          {isRegister && role === "provider" && (
            <>
              <label>
                NIC card number
                <input
                  type="text"
                  name="nic_number"
                  autoComplete="off"
                  maxLength={80}
                  required
                />
              </label>
              <label>
                Recent photo of yourself
                <input
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  capture="user"
                  required
                />
                <small>Upload a clear photo of yourself (JPEG, PNG, or WebP; up to 5 MB).</small>
              </label>
              <p className={styles.privacyNotice}>
                Your photo and NIC are private. Only you and authorized KardoFix staff can access them; they are not shown on public listings.
              </p>
            </>
          )}

          {feedback && (
            <p className={feedbackIsError ? styles.error : styles.success} role={feedbackIsError ? "alert" : "status"}>
              {feedback}
            </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className={styles.switchMode}>
          {isRegister ? "Already have an account?" : "Need an account?"}{" "}
          <Link href={`/${isRegister ? "login" : "register"}/${role}`}>
            {isRegister ? "Sign in" : "Register as " + roleLabels[role].toLowerCase()}
          </Link>
        </p>
        <Link className={styles.backLink} href={`/${mode}`}>← Choose account type</Link>
      </section>
    </main>
  );
}
