import "server-only";

import { google } from "googleapis";
import { SHEET_HEADERS } from "@/config/catalog";
import { headersMatch, type SheetRow } from "@/lib/sheet";

export class SheetsConfigurationError extends Error {}

function serviceAccountCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as { client_email: string; private_key: string };
    } catch {
      throw new SheetsConfigurationError("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }
  }

  const client_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!client_email || !private_key) {
    throw new SheetsConfigurationError("Google service-account credentials are not configured.");
  }
  return { client_email, private_key };
}

function sheetSettings() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const tab = process.env.GOOGLE_SHEET_TAB || "Enquiries";
  if (!spreadsheetId) throw new SheetsConfigurationError("GOOGLE_SHEET_ID is not configured.");
  if (!tab.trim() || tab.length > 100) throw new SheetsConfigurationError("GOOGLE_SHEET_TAB is invalid.");
  return { spreadsheetId, tab, rangeTab: `'${tab.replaceAll("'", "''")}'` };
}

function sheetsClient() {
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  const auth = new google.auth.GoogleAuth({
    ...(keyFilename ? { keyFilename } : { credentials: serviceAccountCredentials() }),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

export async function appendEnquiryToSheet(row: SheetRow) {
  const { spreadsheetId, tab, rangeTab } = sheetSettings();
  const sheets = sheetsClient();

  const headerResult = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${rangeTab}!A1:L1`,
  });
  const currentHeaders = headerResult.data.values?.[0];
  if (!headersMatch(currentHeaders)) {
    throw new SheetsConfigurationError(
      `The ${tab} tab must contain the exact 12-column header row: ${SHEET_HEADERS.join(" | ")}`,
    );
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${rangeTab}!A:L`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

export async function readEnquiriesFromSheet() {
  const { spreadsheetId, tab, rangeTab } = sheetSettings();
  const result = await sheetsClient().spreadsheets.values.get({
    spreadsheetId,
    range: `${rangeTab}!A:L`,
    majorDimension: "ROWS",
  });
  const [currentHeaders, ...sourceRows] = result.data.values ?? [];
  if (!headersMatch(currentHeaders)) {
    throw new SheetsConfigurationError(
      `The ${tab} tab must contain the exact 12-column header row: ${SHEET_HEADERS.join(" | ")}`,
    );
  }

  const rows = sourceRows
    .filter((row) => row.some((value) => String(value ?? "").trim()))
    .map((row) => SHEET_HEADERS.map((_, index) => String(row[index] ?? "")));
  return { headers: [...SHEET_HEADERS], rows, tab };
}
