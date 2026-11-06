import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseSsrServerClient } from "@/lib/supabase/server";

export type AccountRole = "customer" | "provider";
export type AccountStatus = "active" | "pending_review" | "approved" | "rejected";

export type AccountProfile = {
  id: string;
  display_name: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
};

export async function getAuthenticatedAccount() {
  const supabase = await createSupabaseSsrServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(`Could not read the current account session: ${sessionError.message}`);
  if (!session) return { supabase, user: null, profile: null };

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(`Could not verify the current account: ${userError.message}`);
  if (!user) return { supabase, user: null, profile: null };

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, display_name, email, role, status")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw new Error(`Could not load the account profile: ${profileError.message}`);
  return { supabase, user, profile };
}

export async function requireAccount(role: AccountRole) {
  const account = await getAuthenticatedAccount();
  if (!account.user || !account.profile) redirect(`/login/${role}`);
  if (account.user.app_metadata.role === "admin") redirect("/admin/accounts");
  if (account.profile.role !== role) redirect(`/dashboard/${account.profile.role}`);
  return { ...account, profile: account.profile };
}

export async function requireAdminAccount() {
  const account = await getAuthenticatedAccount();
  if (!account.user) redirect("/admin/providers");
  if (account.user.app_metadata.role !== "admin") {
    if (account.profile) redirect(`/dashboard/${account.profile.role}`);
    redirect("/admin/providers");
  }
  return account;
}
