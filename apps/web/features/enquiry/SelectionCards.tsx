export function SelectionCards({
  name,
  label,
  options,
  value,
  onChange,
  mode = "single",
}: {
  name: string;
  label: string;
  options: { value: string; label: string; hint?: string }[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  mode?: "single" | "multiple";
}) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);

  function toggle(option: string) {
    if (mode === "single") {
      onChange(option);
      return;
    }
    const next = new Set(selected);
    if (next.has(option)) next.delete(option);
    else next.add(option);
    onChange([...next]);
  }

  return (
    <div role={mode === "single" ? "radiogroup" : "group"} aria-label={label} className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected.has(option.value);
        return (
          <label
            key={option.value}
            className={`relative flex min-h-20 cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-navy/35 ${
              isSelected ? "border-royal bg-blue-50/50 ring-1 ring-royal" : "border-navy/10"
            }`}
          >
            <input
              className="sr-only"
              type={mode === "single" ? "radio" : "checkbox"}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => toggle(option.value)}
            />
            <span>
              <span className="block text-base font-medium">{option.label}</span>
              {option.hint ? <span className="mt-1 block text-sm leading-5 text-muted">{option.hint}</span> : null}
            </span>
            <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${isSelected ? "border-royal bg-royal text-white" : "border-navy/15 text-transparent"}`} aria-hidden="true">
              <Check className="size-4" />
            </span>
          </label>
        );
      })}
    </div>
  );
}
import { Check } from "lucide-react";
