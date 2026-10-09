import "server-only";

import { headers } from "next/headers";
import { assertAdminAuthorization } from "@/lib/admin-auth";
import { readEnquiriesFromSheet } from "@/lib/google-sheets";

export async function getAdminEnquiries() {
  const authorization = (await headers()).get("authorization");
  assertAdminAuthorization(authorization);
  return readEnquiriesFromSheet();
}
