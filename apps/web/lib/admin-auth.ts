import { timingSafeEqual } from "node:crypto";

export class AdminAccessConfigurationError extends Error {}
export class AdminAuthorizationError extends Error {}

function configuredCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 16) return null;
  return { username, password };
}

function safeEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function parseBasicAuthorization(value: string | null) {
  if (!value?.startsWith("Basic ")) return null;
  try {
    const decoded = Buffer.from(value.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 1) return null;
    return { username: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
  } catch {
    return null;
  }
}

export function isAdminAccessConfigured() {
  return configuredCredentials() !== null;
}

export function isAdminAuthorized(authorization: string | null) {
  const expected = configuredCredentials();
  const supplied = parseBasicAuthorization(authorization);
  if (!expected || !supplied) return false;
  return safeEqual(supplied.username, expected.username) && safeEqual(supplied.password, expected.password);
}

export function assertAdminAuthorization(authorization: string | null) {
  if (!isAdminAccessConfigured()) {
    throw new AdminAccessConfigurationError("Administrative access is not configured.");
  }
  if (!isAdminAuthorized(authorization)) {
    throw new AdminAuthorizationError("Administrative access is not authorized.");
  }
}
