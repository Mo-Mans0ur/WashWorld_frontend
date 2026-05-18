"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type Country = { code: string; name: string };

const EUROPEAN_COUNTRIES: Country[] = [
  { code: "DK", name: "Danmark" },
  { code: "SE", name: "Sverige" },
  { code: "NO", name: "Norge" },
  { code: "FI", name: "Finland" },
  { code: "DE", name: "Tyskland" },
  { code: "NL", name: "Holland" },
  { code: "BE", name: "Belgien" },
  { code: "FR", name: "Frankrig" },
  { code: "ES", name: "Spanien" },
  { code: "PT", name: "Portugal" },
  { code: "IT", name: "Italien" },
  { code: "AT", name: "Østrig" },
  { code: "CH", name: "Schweiz" },
  { code: "PL", name: "Polen" },
  { code: "CZ", name: "Tjekkiet" },
  { code: "SK", name: "Slovakiet" },
  { code: "HU", name: "Ungarn" },
  { code: "RO", name: "Rumænien" },
  { code: "BG", name: "Bulgarien" },
  { code: "HR", name: "Kroatien" },
  { code: "SI", name: "Slovenien" },
  { code: "GR", name: "Grækenland" },
  { code: "IE", name: "Irland" },
  { code: "GB", name: "Storbritannien" },
  { code: "LU", name: "Luxembourg" },
  { code: "EE", name: "Estland" },
  { code: "LV", name: "Letland" },
  { code: "LT", name: "Litauen" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cypern" },
];

export { EUROPEAN_COUNTRIES };

export default function CountrySelector({
  value,
  onChange,
}: {
  value: Country;
  onChange: (country: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-sm border border-neutral-400 bg-(--white-white) px-3 py-3.5 text-base font-bold text-neutral-700 shadow-sm"
      >
        {value.code}
        <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-44 overflow-y-auto rounded-md bg-white shadow-xl ring-1 ring-black/10">
          {EUROPEAN_COUNTRIES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onChange(country);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100 ${
                country.code === value.code
                  ? "text-(--brand-green-01)"
                  : "text-neutral-700"
              }`}
            >
              <span className="font-bold">{country.code}</span>
              <span className="text-xs text-neutral-500">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
