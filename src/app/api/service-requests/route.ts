import { randomUUID } from "node:crypto";
import { createSupabaseSsrServerClient } from "@/lib/supabase/server";

type ServiceRequestInput = {
  categorySlug: string;
  offeringId: string;
  providerId: string | null;
  preferredDate: string;
  preferredTime: string;
  customerLatitude: number;
  customerLongitude: number;
  customerName: string;
  phone: string;
  details: string;
};

const allowedTimeSlots = new Set([
  "Morning · 8 am–12 pm",
  "Afternoon · 12–4 pm",
  "Evening · 4–8 pm",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function localDateInIndia() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = new Map(parts.map(({ type, value }) => [type, value]));
  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

function validateInput(value: unknown): { data: ServiceRequestInput } | { error: string } {
  if (!isRecord(value)) return { error: "The service request is invalid." };

  const {
    categorySlug,
    offeringId,
    providerId,
    preferredDate,
    preferredTime,
    customerLatitude,
    customerLongitude,
    customerName,
    phone,
    details,
  } = value;

  if (
    typeof categorySlug !== "string" ||
    typeof offeringId !== "string" ||
    (providerId !== null && typeof providerId !== "string") ||
    typeof preferredDate !== "string" ||
    typeof preferredTime !== "string" ||
    typeof customerLatitude !== "number" ||
    !Number.isFinite(customerLatitude) ||
    typeof customerLongitude !== "number" ||
    !Number.isFinite(customerLongitude) ||
    typeof customerName !== "string" ||
    typeof phone !== "string" ||
    typeof details !== "string"
  ) {
    return { error: "Complete the required fields and try again." };
  }

  const trimmedName = customerName.trim();
  const trimmedDetails = details.trim();
  const digits = phone.replace(/\D/g, "");
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(preferredDate)
    ? new Date(`${preferredDate}T00:00:00.000Z`)
    : null;

  if (customerLatitude < -90 || customerLatitude > 90 || customerLongitude < -180 || customerLongitude > 180) {
    return { error: "Choose a valid location on the map." };
  }
  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return { error: "Enter a name between 2 and 80 characters." };
  }
  if (digits.length < 10 || digits.length > 13 || phone.length > 18) {
    return { error: "Enter a valid phone number with 10 to 13 digits." };
  }
  if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== preferredDate) {
    return { error: "Choose a valid preferred date." };
  }
  if (preferredDate < localDateInIndia()) {
    return { error: "Choose today or a future date for your service request." };
  }
  if (!allowedTimeSlots.has(preferredTime)) {
    return { error: "Choose one of the available preferred time slots." };
  }
  if (trimmedDetails.length > 500) {
    return { error: "Keep service details within 500 characters." };
  }

  return {
    data: {
      categorySlug,
      offeringId,
      providerId,
      preferredDate,
      preferredTime,
      customerLatitude,
      customerLongitude,
      customerName: trimmedName,
      phone: phone.trim(),
      details: trimmedDetails,
    },
  };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  let isSameOrigin = false;
  try {
    isSameOrigin = origin !== null && new URL(origin).origin === new URL(request.url).origin;
  } catch {
    isSameOrigin = false;
  }
  if (!isSameOrigin) {
    return Response.json({ error: "This request could not be verified. Reload the page and try again." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 10_000) {
    return Response.json({ error: "The request is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 10_000) {
      return Response.json({ error: "The request is too large." }, { status: 413 });
    }
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  const validated = validateInput(payload);
  if ("error" in validated) return Response.json({ error: validated.error }, { status: 400 });

  const supabase = await createSupabaseSsrServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error("Could not read the session submitting a service request.", sessionError);
    return Response.json({ error: "We couldn’t verify your account. Please sign in again." }, { status: 503 });
  }
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] = null;
  if (session) {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      console.error("Could not verify the account submitting a service request.", error);
      return Response.json({ error: "We couldn’t verify your account. Please sign in again." }, { status: 503 });
    }
    user = data.user;
  }
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profileError) {
      console.error("Could not load the account role submitting a service request.", profileError);
      return Response.json({ error: "We couldn’t verify your account. Please try again." }, { status: 503 });
    }
    if (profile?.role === "provider" || user.app_metadata.role === "admin") {
      return Response.json({ error: "Sign in with a customer account to request a service." }, { status: 403 });
    }
    if (!profile) {
      return Response.json({ error: "This account cannot submit customer service requests." }, { status: 403 });
    }
  }
  const { data } = validated;
  const [categoryResult, offeringResult] = await Promise.all([
    supabase.from("service_categories").select("slug").eq("slug", data.categorySlug).eq("is_active", true).maybeSingle(),
    supabase
      .from("service_offerings")
      .select("id, category_slug")
      .eq("id", data.offeringId)
      .eq("is_active", true)
      .maybeSingle(),
  ]);
  if (categoryResult.error || offeringResult.error) {
    console.error("Could not validate service request catalog data.", categoryResult.error ?? offeringResult.error);
    return Response.json({ error: "We couldn’t verify the selected service. Please try again." }, { status: 503 });
  }
  if (!categoryResult.data || offeringResult.data?.category_slug !== data.categorySlug) {
    return Response.json({ error: "Choose a service from the selected category." }, { status: 400 });
  }

  if (data.providerId) {
    const [providerResult, providerServiceResult] = await Promise.all([
      supabase
        .from("service_providers")
        .select("id, category_slug")
        .eq("id", data.providerId)
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("provider_services")
        .select("provider_id")
        .eq("provider_id", data.providerId)
        .eq("offering_id", data.offeringId)
        .maybeSingle(),
    ]);
    if (providerResult.error || providerServiceResult.error) {
      console.error("Could not validate the selected provider for a service request.", providerResult.error ?? providerServiceResult.error);
      return Response.json({ error: "We couldn’t verify the selected provider. Please try again." }, { status: 503 });
    }
    if (!providerResult.data || providerResult.data.category_slug !== data.categorySlug || !providerServiceResult.data) {
      return Response.json({ error: "Choose a provider who offers the selected service." }, { status: 400 });
    }
  }

  const id = randomUUID();
  const { error } = await supabase.from("service_requests").insert({
    id,
    category_slug: data.categorySlug,
    offering_id: data.offeringId,
    provider_id: data.providerId,
    preferred_date: data.preferredDate,
    preferred_time: data.preferredTime,
    customer_latitude: data.customerLatitude,
    customer_longitude: data.customerLongitude,
    customer_name: data.customerName,
    phone: data.phone,
    details: data.details,
  });

  if (error) {
    console.error("Could not save a service request.", error);
    return Response.json({ error: "We couldn’t save your request right now. Please try again shortly." }, { status: 503 });
  }

  return Response.json({ reference: id.slice(0, 8).toUpperCase() }, { status: 201 });
}
