import Link from "next/link";
import Image from "next/image";
import styles from "./AccountDashboards.module.scss";
import type { AccountProfile } from "@/lib/auth/account";

export default function ProviderDashboard({
  profile,
  privateIdentity,
}: {
  profile: AccountProfile;
  privateIdentity: { nicNumber: string; photoUrl: string | null } | null;
}) {
  const isPending = profile.status === "pending_review";
  const isApproved = profile.status === "approved";

  return (
    <main className={styles.page}>
      <section className={styles.welcome}>
        <p className={styles.eyebrow}>SERVICE PROVIDER ACCOUNT</p>
        <h1>Welcome, {profile.display_name}</h1>
        <p>This is your service provider account. It is separate from the customer experience.</p>
      </section>
      <section className={styles.infoCard}>
        <h2>{isPending ? "Application under review" : isApproved ? "Provider account approved" : "Application not approved"}</h2>
        <p>
          {isPending
            ? "The KardoFix team is reviewing your provider account. We’ll contact you when there’s an update."
            : isApproved
              ? "Your provider account is approved. Contact the KardoFix team to complete your public service listing and business location."
              : "The KardoFix team could not approve this provider application. Contact support if you believe this needs another review."}
        </p>
        <dl>
          <div><dt>Name</dt><dd>{profile.display_name}</dd></div>
          <div><dt>Email</dt><dd>{profile.email}</dd></div>
          <div><dt>Account status</dt><dd>{profile.status.replaceAll("_", " ")}</dd></div>
        </dl>
        <Link className={styles.secondaryAction} href="mailto:support@kardofix.com?subject=Provider%20account">
          Contact KardoFix support
        </Link>
      </section>
      <section className={styles.infoCard}>
        <h2>Your private identity details</h2>
        <p>These details are visible only to you and authorized KardoFix staff. They are not included in public provider listings.</p>
        {privateIdentity ? (
          <dl>
            <div><dt>NIC card number</dt><dd>{privateIdentity.nicNumber}</dd></div>
            {privateIdentity.photoUrl && (
              <div>
                <dt>Submitted photo</dt>
                <dd>
                  <Image
                    className={styles.privatePhoto}
                    src={privateIdentity.photoUrl}
                    alt="Your private provider application photo"
                    width={220}
                    height={240}
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p>Your private identity details have not been submitted. Contact KardoFix support to complete your application.</p>
        )}
      </section>
    </main>
  );
}
