"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { useVehicles } from "@/context/VehiclesContext";
import CountrySelector, { Country, EUROPEAN_COUNTRIES } from "@/components/CountrySelector";
import { getPlateFormat } from "@/data/plateFormats";
import { Check, Zap } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function RedigerBilPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { vehicles, isLoading, updateVehicle } = useVehicles();

  const vehicle = vehicles.find((v) => v.id === id);

  const initialCountry =
    EUROPEAN_COUNTRIES.find((c) => c.code === vehicle?.countryCode) ??
    EUROPEAN_COUNTRIES[0];

  const [country, setCountry] = useState<Country>(initialCountry);
  const [plate, setPlate] = useState(vehicle?.plate ?? "");
  const [nickname, setNickname] = useState(vehicle?.name ?? "");
  const [isEV, setIsEV] = useState(vehicle?.isEV ?? false);
  const [plateError, setPlateError] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!vehicle) router.replace(ROUTES.cars);
  }, [isLoading, vehicle, router]);

  useEffect(() => {
    if (!vehicle) return;
    setCountry(
      EUROPEAN_COUNTRIES.find((c) => c.code === vehicle.countryCode) ??
        EUROPEAN_COUNTRIES[0],
    );
    setPlate(vehicle.plate);
    setNickname(vehicle.name);
    setIsEV(vehicle.isEV);
  }, [vehicle]);

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
    if (!id || !validatePlate(plate)) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateVehicle(id, {
        name: nickname.trim() || plate,
        plate,
        countryCode: country.code,
        isEV,
        vehicleType: vehicle.vehicleType,
      });
      router.push(ROUTES.cars);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Kunne ikke opdatere køretøj",
      );
      setIsSubmitting(false);
    }
  }

  if (isLoading || !vehicle) {
    return (
      <div className="flex flex-col min-h-full">
        <PageInfo text="Rediger køretøj" />
        <main className="px-6 pt-8">
          <p className="text-center text-sm font-semibold text-neutral-500">
            Henter køretøj...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Rediger køretøj" />

      <main className="flex flex-col gap-4 px-6 pt-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {submitError && (
            <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {submitError}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <CountrySelector
                value={country}
                onChange={(c) => { setCountry(c); setPlate(""); setPlateError(""); }}
              />

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
                disabled={isSubmitting}
                className={`flex-1 rounded-sm border bg-(--white-white) px-4 py-3.5 text-base font-semibold text-neutral-700 placeholder-neutral-400 shadow-sm outline-none focus:border-(--brand-green-01) disabled:opacity-60 ${
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
            className="rounded-sm border border-neutral-400 bg-(--white-white) px-4 py-3.5 text-base font-semibold text-neutral-700 placeholder-neutral-400 shadow-sm outline-none focus:border-(--brand-green-01) disabled:opacity-60"
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

          <div className="flex gap-3 mt-auto">
            <button
              type="button"
              onClick={() => router.push(ROUTES.cars)}
              disabled={isSubmitting}
              className="flex-1 rounded-sm border-2 border-(--brand-green-01) py-4 text-xl font-bold text-(--brand-green-01) shadow-sm active:opacity-80 disabled:opacity-60"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-(--brand-green-01) py-4 text-xl font-bold text-white shadow-md active:opacity-80 disabled:opacity-60 [clip-path:polygon(6%_0,100%_0,100%_100%,0_100%)]"
            >
              <Check size={22} strokeWidth={3} />
              {isSubmitting ? "Gemmer..." : "Gem"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
