import type { Metadata } from "next";
import { SuccessPageClient } from "@/features/enquiry/SuccessPageClient";

export const metadata: Metadata = { title: "Enquiry received" };

export default function SuccessPage() {
  return <SuccessPageClient />;
}
