import "server-only";
import type { Json } from "@/lib/supabase/database.types";
import type {
  CustomerTestimonial,
  HomeServiceCategory,
  MarketplaceGuide,
  MarketplaceOffering,
  MarketplaceProvider,
  ServiceCategory,
} from "@/data/marketplace";
import { createSupabaseServerClient } from "@/lib/supabase/client";
import type { ServiceGuide } from "@/data/serviceGuides";

function throwDatabaseError(operation: string, message: string): never {
  throw new Error(`Could not ${operation} from Supabase: ${message}`);
}

function parseJsonArray<T>(value: Json, isItem: (item: unknown) => item is T, field: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`Supabase returned invalid ${field} data.`);
  }
  const items: unknown[] = value;
  if (!items.every(isItem)) throw new Error(`Supabase returned invalid ${field} data.`);
  return items;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStep(value: unknown): value is { title: string; description: string } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "title" in value &&
      typeof value.title === "string" &&
      "description" in value &&
      typeof value.description === "string",
  );
}

function isFaq(value: unknown): value is { question: string; answer: string } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "question" in value &&
      typeof value.question === "string" &&
      "answer" in value &&
      typeof value.answer === "string",
  );
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("slug, label, href, catalog_description, catalog_count, icon_key, home_title, home_price, show_on_home, is_sample")
    .eq("is_active", true)
    .order("display_order");

  if (error) throwDatabaseError("load service categories", error.message);
  return data.map((category) => ({
    label: category.label,
    slug: category.slug,
    href: category.href,
    description: category.catalog_description,
    count: category.catalog_count,
    icon: category.icon_key,
    homeTitle: category.home_title,
    homePrice: category.home_price,
    showOnHome: category.show_on_home,
    isSample: category.is_sample,
  }));
}

export async function getHomeServiceCategories(): Promise<HomeServiceCategory[]> {
  const categories = await getServiceCategories();
  return categories.filter(
    (category): category is HomeServiceCategory =>
      category.showOnHome && category.homeTitle !== null && category.homePrice !== null,
  );
}

export async function getCustomerTestimonials(): Promise<CustomerTestimonial[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customer_testimonials")
    .select("id, customer_name, location, quote, is_sample")
    .eq("is_active", true)
    .order("display_order");
  if (error) throwDatabaseError("load customer testimonials", error.message);
  return data.map((testimonial) => ({
    id: testimonial.id,
    name: testimonial.customer_name,
    city: testimonial.location,
    text: testimonial.quote,
    isSample: testimonial.is_sample,
  }));
}

export async function getServiceOfferings(categorySlug?: string): Promise<MarketplaceOffering[]> {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("service_offerings")
    .select("id, category_slug, name, description, starting_price")
    .eq("is_active", true)
    .order("display_order")
    .order("name");

  if (categorySlug) query = query.eq("category_slug", categorySlug);
  const { data, error } = await query;
  if (error) throwDatabaseError("load service offerings", error.message);

  return data.map((offering) => ({
    id: offering.id,
    categorySlug: offering.category_slug,
    name: offering.name,
    description: offering.description,
    startingPrice: offering.starting_price,
  }));
}

