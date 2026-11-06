import Link from "next/link";
import styles from "./AccountAccess.module.scss";

type AccountChoiceProps = {
  mode: "login" | "register";
};

export default function AccountChoice({ mode }: AccountChoiceProps) {
  const isRegister = mode === "register";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>KARDOFIX ACCOUNTS</p>
        <h1>{isRegister ? "How will you use KardoFix?" : "Choose your account"}</h1>
        <p className={styles.intro}>
          {isRegister
            ? "Choose an account type. Your account opens only the matching KardoFix experience."
            : "Sign in to the customer or service provider experience for your account."}
        </p>
        <div className={styles.choices}>
          <Link className={styles.choice} href={`/${mode}/customer`}>
            <span className={styles.choiceIcon} aria-hidden="true">⌂</span>
            <span>
              <strong>{isRegister ? "Customer" : "Customer account"}</strong>
              <small>{isRegister ? "Find and request trusted home services." : "Browse services and manage your customer account."}</small>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
          <Link className={styles.choice} href={`/${mode}/provider`}>
            <span className={styles.choiceIcon} aria-hidden="true">✦</span>
            <span>
              <strong>{isRegister ? "Service provider" : "Service provider account"}</strong>
              <small>{isRegister ? "Apply to offer services through KardoFix." : "Access your provider account and approval status."}</small>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
        <p className={styles.switchMode}>
          {isRegister ? "Already have an account?" : "New to KardoFix?"}{" "}
          <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link>
        </p>
      </section>
    </main>
  );
}
