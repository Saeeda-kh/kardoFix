"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.scss";

const navItems = ["Home", "Services", "How it Work", "Become a Pro", "About Us", "Contact Us"];

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

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#" className={styles.brand} aria-label="KardoFix home">
          <Image
            src="/kardofix_logo.png"
            alt="KardoFix logo"
            width={240}
            height={75}
            priority
            className={styles.logo}
          />
        </a>

        <button
          type="button"
          className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ""}`.trim()}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
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
          {navItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`${styles.navLink} ${index === 0 ? styles.active : ""}`.trim()}
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
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
