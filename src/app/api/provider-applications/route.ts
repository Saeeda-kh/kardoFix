import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

const bucketName = "provider-private-documents";
const maxPhotoSize = 5 * 1024 * 1024;

function getImageType(bytes: Buffer) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { contentType: "image/png", extension: "png" };
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }
  return null;
}

export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin || requestOrigin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Provider registration must be submitted from this website." }, { status: 403 });
  }

  let userId: string | null = null;
  let photoPath: string | null = null;
  let adminClient: ReturnType<typeof createClient<Database>> | null = null;

  try {
    const formData = await request.formData();
    const displayName = String(formData.get("display_name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const nicNumber = String(formData.get("nic_number") ?? "").trim();
    const photo = formData.get("photo");
    const redirectTo = String(formData.get("redirectTo") ?? "");

    if (displayName.length < 2 || displayName.length > 80) {
      return NextResponse.json({ error: "Enter a name between 2 and 80 characters." }, { status: 400 });
    }
    if (!email || email.length > 254 || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Use a password between 8 and 128 characters." }, { status: 400 });
    }
    if (!nicNumber || nicNumber.length > 80) {
      return NextResponse.json({ error: "Enter your NIC card number." }, { status: 400 });
    }
    if (!(photo instanceof File) || photo.size === 0 || photo.size > maxPhotoSize) {
      return NextResponse.json({ error: "Choose a photo up to 5 MB." }, { status: 400 });
    }

    let callbackUrl: URL;
    try {
      callbackUrl = new URL(redirectTo);
    } catch {
      return NextResponse.json({ error: "The email confirmation address is invalid." }, { status: 400 });
    }
    if (
      !["http:", "https:"].includes(callbackUrl.protocol) ||
      callbackUrl.pathname !== "/auth/callback" ||
      callbackUrl.origin !== request.nextUrl.origin ||
      callbackUrl.username ||
      callbackUrl.password
    ) {
      return NextResponse.json({ error: "The email confirmation address is invalid." }, { status: 400 });
    }

    const photoBytes = Buffer.from(await photo.arrayBuffer());
    const imageType = getImageType(photoBytes);
    if (!imageType) {
      return NextResponse.json({ error: "Use a valid JPEG, PNG, or WebP photo." }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anonKey || !serviceRoleKey) {
      throw new Error("Supabase provider application storage is not configured.");
    }

    const authClient = createClient<Database>(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    adminClient = createClient<Database>(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: signup, error: signupError } = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: { account_type: "provider", display_name: displayName },
        emailRedirectTo: callbackUrl.toString(),
      },
    });
    if (signupError) throw signupError;
    if (!signup.user || !signup.user.identities?.length) {
      return NextResponse.json(
        { error: "We could not create this account. If you already registered, sign in instead." },
        { status: 409 },
      );
    }

    userId = signup.user.id;
    photoPath = `${userId}/photo.${imageType.extension}`;
    const { error: uploadError } = await adminClient.storage
      .from(bucketName)
      .upload(photoPath, photoBytes, { contentType: imageType.contentType, upsert: false });
    if (uploadError) throw uploadError;

    const { error: applicationError } = await adminClient
      .from("provider_private_applications")
      .insert({ user_id: userId, nic_number: nicNumber, photo_object_path: photoPath });
    if (applicationError) throw applicationError;

    return NextResponse.json({ confirmationRequired: !signup.session });
  } catch (error) {
    console.error(
      "Could not securely complete a provider application.",
      error instanceof Error ? error.message : "Unknown server error",
    );

    if (adminClient && photoPath) {
      const { error: cleanupError } = await adminClient.storage.from(bucketName).remove([photoPath]);
      if (cleanupError) console.error("Could not remove an incomplete provider photo upload.", cleanupError.message);
    }
    if (adminClient && userId) {
      const { error: cleanupError } = await adminClient.auth.admin.deleteUser(userId);
      if (cleanupError) console.error("Could not remove an incomplete provider account.", cleanupError.message);
    }
    return NextResponse.json(
      { error: "We could not securely submit your provider application. Please try again." },
      { status: 500 },
    );
  }
}
