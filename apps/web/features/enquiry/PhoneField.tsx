import type { Ref } from "react";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";

const preferred = ["GH", "NG", "GB", "US", "AE", "ZA", "KE", "IN", "FR", "DE"];
const names = new Intl.DisplayNames(["en"], { type: "region" });
const countries = [...getCountries()].sort((left, right) => {
  const leftRank = preferred.indexOf(left);
  const rightRank = preferred.indexOf(right);
  if (leftRank !== -1 || rightRank !== -1) return (leftRank === -1 ? 99 : leftRank) - (rightRank === -1 ? 99 : rightRank);
  return (names.of(left) || left).localeCompare(names.of(right) || right);
});

export function PhoneField({
  country,
  number,
  onCountry,
  onNumber,
  inputRef,
  invalid = false,
}: {
  country: string;
  number: string;
  onCountry: (value: string) => void;
  onNumber: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  invalid?: boolean;
}) {
  return (
    <div className="grid gap-3">
      <label className="grid gap-2 text-sm">
        Country
        <select
          className="rounded-2xl border border-navy/15 bg-white px-4 py-3"
          value={country}
          onChange={(event) => onCountry(event.target.value)}
          data-testid="phone-country"
          aria-invalid={invalid}
        >
          <option value="">Select a country</option>
          {countries.map((code) => (
            <option key={code} value={code}>
              {names.of(code)} +{getCountryCallingCode(code as CountryCode)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        Phone number
        <input
          ref={inputRef}
          className="rounded-2xl border border-navy/15 bg-white px-4 py-3"
          inputMode="tel"
          autoComplete="tel"
          value={number}
          onChange={(event) => onNumber(event.target.value)}
          data-testid="phone-number"
          aria-invalid={invalid}
        />
      </label>
      <p className="text-sm text-muted">Include the country, or start the number with + and the country code.</p>
    </div>
  );
}
