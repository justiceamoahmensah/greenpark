import { EnquiryFlow } from "@/features/enquiry/EnquiryFlow";

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ development?: string; step?: string; return?: string }>;
}) {
  const params = await searchParams;
  const parsedStep = params.step === undefined ? null : Number.parseInt(params.step, 10);
  return (
    <EnquiryFlow
      developmentSlug={params.development ?? null}
      requestedStep={Number.isFinite(parsedStep) ? parsedStep : null}
      returnToReview={params.return === "review"}
    />
  );
}
