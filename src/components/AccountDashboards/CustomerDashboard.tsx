import Link from "next/link";
import styles from "./AccountDashboards.module.scss";
import type { AccountProfile } from "@/lib/auth/account";

export default function CustomerDashboard({ profile }: { profile: AccountProfile }) {
  return (
    <main className={styles.page}>
      <section className={styles.welcome}>
        <p className={styles.eyebrow}>CUSTOMER ACCOUNT</p>
        <h1>Welcome, {profile.display_name}</h1>
        <p>Your KardoFix customer account is ready. Find a professional or send a service request when you need help.</p>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} href="/services">Browse services</Link>
          <Link className={styles.secondaryAction} href="/bookings">Request a service</Link>
        </div>
      </section>
      <section className={styles.infoCard}>
        <h2>Your account</h2>
        <dl>
          <div><dt>Name</dt><dd>{profile.display_name}</dd></div>
          <div><dt>Email</dt><dd>{profile.email}</dd></div>
          <div><dt>Account type</dt><dd>Customer</dd></div>
        </dl>
        <p>Service requests are not yet linked to an account history. Keep your request reference for follow-up.</p>
      </section>
    </main>
  );
}
