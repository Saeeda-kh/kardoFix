"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "./AdminProviderAccounts.module.scss";

type ProviderAccount = Pick<
  Database["public"]["Tables"]["user_profiles"]["Row"],
  "id" | "display_name" | "email" | "status" | "created_at"
> & {
  privateIdentity: {
    nicNumber: string;
    photoUrl: string;
  } | null;
};
type ReviewStatus = Extract<ProviderAccount["status"], "pending_review" | "approved" | "rejected">;

export default function AdminProviderAccounts() {
  const [accounts, setAccounts] = useState<ProviderAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadAccounts() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: accountsData, error } = await supabase
          .from("user_profiles")
          .select("id, display_name, email, status, created_at")
          .eq("role", "provider")
          .order("created_at", { ascending: false });
        if (error) throw error;

        const { data: applications, error: applicationsError } = await supabase
          .from("provider_private_applications")
          .select("user_id, nic_number, photo_object_path");
        if (applicationsError) throw applicationsError;

        const applicationsByUser = new Map(
          await Promise.all(applications.map(async (application) => {
            const { data: photo, error: photoError } = await supabase.storage
              .from("provider-private-documents")
              .createSignedUrl(application.photo_object_path, 300);
            if (photoError) throw photoError;
            return [
              application.user_id,
              { nicNumber: application.nic_number, photoUrl: photo.signedUrl },
            ] as const;
          })),
        );
        if (active) {
          setAccounts(accountsData.map((account) => ({
            ...account,
            privateIdentity: applicationsByUser.get(account.id) ?? null,
          })));
        }
      } catch (error) {
        if (active) {
          setFeedback(error instanceof Error ? error.message : "Could not load provider applications.");
          setFeedbackIsError(true);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadAccounts();
    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(account: ProviderAccount, status: ReviewStatus) {
    setUpdatingId(account.id);
    setFeedback("");
    setFeedbackIsError(false);
    try {
      const { data, error } = await createSupabaseBrowserClient()
        .from("user_profiles")
        .update({ status })
        .eq("id", account.id)
        .eq("role", "provider")
        .select("id, display_name, email, status, created_at")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("No provider status was changed. Verify this account has the admin role.");
      setAccounts((current) => current.map((item) => item.id === data.id ? { ...item, ...data } : item));
      setFeedback(`${account.display_name}'s account is now ${status.replaceAll("_", " ")}.`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not update provider approval.");
      setFeedbackIsError(true);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>KARDOFIX STAFF</p>
        <h1>Provider applications</h1>
        <p className={styles.intro}>Review provider account details and private identity documents. Only authorized staff can access the submitted NIC and photo. Approval does not publish a service listing; the provider profile and business location must still be verified and set up.</p>
        {feedback && (
          <p className={feedbackIsError ? styles.error : styles.success} role={feedbackIsError ? "alert" : "status"}>
            {feedback}
          </p>
        )}
        {isLoading ? <p className={styles.status}>Loading applications…</p> : null}
        {!isLoading && accounts.length === 0 && <p className={styles.status}>There are no provider applications yet.</p>}
        <div className={styles.list}>
          {accounts.map((account) => (
            <article className={styles.account} key={account.id}>
              <div>
                <h2>{account.display_name}</h2>
                <p>{account.email}</p>
                <small>Submitted {new Date(account.created_at).toLocaleDateString()}</small>
                {account.privateIdentity ? (
                  <div className={styles.privateIdentity}>
                    <p><strong>NIC:</strong> {account.privateIdentity.nicNumber}</p>
                    <Image
                      src={account.privateIdentity.photoUrl}
                      alt={`Private application photo for ${account.display_name}`}
                      width={110}
                      height={110}
                      unoptimized
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : <p className={styles.missingIdentity}>Private photo and NIC not submitted</p>}
              </div>
              <span className={`${styles.statusBadge} ${styles[account.status]}`}>
                {account.status.replaceAll("_", " ")}
              </span>
              <div className={styles.actions}>
                <button
                  type="button"
                  disabled={updatingId === account.id || account.status === "approved"}
                  onClick={() => updateStatus(account, "approved")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className={styles.rejectButton}
                  disabled={updatingId === account.id || account.status === "rejected"}
                  onClick={() => updateStatus(account, "rejected")}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
