import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";
import { serviceCategories } from "../src/data/serviceCategories";
import { serviceGuides } from "../src/data/serviceGuides";
import { serviceProviders } from "../src/data/serviceProviders";

const catalogMetadata: Record<string, {
  description: string;
  count: number;
  icon: string;
  homeTitle?: string;
  homePrice?: number;
}> = {
  "Cleaning & Home Care": { description: "Home, kitchen, sofa, deep cleaning and more.", count: 6, icon: "cleaning" },
  Plumbing: { description: "Tap repair, pipe fitting, leak fixing and more.", count: 12, icon: "plumbing", homeTitle: "Plumber", homePrice: 399 },
  Electrical: { description: "Wiring, light installation, fan repair and more.", count: 15, icon: "electrical", homeTitle: "Electrician", homePrice: 299 },
  "Appliances Repair": { description: "AC, fridge, washing machine, microwave and more.", count: 20, icon: "appliance" },
  "Carpentry & Furniture": { description: "Custom furniture, repair, modular work and more.", count: 14, icon: "carpentry", homeTitle: "Carpentry", homePrice: 499 },
  Painting: { description: "Home painting, wall texture, polish and more.", count: 11, icon: "painting", homeTitle: "Painting", homePrice: 999 },
  "Pest Control": { description: "Cockroach, termite, rodent control and more.", count: 10, icon: "pest" },
  "AC Services": { description: "AC installation, repair, servicing and more.", count: 9, icon: "ac", homeTitle: "AC Technician", homePrice: 499 },
  "Home Security": { description: "CCTV installation, video door phone and more.", count: 8, icon: "security" },
  "Beauty & Wellness": { description: "Salon at home, massage, makeup and more.", count: 16, icon: "beauty" },
  "Packers & Movers": { description: "Home shifting, office shifting, packaging and more.", count: 7, icon: "moving" },
  "Events & Occasions": { description: "Decor, catering, photography and more.", count: 9, icon: "events" },
  "Home Tutor": { description: "Tutoring for kids, matriculation, senior studies, and Quran learning.", count: 4, icon: "tutor", homeTitle: "Home Tutor", homePrice: 500 },
  "Home Maid": { description: "Reliable home help for everyday household tasks.", count: 3, icon: "maid", homeTitle: "Home Maid", homePrice: 150 },
  "Cooking Services": { description: "Find experienced home cooks and chefs for meals at home.", count: 3, icon: "cooking", homeTitle: "Cooking Services", homePrice: 1200 },
  "Nursing Services": { description: "Find qualified nursing professionals for attentive care at home.", count: 3, icon: "nursing" },
  "Other Services": { description: "A range of additional home maintenance and support services.", count: 6, icon: "other" },
};

