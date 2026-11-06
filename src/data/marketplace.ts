import type { ServiceGuide } from "./serviceGuides";
import type { ServiceProvider } from "./serviceProviders";

export type ServiceCategory = {
  label: string;
  slug: string;
  href: string;
  description: string;
  count: number;
  icon: string;
  homeTitle: string | null;
  homePrice: number | null;
  showOnHome: boolean;
  isSample: boolean;
};

export type CustomerTestimonial = {
  id: string;
  name: string;
  city: string;
  text: string;
  isSample: boolean;
};

export type HomeServiceCategory = ServiceCategory & {
  homeTitle: string;
  homePrice: number;
};

export type MarketplaceOffering = {
  id: string;
  categorySlug: string;
  name: string;
  description: string;
  startingPrice: number | null;
};

export type MarketplaceProvider = ServiceProvider & {
  categorySlug: string;
};

export type MarketplaceGuide = ServiceGuide & {
  categorySlug: string;
};
