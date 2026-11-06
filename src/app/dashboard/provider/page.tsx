import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import ProviderDashboard from "@/components/AccountDashboards/ProviderDashboard";
import { requireAccount } from "@/lib/auth/account";

export const metadata: Metadata = {
  title: "Service Provider Account",
  robots: { index: false, follow: false },
};

export default async function ProviderDashboardPage() {
  const { profile, supabase } = await requireAccount("provider");
  const { data: privateApplication, error } = await supabase
    .from("provider_private_applications")
    .select("nic_number, photo_object_path")
    .eq("user_id", profile.id)
    .maybeSingle();
  if (error) throw new Error(`Could not load your private provider documents: ${error.message}`);

  let photoUrl: string | null = null;
  if (privateApplication) {
    const { data, error: photoError } = await supabase.storage
      .from("provider-private-documents")
      .createSignedUrl(privateApplication.photo_object_path, 300);
    if (photoError) throw new Error(`Could not display your private provider photo: ${photoError.message}`);
    photoUrl = data.signedUrl;
  }

  return (
    <>
      <Header />
      <ProviderDashboard
        profile={profile}
        privateIdentity={privateApplication ? { nicNumber: privateApplication.nic_number, photoUrl } : null}
      />
    </>
  );
}
