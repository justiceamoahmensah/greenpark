import type { Metadata } from "next";
import { ReviewPageClient } from "@/features/enquiry/ReviewPageClient";

export const metadata: Metadata = { title: "Review your enquiry" };

export default function ReviewPage() {
  return <ReviewPageClient />;
}

