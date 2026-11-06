import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseSsrServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login", request.url));

  const supabase = await createSupabaseSsrServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Could not complete the Supabase email confirmation.", error);
    return NextResponse.redirect(new URL("/login?confirmation=failed", request.url));
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error("Could not load the confirmed Supabase account.", userError);
    return NextResponse.redirect(new URL("/login?confirmation=failed", request.url));
  }
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("Could not load the confirmed account profile.", profileError);
    return NextResponse.redirect(new URL("/login?confirmation=failed", request.url));
  }
  if (!profile) return NextResponse.redirect(new URL("/login?confirmation=failed", request.url));

  return NextResponse.redirect(new URL(`/dashboard/${profile.role}`, request.url));
}
