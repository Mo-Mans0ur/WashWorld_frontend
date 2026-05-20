"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { useVehicles } from "@/context/VehiclesContext";
import CountrySelector, { Country, EUROPEAN_COUNTRIES } from "@/components/CountrySelector";
import { getPlateFormat } from "@/data/plateFormats";
import { Plus, Zap } from "lucide-react";

export default function TilfoejBilPage() {
  const router = useRouter();
  const { addVehicle } = useVehicles();
  const [country, setCountry] = useState<Country>(EUROPEAN_COUNTRIES[0]);
  const [plate, setPlate] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEV, setIsEV] = useState(false);
  const [plateError, setPlateError] = useState("");

  const fmt = getPlateFormat(country.code);

  function validatePlate(value: string) {
    if (!fmt.regex.test(value)) {
      setPlateError(`Ugyldig nummerplade — brug formatet ${fmt.hint}`);
      return false;
    }
    setPlateError("");
    return true;
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!validatePlate(plate)) return;
    addVehicle({
      name: nickname.trim() || plate,
      plate,
      countryCode: country.code,
      active: false,
      isEV,
    });
    router.push("/biler");
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Dine køretøjer" />

      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <CountrySelector value={country} onChange={(c) => { setCountry(c); setPlate(""); setPlateError(""); }} />

              <input
                type="text"
                value={plate}
                onChange={(e) => {
                  setPlate(e.target.value.toUpperCase());
                  if (plateError) validatePlate(e.target.value.toUpperCase());
                }}
                onBlur={() => plate && validatePlate(plate)}
                placeholder={fmt.placeholder}
                maxLength={12}
                required
                className={`flex-1 rounded-sm border bg-(--white-white) px-4 py-3.5 text-base font-semibold text-neutral-700 placeholder-neutral-400 shadow-sm outline-none focus:border-(--brand-green-01) ${
                  plateError ? "border-red-400" : "border-neutral-400"
                }`}
              />
            </div>
            {plateError && (
              <p className="text-xs font-semibold text-red-500 pl-1">{plateError}</p>
            )}
          </div>

          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Kladenavn (frivilligt)"
            className="rounded-sm border border-neutral-400 bg-(--white-white) px-4 py-3.5 text-base font-semibold text-neutral-700 placeholder-neutral-400 shadow-sm outline-none focus:border-(--brand-green-01)"
          />

          <div className="flex items-center gap-3 rounded-sm border border-neutral-300 bg-(--white-white) px-4 py-3.5 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-(--brand-green-01) text-(--brand-green-01)">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className="flex-1 text-sm font-semibold text-neutral-700 leading-tight">
              Dette er et elektrisk<br />køretøj (EV)
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isEV}
              onClick={() => setIsEV((v) => !v)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isEV ? "bg-(--brand-green-01)" : "bg-neutral-400"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  isEV ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="mt-auto flex items-center justify-center gap-2 bg-(--brand-green-01) py-4 text-xl font-bold text-white shadow-md active:opacity-80 [clip-path:polygon(6%_0,100%_0,100%_100%,0_100%)]"
          >
            <Plus size={22} strokeWidth={3} />
            Tilføj
          </button>
        </form>
      </main>
    </div>
  );
}
