import type { Metadata } from "next";
import ProviderLocationAdmin from "@/components/ProviderLocationAdmin/ProviderLocationAdmin";

export const metadata: Metadata = {
  title: "Provider Locations | KardoFix Staff",
  robots: { index: false, follow: false },
};

export default function ProviderLocationsPage() {
  return <ProviderLocationAdmin />;
}
