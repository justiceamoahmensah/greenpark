import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import QRCode from "qrcode";

const siteUrl = process.env.PUBLIC_BASE_URL;
if (!siteUrl) throw new Error("Set PUBLIC_BASE_URL before generating QR codes.");

const origin = new URL(siteUrl);
if (!['http:', 'https:'].includes(origin.protocol)) throw new Error("PUBLIC_BASE_URL must use http or https.");
origin.pathname = "/";
origin.search = "";
origin.hash = "";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(scriptDir, "../public/qr");
const slugs = (process.env.QR_DEVELOPMENT_SLUGS || "haven-gardens-adjiringanor,cherrys-green-achimota,whitehall-development")
  .split(",")
  .map((value) => value.trim())
  .filter((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));

await mkdir(outputDir, { recursive: true });

async function create(name, url) {
  const png = await QRCode.toBuffer(url, {
    type: "png",
    width: 1200,
    margin: 4,
    errorCorrectionLevel: "H",
    color: { dark: "#102B46", light: "#FFFFFF" },
  });
  await writeFile(path.join(outputDir, `${name}.png`), png);
  process.stdout.write(`${name}.png -> ${url}\n`);
}

await create("general", new URL("/", origin).toString());
for (const slug of slugs) {
  const url = new URL("/", origin);
  url.searchParams.set("development", slug);
  await create(slug, url.toString());
}
