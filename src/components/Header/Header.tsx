"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { serviceCategories } from "@/data/serviceCategories";
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();
  const isServicesActive = pathname.startsWith("/services");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="KardoFix home">
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
          <div
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
              {serviceCategories.map((service) => (
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
          </div>
          {navItems.map((item) => (
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
          <button type="button" className={styles.locationButton} aria-label="Select your location">
            <LocationIcon />
            <span>Delhi, India</span>
            <ChevronIcon />
          </button>

          <button type="button" className={styles.loginButton}>
            Login
          </button>

          <button type="button" className={styles.signupButton}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
