import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminAccessConfigured, isAdminAuthorized } from "@/lib/admin-auth";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

export function proxy(request: NextRequest) {
  if (!isAdminAccessConfigured()) {
    return new NextResponse("Administrative access is unavailable.", {
      status: 503,
      headers: PRIVATE_HEADERS,
    });
  }

  if (!isAdminAuthorized(request.headers.get("authorization"))) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        ...PRIVATE_HEADERS,
        "WWW-Authenticate": 'Basic realm="Greenpark Enquiries", charset="UTF-8"',
      },
    });
  }

  const response = NextResponse.next();
  Object.entries(PRIVATE_HEADERS).forEach(([name, value]) => response.headers.set(name, value));
  return response;
}

export const config = {
  matcher: "/internal/enquiries/:path*",
};
