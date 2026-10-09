import { HomePage } from "@/features/landing/HomePage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ development?: string }>;
}) {
  const params = await searchParams;
  return <HomePage developmentSlug={params.development ?? null} />;
}
