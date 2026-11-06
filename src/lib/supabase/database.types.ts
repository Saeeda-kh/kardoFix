export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type CategoryRow = {
  slug: string;
  label: string;
  href: string;
  catalog_description: string;
  catalog_count: number;
  icon_key: string;
  home_title: string | null;
  home_price: number | null;
  show_on_home: boolean;
  display_order: number;
  is_active: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
};

type OfferingRow = {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  starting_price: number | null;
  display_order: number;
  is_active: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
};

type GuideRow = {
  slug: string;
  category_slug: string;
  headline: string;
  intro: string;
  starting_price: number;
  benefits: Json;
  steps: Json;
  faqs: Json;
  is_active: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
};

type ProviderRow = {
  id: string;
  name: string;
  category_slug: string;
  location: string;
  business_latitude: number | null;
  business_longitude: number | null;
  description: string;
  rating: number;
  review_count: number;
  experience_years: number;
  starting_price: number | null;
  featured_review: string;
  tutor_levels: string[];
  subjects: string[];
  online_classes: boolean | null;
  display_order: number;
  is_active: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
};

type ProviderServiceRow = { provider_id: string; offering_id: string };

type RequestRow = {
  id: string;
  category_slug: string;
  offering_id: string;
  provider_id: string | null;
  preferred_date: string;
  preferred_time: string;
  area: string;
  customer_latitude: number | null;
  customer_longitude: number | null;
  customer_name: string;
  phone: string;
  details: string;
  status: string;
  created_at: string;
};

type TestimonialRow = {
  id: string;
  customer_name: string;
  location: string;
  quote: string;
  display_order: number;
  is_active: boolean;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
};

type UserProfileRow = {
  id: string;
  display_name: string;
  email: string;
  role: "customer" | "provider";
  status: "active" | "pending_review" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

type ProviderPrivateApplicationRow = {
  user_id: string;
  nic_number: string;
  photo_object_path: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      service_categories: Table<CategoryRow, Omit<CategoryRow, "created_at" | "updated_at">>;
      service_offerings: Table<OfferingRow, Omit<OfferingRow, "created_at" | "updated_at">>;
      service_guides: Table<GuideRow, Omit<GuideRow, "created_at" | "updated_at">>;
      service_providers: Table<
        ProviderRow,
        Omit<ProviderRow, "created_at" | "updated_at" | "business_latitude" | "business_longitude"> &
          Partial<Pick<ProviderRow, "business_latitude" | "business_longitude">>
      >;
      service_guide_offerings: Table<{ guide_slug: string; offering_id: string; display_order: number }, { guide_slug: string; offering_id: string; display_order: number }>;
      provider_services: Table<ProviderServiceRow, ProviderServiceRow>;
      customer_testimonials: Table<TestimonialRow, Omit<TestimonialRow, "created_at" | "updated_at">>;
      user_profiles: Table<
        UserProfileRow,
        Omit<UserProfileRow, "created_at" | "updated_at">,
        Partial<Pick<UserProfileRow, "display_name" | "status">>
      >;
      provider_private_applications: Table<
        ProviderPrivateApplicationRow,
        Omit<ProviderPrivateApplicationRow, "created_at">
      >;
      service_requests: Table<
        RequestRow,
        Omit<RequestRow, "created_at" | "status" | "area"> &
          Partial<Pick<RequestRow, "created_at" | "status" | "area">>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
