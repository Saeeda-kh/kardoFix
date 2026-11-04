import Link from "next/link";
import styles from "./InfoPage.module.scss";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export default function InfoPage({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: InfoPageProps) {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href={primaryHref}>{primaryLabel}</Link>
          <a className={styles.secondaryButton} href={secondaryHref}>{secondaryLabel}</a>
        </div>
      </div>
      <div className={styles.decorativeOrb} aria-hidden="true" />
    </section>
  );
}
