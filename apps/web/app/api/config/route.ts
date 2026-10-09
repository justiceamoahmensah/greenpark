import { NextResponse } from "next/server";
import { getPublicConfig } from "@/lib/public-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getPublicConfig(), {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}

