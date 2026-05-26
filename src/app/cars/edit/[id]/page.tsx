// RedigerBilPage – side til at redigere et eksisterende køretøj.
// Henter køretøjet fra VehiclesContext via URL-parameteren [id].
// Hvis køretøjet ikke eksisterer (forkert ID eller slettet), sendes brugeren til /cars.
//
// VEHICLE_TYPES: liste over de fire understøttede køretøjstyper med ikon og dansk label.
// RedigerBilForm: selve formularen forudfyldt med køretøjets nuværende data.
//   fmt: nummerpladeformatet for det valgte land.
//   validatePlate: tjekker pladen mod fmt.regex og viser fejlbesked hvis formatet er forkert.
//   handleSubmit: sender de opdaterede data til API'et via updateVehicle() og navigerer til /cars.
// vehicle: det køretøj der redigeres, slået op via id-parameteren fra URL'en.
// Returnerer formularen, eller en loading-besked mens køretøjslisten hentes.

"use client";

import { useEffect, useState, type ElementType } from "react";
import { useRouter, useParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { useVehicles } from "@/hooks";
import CountrySelector, { Country, EUROPEAN_COUNTRIES } from "@/components/CountrySelector";
import { getPlateFormat } from "@/data/plateFormats";
import { Check, Zap, Car, Motorbike, Truck, Bus } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/buttons";
import type { Vehicle, VehicleType } from "@/context/VehiclesContext";

// De fire køretøjstyper brugeren kan vælge imellem
const VEHICLE_TYPES: { type: VehicleType; label: string; icon: ElementType }[] = [
  { type: "car",        label: "Personbil",  icon: Car },
  { type: "motorcycle", label: "Motorcykel", icon: Motorbike },
  { type: "truck",      label: "Lastbil",    icon: Truck },
  { type: "bus",        label: "Bus",        icon: Bus },
];

type UpdateVehicleFn = (
  id: string,
  v: Omit<Vehicle, "id" | "active" | "subscriptionName">,
) => Promise<void>;

function RedigerBilForm({
  vehicle,
  updateVehicle,
}: {
  vehicle: Vehicle;
  updateVehicle: UpdateVehicleFn;
}) {
  const router = useRouter();
  const [country, setCountry] = useState<Country>(
    EUROPEAN_COUNTRIES.find((c) => c.code === vehicle.countryCode) ?? EUROPEAN_COUNTRIES[0],
  );
  const [plate, setPlate] = useState(vehicle.plate);
  const [nickname, setNickname] = useState(vehicle.name);
  const [isEV, setIsEV] = useState(vehicle.isEV);
  const [vehicleType, setVehicleType] = useState<VehicleType>(vehicle.vehicleType ?? "car");
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
      await updateVehicle(vehicle.id, {
        name: nickname.trim() || plate,
        plate,
        countryCode: country.code,
        isEV,
        vehicleType,
      });
      router.push(ROUTES.cars);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Kunne ikke opdatere køretøj");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Rediger køretøj" />

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
            <Check size={22} strokeWidth={3} />
            {isSubmitting ? "Gemmer..." : "Gem"}
          </Button>
        </form>
      </main>
    </div>
  );
}

export default function RedigerBilPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { vehicles, isLoading, updateVehicle } = useVehicles();

  // Finder det køretøj der skal redigeres ud fra id i URL'en
  const vehicle = vehicles.find((v) => v.id === id);

  useEffect(() => {
    if (!isLoading && !vehicle) router.replace(ROUTES.cars);
  }, [isLoading, vehicle, router]);

  if (isLoading || !vehicle) {
    return (
      <div className="flex flex-col min-h-full">
        <PageInfo text="Rediger køretøj" />
        <main className="px-6 pt-8">
          <p className="text-center text-sm font-semibold text-neutral-500">Henter køretøj...</p>
        </main>
      </div>
    );
  }

  return <RedigerBilForm key={vehicle.id} vehicle={vehicle} updateVehicle={updateVehicle} />;
}