export async function getServiceProviders(): Promise<MarketplaceProvider[]> {
  const supabase = createSupabaseServerClient();
  const [providerResult, providerServiceResult, offeringResult, categoryResult] = await Promise.all([
    supabase
      .from("service_providers")
      .select("id, name, category_slug, location, business_latitude, business_longitude, description, rating, review_count, experience_years, starting_price, featured_review, tutor_levels, subjects, online_classes")
      .eq("is_active", true)
      .order("display_order"),
    supabase.from("provider_services").select("provider_id, offering_id").order("offering_id"),
    supabase.from("service_offerings").select("id, name"),
    supabase.from("service_categories").select("slug, label"),
  ]);
  if (providerResult.error) throwDatabaseError("load service providers", providerResult.error.message);
  if (providerServiceResult.error) throwDatabaseError("load provider services", providerServiceResult.error.message);
  if (offeringResult.error) throwDatabaseError("load provider offering names", offeringResult.error.message);
  if (categoryResult.error) throwDatabaseError("load provider categories", categoryResult.error.message);

  const offeringNames = new Map(offeringResult.data.map(({ id, name }) => [id, name]));
  const servicesByProvider = new Map<string, string[]>();
  for (const link of providerServiceResult.data) {
    const name = offeringNames.get(link.offering_id);
    if (!name) continue;
    const services = servicesByProvider.get(link.provider_id) ?? [];
    services.push(name);
    servicesByProvider.set(link.provider_id, services);
  }
  const categoryLabels = new Map(categoryResult.data.map(({ slug, label }) => [slug, label]));

  return providerResult.data.map((provider) => {
    const category = categoryLabels.get(provider.category_slug);
    if (!category) throw new Error(`Supabase provider "${provider.id}" references an unknown category.`);
    return {
      id: provider.id,
      name: provider.name,
      category,
      categorySlug: provider.category_slug,
      location: provider.location,
      businessLatitude: provider.business_latitude,
      businessLongitude: provider.business_longitude,
      description: provider.description,
      services: servicesByProvider.get(provider.id) ?? [],
      rating: Number(provider.rating),
      reviewCount: provider.review_count,
      experienceYears: provider.experience_years,
      startingPrice: provider.starting_price,
      featuredReview: provider.featured_review,
      tutorLevels: provider.tutor_levels as MarketplaceProvider["tutorLevels"],
      subjects: provider.subjects,
      onlineClasses: provider.online_classes ?? undefined,
    };
  });
}

export async function getServiceProvider(providerId: string): Promise<MarketplaceProvider | null> {
  const providers = await getServiceProviders();
  return providers.find(({ id }) => id === providerId) ?? null;
}

export async function getServiceGuide(slug: string): Promise<MarketplaceGuide | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_guides")
    .select("slug, category_slug, headline, intro, starting_price, benefits, steps, faqs")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throwDatabaseError(`load the "${slug}" service guide`, error.message);
  if (!data) return null;

  const [categoryResult, guideOfferingResult] = await Promise.all([
    supabase.from("service_categories").select("label").eq("slug", data.category_slug).maybeSingle(),
    supabase
      .from("service_guide_offerings")
      .select("offering_id, display_order")
      .eq("guide_slug", data.slug)
      .order("display_order"),
  ]);
  if (categoryResult.error) throwDatabaseError("load service guide category", categoryResult.error.message);
  if (guideOfferingResult.error) throwDatabaseError("load service guide offering links", guideOfferingResult.error.message);
  if (!categoryResult.data) throw new Error(`Supabase guide "${slug}" references an unknown category.`);

  const allCategoryOfferings = await getServiceOfferings(data.category_slug);
  const offeringsById = new Map(allCategoryOfferings.map((offering) => [offering.id, offering]));
  const guideOfferings = guideOfferingResult.data.map(({ offering_id }) => {
    const offering = offeringsById.get(offering_id);
    if (!offering) throw new Error(`Supabase guide "${slug}" references an unknown offering.`);
    return offering;
  });
  const guide: ServiceGuide = {
    slug: data.slug,
    category: categoryResult.data.label,
    headline: data.headline,
    intro: data.intro,
    startingPrice: data.starting_price,
    offerings: guideOfferings.map((offering) => ({
      name: offering.name,
      description: offering.description,
      startingPrice: offering.startingPrice,
    })),
    benefits: parseJsonArray(data.benefits, isString, "guide benefits"),
    steps: parseJsonArray(data.steps, isStep, "guide steps"),
    faqs: parseJsonArray(data.faqs, isFaq, "guide FAQs"),
  };

  return { ...guide, categorySlug: data.category_slug };
}

export async function hasProvidersForCategory(categorySlug: string): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { count, error } = await supabase
    .from("service_providers")
    .select("id", { count: "exact", head: true })
    .eq("category_slug", categorySlug)
    .eq("is_active", true);
  if (error) throwDatabaseError("check provider availability", error.message);
  return (count ?? 0) > 0;
}
