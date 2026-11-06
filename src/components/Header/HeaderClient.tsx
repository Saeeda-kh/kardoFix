"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ServiceCategory } from "@/data/marketplace";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "./Header.module.scss";

const navItems = [
  { label: "Service Providers", href: "/service-providers" },
  { label: "Bookings", href: "/bookings" },
  { label: "Offers", href: "/offers" },
  { label: "Help", href: "/help" },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M5.25 7.5 10 12.25 14.75 7.5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 17s5-4.5 5-9a5 5 0 1 0-10 0c0 4.5 5 9 5 9Zm0-7.2a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z" />
    </svg>
  );
}

export default function HeaderClient({
  categories,
  initialAccountRole,
}: {
  categories: ServiceCategory[];
  initialAccountRole: "customer" | "provider" | "admin" | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [accountRole, setAccountRole] = useState(initialAccountRole);
  const [signOutError, setSignOutError] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isServicesActive = pathname.startsWith("/services");

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null;

    async function updateAccountRole(userId: string | null, metadataRole: unknown) {
      if (!userId) {
        if (active) {
          setAccountRole(null);
        }
        return;
      }
      if (metadataRole === "admin") {
        if (active) {
          setAccountRole("admin");
        }
        return;
      }
      if (!supabase) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (!active) return;
      if (error) {
        console.error("Could not load the account role for navigation.", error);
        setAccountRole(null);
      } else {
        setAccountRole(data?.role ?? null);
      }
    }

    let unsubscribe = () => {};
    Promise.resolve().then(async () => {
      if (!active) return;
      try {
        supabase = createSupabaseBrowserClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          setSignOutError("");
          if (event === "SIGNED_OUT") {
            setAccountRole(null);
            router.replace("/login");
            router.refresh();
            return;
          }
          window.setTimeout(() => {
            void updateAccountRole(session?.user.id ?? null, session?.user.app_metadata.role);
          }, 0);
        });
        unsubscribe = () => subscription.unsubscribe();

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        await updateAccountRole(data.session?.user.id ?? null, data.session?.user.app_metadata.role);
      } catch (error) {
        console.error("Could not initialize account navigation.", error);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  async function handleSignOut() {
    try {
      const { error } = await createSupabaseBrowserClient().auth.signOut();
      if (error) throw error;
      setAccountRole(null);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Could not sign out.");
    }
  }

  const visibleNavItems = accountRole === "provider"
    ? [{ label: "Provider account", href: "/dashboard/provider" }]
    : accountRole === "admin"
      ? [
          { label: "Provider approvals", href: "/admin/accounts" },
          { label: "Provider locations", href: "/admin/providers" },
        ]
      : navItems;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href={accountRole === "provider" ? "/dashboard/provider" : accountRole === "admin" ? "/admin/accounts" : "/"}
          className={styles.brand}
          aria-label={accountRole === "provider" ? "Provider dashboard" : accountRole === "admin" ? "Staff dashboard" : "KardoFix home"}
        >
          <Image
            src="/kardofix_logo.png"
            alt="KardoFix logo"
            width={240}
            height={75}
            priority
            className={styles.logo}
          />
        </Link>

        <button
          type="button"
          className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ""}`.trim()}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => {
            setIsMenuOpen((open) => !open);
            setIsServicesOpen(false);
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="main-navigation"
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`.trim()}
          aria-label="Main navigation"
        >
          {accountRole !== "provider" && accountRole !== "admin" && (
            <Link
              href="/"
              className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`.trim()}
              onClick={() => {
                setIsMenuOpen(false);
                setIsServicesOpen(false);
              }}
            >
              Home
            </Link>
          )}
          {accountRole !== "provider" && accountRole !== "admin" && <div
            className={`${styles.navDropdown} ${isServicesActive ? styles.navDropdownActive : ""} ${isServicesOpen ? styles.navDropdownOpen : ""}`.trim()}
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
            onFocusCapture={() => setIsServicesOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsServicesOpen(false);
              }
            }}
          >
            <div className={styles.navDropdownTrigger}>
              <Link
                href="/services"
                className={`${styles.navLink} ${isServicesActive ? styles.active : ""}`.trim()}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsServicesOpen(false);
                }}
              >
                Services
              </Link>
              <button
                type="button"
                className={styles.dropdownToggle}
                aria-label={isServicesOpen ? "Hide service categories" : "Show service categories"}
                aria-expanded={isServicesOpen}
                aria-controls="service-categories"
                onClick={() => setIsServicesOpen((open) => !open)}
              >
                <ChevronIcon />
              </button>
            </div>
            <div className={styles.submenu} id="service-categories">
              {categories.map((service) => (
                <Link
                  key={service.slug}
                  href={service.href}
                  className={pathname === service.href ? styles.submenuActive : ""}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsServicesOpen(false);
                  }}
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>}
          {visibleNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`.trim()}
              onClick={() => {
                setIsMenuOpen(false);
                setIsServicesOpen(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`${styles.actions} ${isMenuOpen ? styles.actionsOpen : ""}`.trim()}>
          {accountRole === null && (
            <>
              <button type="button" className={styles.locationButton} aria-label="Select your location">
                <LocationIcon />
                <span>Delhi, India</span>
                <ChevronIcon />
              </button>
              <Link className={styles.loginButton} href="/login">Login</Link>
              <Link className={styles.signupButton} href="/register">Sign Up</Link>
            </>
          )}
          {accountRole === "customer" && (
            <>
              <Link className={styles.accountLink} href="/dashboard/customer">My account</Link>
              <button type="button" className={styles.loginButton} onClick={handleSignOut}>Sign out</button>
            </>
          )}
          {accountRole === "provider" && (
            <>
              <Link className={styles.accountLink} href="/dashboard/provider">My provider account</Link>
              <button type="button" className={styles.loginButton} onClick={handleSignOut}>Sign out</button>
            </>
          )}
          {accountRole === "admin" && (
            <button type="button" className={styles.loginButton} onClick={handleSignOut}>Staff sign out</button>
          )}
        </div>
      </div>
      {signOutError && <p className={styles.authError} role="alert">{signOutError}</p>}
    </header>
  );
}
