"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { serviceCategories } from "@/data/serviceCategories";
import styles from "./ServicesCatalog.module.scss";

const categories = [
  "All Categories",
  ...serviceCategories.map(({ label }) => label),
];

const services = [
  { category: "Cleaning & Home Care", description: "Home, kitchen, sofa, deep cleaning and more.", count: 6, icon: "cleaning" },
  { category: "Plumbing", description: "Tap repair, pipe fitting, leak fixing and more.", count: 12, icon: "plumbing" },
  { category: "Electrical", description: "Wiring, light installation, fan repair and more.", count: 15, icon: "electrical" },
  { category: "Appliances Repair", description: "AC, fridge, washing machine, microwave and more.", count: 20, icon: "appliance" },
  { category: "Carpentry & Furniture", description: "Custom furniture, repair, modular work and more.", count: 14, icon: "carpentry" },
  { category: "Painting", description: "Home painting, wall texture, polish and more.", count: 11, icon: "painting" },
  { category: "Pest Control", description: "Cockroach, termite, rodent control and more.", count: 10, icon: "pest" },
  { category: "AC Services", description: "AC installation, repair, servicing and more.", count: 9, icon: "ac" },
  { category: "Home Security", description: "CCTV installation, video door phone and more.", count: 8, icon: "security" },
  { category: "Beauty & Wellness", description: "Salon at home, massage, makeup and more.", count: 16, icon: "beauty" },
  { category: "Packers & Movers", description: "Home shifting, office shifting, packaging and more.", count: 7, icon: "moving" },
  { category: "Events & Occasions", description: "Decor, catering, photography and more.", count: 9, icon: "events" },
  { category: "Home Tutor", description: "Tutoring for kids, matriculation, senior studies, and Quran learning.", count: 4, icon: "tutor" },
  { category: "Home Maid", description: "Reliable home help for everyday household tasks.", count: 3, icon: "maid" },
  { category: "Cooking Services", description: "Find experienced home cooks and chefs for meals at home.", count: 3, icon: "cooking" },
  { category: "Nursing Services", description: "Find qualified nursing professionals for attentive care at home.", count: 3, icon: "nursing" },
  { category: "Other Services", description: "A range of additional home maintenance and support services.", count: 6, icon: "other" },
];

type ServiceIconName = (typeof services)[number]["icon"];

