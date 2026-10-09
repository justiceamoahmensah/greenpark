// @vitest-environment node

import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  AdminAccessConfigurationError,
  AdminAuthorizationError,
  assertAdminAuthorization,
  isAdminAccessConfigured,
  isAdminAuthorized,
} from "./admin-auth";

const originalUsername = process.env.ADMIN_USERNAME;
const originalPassword = process.env.ADMIN_PASSWORD;

function basic(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

describe("internal dashboard authentication", () => {
  beforeEach(() => {
    process.env.ADMIN_USERNAME = "greenpark-admin";
    process.env.ADMIN_PASSWORD = "a-secure-test-password";
  });

  afterAll(() => {
    if (originalUsername === undefined) delete process.env.ADMIN_USERNAME;
    else process.env.ADMIN_USERNAME = originalUsername;
    if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = originalPassword;
  });

  it("accepts the configured Basic Authorization credentials", () => {
    expect(isAdminAccessConfigured()).toBe(true);
    expect(isAdminAuthorized(basic("greenpark-admin", "a-secure-test-password"))).toBe(true);
  });

  it("rejects missing or incorrect credentials", () => {
    expect(isAdminAuthorized(null)).toBe(false);
    expect(isAdminAuthorized(basic("greenpark-admin", "incorrect-password"))).toBe(false);
    expect(() => assertAdminAuthorization(null)).toThrow(AdminAuthorizationError);
  });

  it("fails closed when a strong administrative password is not configured", () => {
    process.env.ADMIN_PASSWORD = "too-short";
    expect(isAdminAccessConfigured()).toBe(false);
    expect(() => assertAdminAuthorization(basic("greenpark-admin", "too-short"))).toThrow(
      AdminAccessConfigurationError,
    );
  });
});
