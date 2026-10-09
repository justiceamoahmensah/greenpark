import { NextResponse } from "next/server";
import { appendEnquiryToSheet, SheetsConfigurationError } from "@/lib/google-sheets";
import { getPublicConfig, whatsappUrl } from "@/lib/public-config";
import { allowRequest } from "@/lib/rate-limit";
import { answersToSheetRow } from "@/lib/sheet";
import type { Answers } from "@/lib/types";
import { buildEnquirySchema, normalizeName } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }
  const requestUrl = new URL(request.url);
  const allowed = new Set([requestUrl.origin]);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || requestUrl.protocol.replace(":", "");
  if (host) allowed.add(`${protocol}://${host}`);
  if (process.env.PUBLIC_BASE_URL) {
    try {
      allowed.add(new URL(process.env.PUBLIC_BASE_URL).origin);
    } catch {
      console.error("PUBLIC_BASE_URL is not a valid URL.");
    }
  }
  const requestIsLoopback = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  if (process.env.NODE_ENV === "development" || requestIsLoopback) {
    const port = originUrl.port || "3000";
    allowed.add(`http://localhost:${port}`);
    allowed.add(`http://127.0.0.1:${port}`);
  }
  return allowed.has(originUrl.origin);
}

function clientKey(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ message: "This request origin is not allowed." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ message: "Send the enquiry as JSON." }, 415);
  }

  const rate = allowRequest(clientKey(request));
  if (!rate.allowed) {
    return json(
      { message: "Too many enquiries were submitted from this connection. Please try again later." },
      429,
      { "Retry-After": String(rate.retryAfter) },
    );
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return json({ message: "The enquiry is too large." }, 413);
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ message: "The enquiry could not be read." }, 400);
  }
  if (typeof body.website === "string" && body.website.trim()) {
    return json({ message: "The enquiry could not be submitted." }, 400);
  }

  const config = getPublicConfig();
  const parsed = buildEnquirySchema(config).safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0] || "form"), issue.message]));
    return json({ message: "Please correct the highlighted answers.", fields }, 422);
  }

  const answers = parsed.data as Answers;
  try {
    await appendEnquiryToSheet(answersToSheetRow(config, answers));
  } catch (error) {
    if (error instanceof SheetsConfigurationError) {
      console.error("Google Sheets configuration error:", error.message);
    } else {
      console.error("Google Sheets append failed:", error instanceof Error ? error.message : "Unknown error");
    }
    return json(
      { message: "We could not securely save your enquiry. Your answers are still available—please try again." },
      503,
    );
  }

  const firstName = normalizeName(answers.full_name).split(" ")[0] || "";
  return json(
    {
      acknowledged: true,
      first_name: firstName,
      may_we_contact_you: answers.may_we_contact_you,
      whatsapp_url: whatsappUrl(
        "Hello Greenpark Properties, I have just submitted a property enquiry through your website and would like to continue the conversation here.",
      ),
      acknowledged_at: new Date().toISOString(),
    },
    201,
  );
}
