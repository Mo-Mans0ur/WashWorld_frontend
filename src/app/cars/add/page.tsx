// TilfoejBilPage – formular til at tilføje et nyt køretøj til brugerens konto.
// Brugeren vælger land, indtaster nummerplade, kælenavn, køretøjstype og om det er et EV.
// Nummerpladen valideres mod det valgte lands format (plateFormats.ts) inden indsendelse.
//
// VEHICLE_TYPES: liste over de fire understøttede køretøjstyper med ikon og dansk label.
// fmt: nummerpladeformatet for det valgte land — bruges til validering, mask og placeholder.
// validatePlate: tjekker om pladen matcher fmt.regex og viser fejlbesked hvis formatet er forkert.
// handleSubmit: sender det nye køretøj til API'et via addVehicle() og navigerer til /cars ved succes.
// Returnerer en formular med landekode-vælger, nummerplade-input, kælenavn, køretøjstype-vælger og EV-toggle.

"use client";

import { useState, type ElementType } from "react";
import { useRouter } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { useVehicles } from "@/hooks";
import CountrySelector, { Country, EUROPEAN_COUNTRIES } from "@/components/CountrySelector";
import { getPlateFormat } from "@/data/plateFormats";
import { Plus, Zap, Car, Motorbike, Truck, Bus } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/buttons";
import type { VehicleType } from "@/context/VehiclesContext";

// De fire køretøjstyper brugeren kan vælge imellem
const VEHICLE_TYPES: { type: VehicleType; label: string; icon: ElementType }[] = [
  { type: "car", label: "Personbil", icon: Car },
  { type: "motorcycle", label: "Motorcykel", icon: Motorbike },
  { type: "truck", label: "Lastbil", icon: Truck },
  { type: "bus", label: "Bus", icon: Bus },
];

export default function TilfoejBilPage() {
  const router = useRouter();
  const { addVehicle } = useVehicles();
  const [country, setCountry] = useState<Country>(EUROPEAN_COUNTRIES[0]);
  const [plate, setPlate] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEV, setIsEV] = useState(false);
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [plateError, setPlateError] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nummerpladeformatet for det valgte land (regex, maske og placeholder)
  const fmt = getPlateFormat(country.code);

  function validatePlate(value: string) {
    if (!fmt.regex.test(value)) {
      setPlateError(`Ugyldig nummerplade — brug formatet ${fmt.hint}`);
      return false;
    }
    setPlateError("");
    return true;
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!validatePlate(plate)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await addVehicle({
        name: nickname.trim() || plate,
        plate,
        countryCode: country.code,
        isEV,
        vehicleType,
      });
      router.push(ROUTES.cars);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Kunne ikke tilføje køretøj",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Dine køretøjer" />

      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {submitError && (
            <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {submitError}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <CountrySelector value={country} onChange={(c) => { setCountry(c); setPlate(""); setPlateError(""); }} />

              <input
                type="text"
                value={plate}
                onChange={(e) => {
                  const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  const formatted = fmt.mask(raw);
                  setPlate(formatted);
                  if (plateError) validatePlate(formatted);
                }}
                onBlur={() => plate && validatePlate(plate)}
                placeholder={fmt.placeholder}
                maxLength={15}
                required
                disabled={isSubmitting}
                className={`flex-1 rounded-[3px] border bg-(--white-white) px-4 py-3.5 text-base font-semibold text-neutral-700 placeholder-neutral-400 shadow-sm outline-none focus:border-(--brand-green-01) disabled:opacity-60 ${
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
            disabled={isSubmitting}
            className="rounded-[3px] border border-neutral-400 bg-(--white-white) px-4 py-3.5 text-base font-semibold text-neutral-700 placeholder-neutral-400 shadow-sm outline-none focus:border-(--brand-green-01) disabled:opacity-60"
          />

          <div className="grid grid-cols-4 gap-2">
            {VEHICLE_TYPES.map(({ type, label, icon: Icon }) => {
              const selected = vehicleType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVehicleType(type)}
                  disabled={isSubmitting}
                  className={`flex flex-col items-center gap-1.5 rounded-[3px] border py-3 px-1 transition-colors disabled:opacity-60 ${
                    selected
                      ? "border-(--brand-green-01) bg-green-50 text-(--brand-green-01)"
                      : "border-neutral-300 bg-(--white-white) text-neutral-500"
                  }`}
                >
                  <Icon size={22} strokeWidth={selected ? 2.5 : 1.5} />
                  <span className={`text-xs font-semibold leading-tight text-center ${selected ? "text-(--brand-green-01)" : "text-neutral-500"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 rounded-[3px] border border-neutral-300 bg-(--white-white) px-4 py-3.5 shadow-sm">
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
              disabled={isSubmitting}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-60 ${
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

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="mt-auto flex w-full items-center justify-center gap-2 disabled:opacity-60"
          >
            <Plus size={22} strokeWidth={3} />
            {isSubmitting ? "Gemmer..." : "Tilføj"}
          </Button>
        </form>
      </main>
    </div>
  );
}