function ServiceIcon({ name }: { name: ServiceIconName }) {
  const props = {
    viewBox: "0 0 64 64",
    className: styles.serviceIconIllustration,
    "aria-hidden": true,
  };

  switch (name) {
    case "cleaning":
      return (
        <svg {...props}>
          <path d="M19 48h29" stroke="#1D6680" strokeWidth="3" strokeLinecap="round" />
          <path d="m23 46 8-24 7 2-8 24z" fill="#1C6380" />
          <path d="m29 23 2-6 10 3-2 6" fill="#F6B84A" stroke="#1C6380" strokeWidth="2" strokeLinejoin="round" />
          <path d="m37 22 3-8 10 3-3 8" fill="#F06D56" stroke="#1C6380" strokeWidth="2" strokeLinejoin="round" />
          <path d="M16 20h5m-2.5-2.5v5M47 35h5m-2.5-2.5v5" stroke="#2FAD91" strokeWidth="2" strokeLinecap="round" />
          <path d="m42 45 3 3 6-7" fill="none" stroke="#2FAD91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "plumbing":
      return (
        <svg {...props}>
          <path d="M20 20v13a12 12 0 0 0 12 12h5a8 8 0 0 0 8-8v-4" fill="none" stroke="#2464A8" strokeWidth="7" strokeLinecap="round" />
          <path d="M16 16h10v9H16z" fill="#4B95D6" stroke="#2464A8" strokeWidth="2" />
          <path d="M39 28h12v7H39z" fill="#4B95D6" stroke="#2464A8" strokeWidth="2" />
          <path d="M45 42c0-3 4-7 4-7s4 4 4 7a4 4 0 0 1-8 0Z" fill="#51BCE2" />
          <path d="M20 18v-4m-3 4v-4m26 17h4" stroke="#2464A8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "electrical":
      return (
        <svg {...props}>
          <path d="M32 13a14 14 0 0 0-9 24.7c2.3 2 3.5 4 3.5 6.3h11c0-2.3 1.2-4.3 3.5-6.3A14 14 0 0 0 32 13Z" fill="#FFD064" stroke="#D99420" strokeWidth="2.5" />
          <path d="M27 44h10v4a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4z" fill="#F4A93B" stroke="#D99420" strokeWidth="2" />
          <path d="m34 20-8 12h7l-3 8 10-13h-7l3-7Z" fill="#F26A46" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M17 29h3m24 0h3M21 19l2 2m18 18 2 2" stroke="#E8A83B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "appliance":
      return (
        <svg {...props}>
          <rect x="18" y="11" width="28" height="42" rx="5" fill="#fff" stroke="#6756B8" strokeWidth="2.5" />
          <path d="M20.5 20h23" stroke="#6756B8" strokeWidth="2" />
          <circle cx="32" cy="36" r="10" fill="#D9D4FF" stroke="#6756B8" strokeWidth="2.5" />
          <circle cx="32" cy="36" r="5.5" fill="#A9C9F8" stroke="#6756B8" strokeWidth="1.5" />
          <circle cx="24" cy="15.5" r="1.5" fill="#F28C63" />
          <path d="M39 15.5h4" stroke="#6756B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "carpentry":
      return (
        <svg {...props}>
          <path d="m22 44 21-21" stroke="#8A4F2C" strokeWidth="6" strokeLinecap="round" />
          <path d="m39 12 12 12-6 6-12-12z" fill="#F2B84A" stroke="#8A4F2C" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="m17 39 7 7-5 5-7-7z" fill="#D88A4B" stroke="#8A4F2C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M18 18h12v4H18zM20 22v13m8-13v13M17 35h14v4H17z" fill="#E9A86C" stroke="#8A4F2C" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "painting":
      return (
        <svg {...props}>
          <path d="M18 17h29v12H18z" fill="#F16B58" stroke="#A84942" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M23 29v8h17v-8m-8 8v12" fill="none" stroke="#536785" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 17v-4h21v4" fill="#FFD36A" stroke="#A84942" strokeWidth="2" strokeLinejoin="round" />
          <path d="M49 36c0 3-2.5 5-2.5 5S44 39 44 36a2.5 2.5 0 0 1 5 0Z" fill="#F16B58" />
        </svg>
      );
    case "pest":
      return (
        <svg {...props}>
          <path d="m32 12 17 6v12c0 10-7.5 17-17 22-9.5-5-17-12-17-22V18z" fill="#51A875" stroke="#28734D" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M27 27c0-3 2-5 5-5s5 2 5 5v8c0 3-2 5-5 5s-5-2-5-5z" fill="#FFE08A" stroke="#28734D" strokeWidth="2" />
          <circle cx="30" cy="30" r="1" fill="#28734D" />
          <circle cx="34" cy="30" r="1" fill="#28734D" />
          <path d="M27 28 23 26m14 2 4-2m-14 8-4 2m14-2 4 2m-9-14v-4m-4 2-2-3m10 3 2-3" fill="none" stroke="#28734D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "ac":
      return (
        <svg {...props}>
          <rect x="12" y="16" width="40" height="20" rx="5" fill="#fff" stroke="#4285B8" strokeWidth="2.5" />
          <path d="M17 29h30m-25 5 3 4m7-4 3 4m7-4 3 4" fill="none" stroke="#52A9D7" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 22h28" stroke="#A5D5EE" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="22" r="1.7" fill="#52A9D7" />
          <path d="M25 47v-6m-3 3h6m8 3v-6m-3 3h6" stroke="#52A9D7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "security":
      return (
        <svg {...props}>
          <path d="m32 11 18 7v12c0 11-8.2 18-18 23-9.8-5-18-12-18-23V18z" fill="#5978D3" stroke="#344F9C" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="24" y="28" width="16" height="13" rx="3" fill="#fff" />
          <path d="M27 28v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="34" r="2" fill="#5978D3" />
          <path d="M32 35v2" stroke="#5978D3" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "beauty":
      return (
        <svg {...props}>
          <rect x="14" y="17" width="36" height="30" rx="7" fill="#fff" stroke="#C14F83" strokeWidth="2.5" />
          <path d="M23 17v30" stroke="#E7A2BE" strokeWidth="2" />
          <circle cx="34" cy="28" r="6" fill="#FFD36A" />
          <circle cx="44" cy="27" r="3" fill="#F486A8" />
          <circle cx="30" cy="39" r="3" fill="#7CBCC0" />
          <path d="m39 36 4 4m0-4-4 4" stroke="#C14F83" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 14c2-3 5-4 8-4" fill="none" stroke="#C14F83" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "moving":
      return (
        <svg {...props}>
          <path d="M10 21h27v23H10z" fill="#F2A64A" stroke="#A86927" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M37 28h10l7 8v8H37z" fill="#F7C66B" stroke="#A86927" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M41 31h5l4 5H41z" fill="#DFF2FF" />
          <circle cx="20" cy="46" r="4" fill="#43556E" stroke="#fff" strokeWidth="2" />
          <circle cx="44" cy="46" r="4" fill="#43556E" stroke="#fff" strokeWidth="2" />
          <path d="M16 27h14m-14 6h9m-9 6h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "events":
      return (
        <svg {...props}>
          <rect x="14" y="18" width="36" height="32" rx="5" fill="#fff" stroke="#7257C8" strokeWidth="2.5" />
          <path d="M14 27h36" stroke="#7257C8" strokeWidth="2.5" />
          <path d="M23 14v8m18-8v8" stroke="#F28A64" strokeWidth="4" strokeLinecap="round" />
          <path d="m24 37 5 5 11-11" fill="none" stroke="#50A982" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m17 12 1-3m28 6 2-3" stroke="#F2B84A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "tutor":
      return (
        <svg {...props}>
          <path d="M12 12 32 19l20-7-20-7-20 7 20 7Z" fill="#6C82D9" stroke="#4559A8" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M21 15v11c6 5 16 5 22 0V15" fill="#E8EDFF" stroke="#4559A8" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M51 13v15" stroke="#4559A8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="51" cy="31" r="3" fill="#F2B84A" />
          <path d="M22 40h20" stroke="#2FAD91" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "maid":
      return (
        <svg {...props}>
          <path d="M17 28a8 8 0 1 0-16 0c0 4 3 7 8 7s8-3 8-7Z" transform="translate(20 0)" fill="#F2B98C" stroke="#996947" strokeWidth="2.5" />
          <path d="M14 54c1-10 7-16 18-16s17 6 18 16" fill="#6BA98B" stroke="#47775F" strokeWidth="2.5" />
          <path d="m43 23 7 7m-6-10 7 6" stroke="#4F7296" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 30 55 38" stroke="#C59054" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "cooking":
      return (
        <svg {...props}>
          <path d="M17 29a9 9 0 0 0-18 0v5h18z" transform="translate(15 0)" fill="#F2B84A" stroke="#B77A1D" strokeWidth="2.5" />
          <path d="M21 34v13h22V34M18 47h28v6H18z" fill="#F7F9FC" stroke="#65758D" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M27 39h10m-10 5h10" stroke="#E78055" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 13c-2-3 2-4 0-7m8 7c-2-3 2-4 0-7" fill="none" stroke="#54AFC1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "nursing":
      return (
        <svg {...props}>
          <path d="M32 53S12 41 12 27a11 11 0 0 1 20-6 11 11 0 0 1 20 6c0 14-20 26-20 26Z" fill="#F7DCE4" stroke="#C45D79" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M29 22h6v7h7v6h-7v7h-6v-7h-7v-6h7z" fill="#fff" stroke="#C45D79" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="32" cy="32" r="18" fill="#fff" stroke="#59708E" strokeWidth="2.5" />
          <path d="M32 22v20m-10-10h20" stroke="#59708E" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="32" r="4" fill="#F0B44C" />
        </svg>
      );
  }
}

function CategoryIcon({ label }: { label: string }) {
  const categoryIconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: styles.categoryIconSvg,
  };

  switch (label) {
    case "Cleaning & Home Care":
      return <svg {...categoryIconProps}><path d="M8 8h8M9 18v-5.5m6 0V18M6 18h12M9 12.5c0-2.4 1.3-4 3-4s3 1.6 3 4" /></svg>;
    case "Plumbing":
      return <svg {...categoryIconProps}><path d="M6 4h4v4H6zm8 12h4v4h-4zM6 8v5c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V8" /><path d="M7 4v8m10-8v8" /></svg>;
    case "Electrical":
      return <svg {...categoryIconProps}><path d="M12 2 5 13h5l-1 9 9-12h-6l1-8Z" /></svg>;
    case "Appliances Repair":
      return <svg {...categoryIconProps}><rect x="5" y="4" width="14" height="16" rx="2.4" /><path d="M8 9h8M9 18h6M10 14h4" /></svg>;
    case "Carpentry & Furniture":
      return <svg {...categoryIconProps}><path d="M6 18 18 6m-9 0 3-3 9 9-3 3-9-9Zm-3 3 3-3" /><path d="M12 6l6 6" /></svg>;
    case "Painting":
      return <svg {...categoryIconProps}><path d="M4 6.5h10.5v7.5H4zm4.5 7.5V20M12.5 10.5H19v3h-6.5" /><path d="M4 6.5V4.3C4 3.6 4.6 3 5.3 3h9.6c.7 0 1.3.6 1.3 1.3V6.5" /></svg>;
    case "Pest Control":
      return <svg {...categoryIconProps}><path d="M8 7.5c0-1.7 1.3-3 3-3s3 1.3 3 3v1.6c0 1.5-.7 2.9-1.9 3.8l-1.3 1.1-1.3-1.1A4.6 4.6 0 0 1 8 9.1V7.5Z" /><path d="M7 15.5c0 2.5 2 4.5 5 4.5s5-2 5-4.5" /><path d="m12 12 .5-4M9 15h6" /></svg>;
    case "AC Services":
      return <svg {...categoryIconProps}><path d="M4 11h16M7 7h10v10H7zM9 7V5m6 2V5M10 15h4" /></svg>;
    case "Home Security":
      return <svg {...categoryIconProps}><path d="M12 3.5 18 5.5v6.6c0 3.2-2.2 6.2-6 8.4-3.8-2.2-6-5.2-6-8.4V5.5l6-2Z" /><path d="M9 12l2 2 4-5" /></svg>;
    case "Beauty & Wellness":
      return <svg {...categoryIconProps}><path d="M12 4.3c-1.5 0-2.8 1.2-2.8 2.8S10.5 10 12 10s2.8-1.2 2.8-2.9S13.5 4.3 12 4.3Zm-4.8 8.8 3.5-3.5 1.3 1.3 1.5-1.5 4.4 4.4a3 3 0 0 1-4.3 4.3l-1.8-1.8-1.8 1.8a3 3 0 1 1-4.3-4.3l1.9-1.9Z" /></svg>;
    case "Packers & Movers":
      return <svg {...categoryIconProps}><path d="M4 9h11v8H4zm11 0h5l2 3v5h-7V9ZM8 19v2m8-2v2" /><circle cx="8" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>;
    case "Events & Occasions":
      return <svg {...categoryIconProps}><path d="M7 4v2M17 4v2M4 9h16M6 7h12a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" /><path d="M9 13h6M9 16h4" /></svg>;
    case "Home Tutor":
      return <svg {...categoryIconProps}><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 11v5c3 2.5 7 2.5 10 0v-5m4-2v7" /></svg>;
    case "Home Maid":
      return <svg {...categoryIconProps}><path d="M8 11a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" /><path d="M4 21c.7-4.2 3.3-6.3 8-6.3s7.3 2.1 8 6.3M17 4l3 3m-2-4 3 3" /></svg>;
    case "Cooking Services":
      return <svg {...categoryIconProps}><path d="M5 10h14l-1 10H6L5 10Z" /><path d="M4 10a8 8 0 0 1 16 0M9 5c-1-2 1-2 0-4m6 4c-1-2 1-2 0-4" /></svg>;
    case "Nursing Services":
      return <svg {...categoryIconProps}><path d="M12 20s-7-4.2-7-9.2a4.2 4.2 0 0 1 7-3.1 4.2 4.2 0 0 1 7 3.1C19 15.8 12 20 12 20Z" /><path d="M11 9h2v2h2v2h-2v2h-2v-2H9v-2h2z" /></svg>;
    case "Other Services":
      return <svg {...categoryIconProps}><circle cx="12" cy="12" r="8" /><path d="M9 12h6M12 9v6" /></svg>;
    default:
      return <svg {...categoryIconProps}><circle cx="12" cy="12" r="8" /><path d="M9 12h6M12 9v6" /></svg>;
  }
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export default function ServicesCatalog() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("Popular");

  const visibleServices = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const filtered = services.filter((service) => {
      const matchesCategory = activeCategory === "All Categories" || service.category === activeCategory;
      const matchesSearch = !query || `${service.category} ${service.description}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    return sortOrder === "A to Z"
      ? [...filtered].sort((a, b) => a.category.localeCompare(b.category))
      : filtered;
  }, [activeCategory, searchText, sortOrder]);

  return (
    <div className={styles.page}>
      <section className={styles.introSection}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Services</span>
          </nav>

          <div className={styles.intro}>
            <div className={styles.introCopy}>
              <p className={styles.eyebrow}>KARDOFIX SERVICES</p>
              <h1>Explore our services</h1>
              <p>Professional services for your home and everyday needs.<br />Find, book and get quality work done.</p>
            </div>
          </div>

          <div className={styles.searchPanel}>
            <label className={`${styles.field} ${styles.serviceField}`}>
              <span>What service do you need?</span>
              <span className={styles.inputWrap}>
                <input
                  type="search"
                  placeholder="Search for services (e.g. Plumbing, Cleaning)"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
                <SearchIcon />
              </span>
            </label>
            <label className={styles.field}>
              <span>Location</span>
              <span className={styles.selectWrap}>
                <PinIcon />
                <select defaultValue="Delhi, India" aria-label="Location">
                  <option>Delhi, India</option>
                  <option>Mumbai, India</option>
                  <option>Lahore</option>
                </select>
              </span>
            </label>
            <label className={styles.field}>
              <span>Sort by</span>
              <span className={styles.selectWrap}>
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort services">
                  <option>Popular</option>
                  <option>A to Z</option>
                </select>
              </span>
            </label>
            <button type="button" className={styles.searchButton} onClick={() => setActiveCategory("All Categories")}>
              Search Services
            </button>
          </div>
        </div>
      </section>

      <section className={styles.catalog} aria-label="Browse services">
        <div className={styles.container}>
          <div className={styles.catalogLayout}>
            <aside className={styles.sidebar}>
              <h2>Categories</h2>
              <nav aria-label="Service categories">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={activeCategory === category ? styles.categoryActive : ""}
                    onClick={() => setActiveCategory(category)}
                  >
                    <CategoryIcon label={category} />
                    <span>{category}</span>
                  </button>
                ))}
              </nav>
              <div className={styles.requestCard}>
                <span className={styles.requestIcon} aria-hidden="true">♡</span>
                <strong>Can&apos;t find the service?</strong>
                <p>We&apos;ll help you find the right professional.</p>
                <a href="mailto:support@kardofix.com">Request a Service</a>
              </div>
            </aside>

            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <div>
                  <h2>{activeCategory === "All Categories" ? "All home services" : activeCategory}</h2>
                </div>
                <span>{visibleServices.length} categories</span>
              </div>
              {visibleServices.length > 0 ? (
                <div className={styles.serviceGrid}>
                  {visibleServices.map((service) => {
                    const cardContent = (
                      <>
                        <div className={`${styles.serviceIcon} ${styles[`icon-${service.icon}`]}`}>
                          <ServiceIcon name={service.icon} />
                        </div>
                        <h3>{service.category}</h3>
                        <p>{service.description}</p>
                        {service.category === "Cleaning & Home Care" || service.category === "Home Tutor" || service.category === "Home Maid" || service.category === "Cooking Services" || service.category === "Nursing Services" ? (
                          <span className={styles.cardAction}>
                            {service.category === "Home Tutor"
                              ? "Explore Tutors"
                              : service.category === "Nursing Services"
                                ? "Explore Nurses"
                              : `Explore ${service.count} Services`} <span aria-hidden="true">→</span>
                          </span>
                        ) : (
                          <a href={`mailto:support@kardofix.com?subject=${encodeURIComponent(service.category)}`}>
                            {service.count} Services <span aria-hidden="true">→</span>
                          </a>
                        )}
                      </>
                    );
                    const cardId = serviceCategories.find(({ label }) => label === service.category)?.slug;

                    return service.category === "Cleaning & Home Care" || service.category === "Home Tutor" || service.category === "Home Maid" || service.category === "Cooking Services" || service.category === "Nursing Services" ? (
                      <Link
                        className={`${styles.serviceCard} ${styles.serviceCardLink}`}
                        href={
                          service.category === "Home Tutor"
                            ? "/service-providers?service=Home%20Tutor"
                            : service.category === "Home Maid"
                              ? "/service-providers?service=Home%20Maid"
                              : service.category === "Cooking Services"
                                ? "/service-providers?service=Cooking%20Services"
                                : service.category === "Nursing Services"
                                  ? "/service-providers?service=Nursing%20Services"
                                  : "/services/cleaning-home-care"
                        }
                        id={cardId}
                        key={service.category}
                        aria-label={`Explore ${service.category} services`}
                      >
                        {cardContent}
                      </Link>
                    ) : (
                      <article className={styles.serviceCard} id={cardId} key={service.category}>
                        {cardContent}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.emptyState}>No services match your search. Try another term or category.</p>
              )}
            </div>
          </div>

          <section className={styles.trustBar} aria-label="Why choose KardoFix">
            <h2>Why choose KardoFix?</h2>
            <div><span aria-hidden="true">♙</span><p><strong>Verified Professionals</strong><small>Background verified experts</small></p></div>
            <div><span aria-hidden="true">◇</span><p><strong>Quality Assurance</strong><small>On-time, reliable service</small></p></div>
            <div><span aria-hidden="true">▤</span><p><strong>Transparent Pricing</strong><small>No hidden charges</small></p></div>
            <div><span aria-hidden="true">☺</span><p><strong>100% Satisfaction</strong><small>We&apos;re here to help</small></p></div>
          </section>
        </div>
      </section>
    </div>
  );
}