const cleaningDescriptions: Record<string, string> = {
  "Home Cleaning": "A thoughtful clean for everyday rooms, surfaces, and floors.",
  "Deep Cleaning": "A detailed top-to-bottom clean for the places that need extra care.",
  "Kitchen Cleaning": "Help with countertops, cabinets, appliances, and hard-to-reach areas.",
  "Bathroom Cleaning": "Refresh bathroom surfaces, fixtures, tiles, and floors.",
  "Sofa & Upholstery": "Care for sofas and upholstered furniture to lift everyday dust and dirt.",
  "Move-in / Move-out Cleaning": "Prepare a home for its next chapter with a detailed clean.",
};

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function requiredEnvironment(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Add it to .env.local before seeding Supabase.`);
  return value;
}

async function main() {
  loadEnvConfig(process.cwd());
  const supabase = createClient(
    requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnvironment("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const categoryByLabel = new Map<string, (typeof serviceCategories)[number]>(
    serviceCategories.map((category) => [category.label, category]),
  );
  const categories = serviceCategories.map((category, index) => {
    const metadata = catalogMetadata[category.label];
    if (!metadata) throw new Error(`Missing catalog metadata for ${category.label}.`);
    return {
      slug: category.slug,
      label: category.label,
      href: category.href,
      catalog_description: metadata.description,
      catalog_count: metadata.count,
      icon_key: metadata.icon,
      home_title: metadata.homeTitle ?? null,
      home_price: metadata.homePrice ?? null,
      show_on_home: metadata.homeTitle !== undefined,
      display_order: index,
      is_active: true,
      is_sample: true,
    };
  });

  const categoryResult = await supabase.from("service_categories").upsert(categories, { onConflict: "slug" });
  if (categoryResult.error) throw new Error(`Could not seed service categories: ${categoryResult.error.message}`);

  const offerings = new Map<string, {
    id: string;
    category_slug: string;
    name: string;
    description: string;
    starting_price: number | null;
    display_order: number;
    is_active: boolean;
    is_sample: boolean;
  }>();
  const addOffering = (
    categoryLabel: string,
    name: string,
    description = "",
    startingPrice: number | null = null,
  ) => {
    const category = categoryByLabel.get(categoryLabel);
    if (!category) throw new Error(`No service category exists for offering "${name}" (${categoryLabel}).`);
    const id = `${category.slug}-${slugify(name)}`;
    const existing = offerings.get(id);
    offerings.set(id, {
      id,
      category_slug: category.slug,
      name,
      description: description || existing?.description || "",
      starting_price: startingPrice ?? existing?.starting_price ?? null,
      display_order: existing?.display_order ?? offerings.size,
      is_active: true,
      is_sample: true,
    });
  };

  for (const guide of serviceGuides) {
    for (const offering of guide.offerings) {
      addOffering(guide.category, offering.name, offering.description, offering.startingPrice);
    }
  }
  for (const [name, description] of Object.entries(cleaningDescriptions)) {
    addOffering("Cleaning & Home Care", name, description);
  }
  for (const provider of serviceProviders) {
    for (const service of provider.services) addOffering(provider.category, service);
  }

  const offeringRows = [...offerings.values()];
  const offeringResult = await supabase.from("service_offerings").upsert(offeringRows, { onConflict: "id" });
  if (offeringResult.error) throw new Error(`Could not seed service offerings: ${offeringResult.error.message}`);

  const guideRows = serviceGuides.map((guide) => {
    const category = categoryByLabel.get(guide.category);
    if (!category) throw new Error(`No service category exists for guide "${guide.slug}".`);
    return {
      slug: guide.slug,
      category_slug: category.slug,
      headline: guide.headline,
      intro: guide.intro,
      starting_price: guide.startingPrice,
      benefits: guide.benefits,
      steps: guide.steps,
      faqs: guide.faqs,
      is_active: true,
      is_sample: true,
    };
  });
  const guideResult = await supabase.from("service_guides").upsert(guideRows, { onConflict: "slug" });
  if (guideResult.error) throw new Error(`Could not seed service guides: ${guideResult.error.message}`);

  const guideOfferings = serviceGuides.flatMap((guide) =>
    guide.offerings.map((offering, index) => {
      const category = categoryByLabel.get(guide.category);
      if (!category) throw new Error(`No service category exists for guide "${guide.slug}".`);
      return {
        guide_slug: guide.slug,
        offering_id: `${category.slug}-${slugify(offering.name)}`,
        display_order: index,
      };
    }),
  );
  const guideOfferingsResult = await supabase
    .from("service_guide_offerings")
    .upsert(guideOfferings, { onConflict: "guide_slug,offering_id" });
  if (guideOfferingsResult.error) {
    throw new Error(`Could not seed service guide offering links: ${guideOfferingsResult.error.message}`);
  }

  const existingProviderLocationsResult = await supabase
    .from("service_providers")
    .select("id, business_latitude, business_longitude");
  if (existingProviderLocationsResult.error) {
    throw new Error(`Could not load existing provider locations: ${existingProviderLocationsResult.error.message}`);
  }
  const existingProviderLocations = new Map(
    existingProviderLocationsResult.data.map(({ id, business_latitude, business_longitude }) => [
      id,
      { businessLatitude: business_latitude, businessLongitude: business_longitude },
    ]),
  );

  const providerRows = serviceProviders.map((provider) => {
    const category = categoryByLabel.get(provider.category);
    if (!category) throw new Error(`No service category exists for provider "${provider.id}".`);
    const savedLocation = existingProviderLocations.get(provider.id);
    return {
      id: provider.id,
      name: provider.name,
      category_slug: category.slug,
      location: provider.location,
      business_latitude: provider.businessLatitude === undefined
        ? savedLocation?.businessLatitude ?? null
        : provider.businessLatitude,
      business_longitude: provider.businessLongitude === undefined
        ? savedLocation?.businessLongitude ?? null
        : provider.businessLongitude,
      description: provider.description,
      rating: provider.rating,
      review_count: provider.reviewCount,
      experience_years: provider.experienceYears,
      starting_price: provider.startingPrice,
      featured_review: provider.featuredReview,
      tutor_levels: provider.tutorLevels ?? [],
      subjects: provider.subjects ?? [],
      online_classes: provider.onlineClasses ?? null,
      display_order: serviceProviders.indexOf(provider),
      is_active: true,
      is_sample: true,
    };
  });
  const providerResult = await supabase.from("service_providers").upsert(providerRows, { onConflict: "id" });
  if (providerResult.error) throw new Error(`Could not seed providers: ${providerResult.error.message}`);

  const providerServices = Array.from(new Map(
    serviceProviders.flatMap((provider) =>
      provider.services.map((service) => {
        const category = categoryByLabel.get(provider.category);
        if (!category) throw new Error(`No service category exists for provider "${provider.id}".`);
        return [`${provider.id}:${category.slug}-${slugify(service)}`, {
          provider_id: provider.id,
          offering_id: `${category.slug}-${slugify(service)}`,
        }] as const;
      }),
    ),
  ).values());
  const providerServicesResult = await supabase
    .from("provider_services")
    .upsert(providerServices, { onConflict: "provider_id,offering_id" });
  if (providerServicesResult.error) {
    throw new Error(`Could not seed provider service links: ${providerServicesResult.error.message}`);
  }

  const testimonials = [
    { id: "rohit-sharma-delhi", customer_name: "Rohit Sharma", location: "Delhi", quote: "Booked AC service and the technician was on time, polite and did a great job. Highly recommended!" },
    { id: "pooja-verma-gurugram", customer_name: "Pooja Verma", location: "Gurugram", quote: "Very easy booking process and transparent pricing. The plumbing work was done perfectly." },
    { id: "ankit-malhotra-noida", customer_name: "Ankit Malhotra", location: "Noida", quote: "I use KardoFix for regular home cleaning. The team is professional and always does a fantastic job." },
  ].map((testimonial, display_order) => ({
    ...testimonial,
    display_order,
    is_active: true,
    is_sample: true,
  }));
  const testimonialResult = await supabase
    .from("customer_testimonials")
    .upsert(testimonials, { onConflict: "id" });
  if (testimonialResult.error) throw new Error(`Could not seed testimonials: ${testimonialResult.error.message}`);

  console.info(
    `Seeded ${categories.length} categories, ${offeringRows.length} offerings, ${guideRows.length} guides, and ${providerRows.length} sample providers.`,
  );
}

main().catch((error: unknown) => {
  console.error("Supabase catalog seed failed:", error);
  process.exitCode = 1;
});
