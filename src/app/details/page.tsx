"use client";

// DetailsPage – viser detaljer om én vaskelokalitet.
//
// Siden henter lokationsdata og udstyrsstatus fra API'et via URL-parameteren ?id=.
// Brugeren kan:
//   - Se live status på maskiner (ledig / optaget / ud af drift)
//   - Vælge en specifik maskine og starte en vask
//   - Tilføje/fjerne lokationen som favorit
//
// Navigationslogik ved "Start vask":
//   - Støvsuger eller vask-selv → /selfwash
//   - Vaskehal med aktivt abonnement → /activewash
//   - Vaskehal uden abonnement → /singlewash (vælg vasketype)

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Star, Info } from "lucide-react";
import AngleButton from "@/components/buttons/AngleButton";
import StartWashButton from "@/components/buttons/StartWashButton";
import type { MapLocation } from "@/data/washworldLocations";
import {
  EQUIPMENT_SECTIONS,
  countEquipmentByType,
  equipmentByType,
  fetchLocationEquipment,
  formatEquipmentTitle,
  type LocationEquipment,
} from "@/lib/equipmentApi";
import { fetchLocationById } from "@/lib/locationsApi";
import { formatOpenHoursDisplay } from "@/lib/locationGeo";
import { useFavorites, useAuth } from "@/hooks";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";
import CarPickerSheet from "@/components/CarPickerSheet";
import type { Car, Subscription } from "@/types/api";
import { ROUTES } from "@/lib/routes";

// Props til maskinkortet-komponenten nederst i filen
interface MachineCardProps {
  id: string;
  image: string;
  title: string;
  status: string;
  selected: boolean;
  faded: boolean;
  onSelect: (id: string | null) => void;
}

// Mapning fra API-status til Tailwind baggrundsfarve på maskinkortet
const statusClass: Record<string, string> = {
  Ledig: "bg-(--brand-green-01)",
  Optaget: "bg-amber-500",
  "Ud af drift": "bg-red-500",
};

const selectedRingClass: Record<string, string> = {
  Ledig: "ring-(--brand-green-01)",
  Optaget: "ring-amber-500",
  "Ud af drift": "ring-red-500",
};

// Oversætter API's lowercase-statusværdier til de viste navne med stort forbogstav
function normalizeStatus(status: string): string {
  const s = status.trim().toLowerCase();
  if (s === "ledig") return "Ledig";
  if (s === "optaget") return "Optaget";
  if (s === "ud af drift") return "Ud af drift";
  return status;
}

// Formaterer live-status tæller som "ledig / total", fx "3 / 6"
function formatLiveStatus(counts: { available: number; total: number }): string {
  return `${counts.available} / ${counts.total}`;
}

export default function DetailsPage() {
  // Henter lokationens id fra URL'en, fx /details?id=1051
  const searchParams = useSearchParams();
  const locationId = searchParams.get("id");
  const router = useRouter();

  // Henter den indloggede bruger fra AuthContext
  const { user } = useAuth();

  // Favorit-håndtering via FavoritesContext (gemmes i localStorage)
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = locationId ? isFavorite(locationId) : false;

  // selectedId holder styr på hvilken maskine brugeren har valgt, fx "vaskehal-42"
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // openInfo holder styr på hvilken sektion der viser dimensionspopuppen
  const [openInfo, setOpenInfo] = useState<string | null>(null);

  const [showCarPicker, setShowCarPicker] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [pendingCar, setPendingCar] = useState<Car | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchUserSubscriptions(user.user_id),
      fetchUserCars(user.user_id),
    ])
      .then(([subs, fetchedCars]) => {
        setUserSubscriptions(subs);
        setCars(fetchedCars);
      })
      .catch(() => {});
  }, [user]);

  // Data hentet fra API'et
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [equipment, setEquipment] = useState<LocationEquipment[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);

  // Henter lokationsdata og udstyr parallelt fra API'et når locationId ændrer sig.
  // cancelled-flaget forhindrer at setState kaldes efter komponenten er unmountet.
  // Udstyrshentning fejler lydstille – siden viser blot 0-tæller hvis API'et er nede.
  useEffect(() => {
    if (!locationId) {
      setLocation(null);
      setEquipment([]);
      setLoadStatus("error");
      setLoadError("Manglende lokations-id");
      return;
    }

    let cancelled = false;

    (async () => {
      setLoadStatus("loading");
      setLoadError(null);
      setSelectedId(null);

      try {
        const locationData = await fetchLocationById(locationId);
        if (cancelled) return;

        if (!locationData) {
          setLocation(null);
          setEquipment([]);
          setLoadStatus("error");
          setLoadError("Lokationen blev ikke fundet");
          return;
        }

        setLocation(locationData);

        try {
          const equipmentData = await fetchLocationEquipment(locationId);
          if (!cancelled) {
            setEquipment(equipmentData);
            const first = equipmentData.find(
              (e) =>
                e.location_equipment_type === "vaskehal" &&
                normalizeStatus(e.location_equipment_status) === "Ledig",
            ) ?? equipmentData.find((e) => e.location_equipment_type === "vaskehal");
            if (first) {
              const section = EQUIPMENT_SECTIONS.find(
                (s) => s.type === first.location_equipment_type,
              );
              if (section) {
                setSelectedId(`${section.type}-${first.location_equipment_id}`);
              }
            }
          }
        } catch {
          if (!cancelled) setEquipment([]);
        }

        if (!cancelled) setLoadStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setLocation(null);
        setEquipment([]);
        setLoadStatus("error");
        setLoadError(e instanceof Error ? e.message : "Ukendt fejl");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locationId]);

  // Beregner ledig/total for hver udstyrstype til Live Status-sektionen
  const liveStatusCounts = useMemo(() =>
    EQUIPMENT_SECTIONS.map((section) => ({
      liveStatusIcon: section.liveStatusIcon,
      liveStatusLabel: section.liveStatusLabel,
      counts: countEquipmentByType(equipment, section.type),
    })),
  [equipment]);

  // Finder titel og status for den valgte maskine ud fra selectedId.
  // selectedId har formatet "{type}-{location_equipment_id}", fx "vaskehal-42".
  // String() bruges fordi API'et returnerer id som tal, men selectedId er en string.
  const selectedItem = useMemo(() => {
    if (!selectedId || equipment.length === 0) return null;
    for (const section of EQUIPMENT_SECTIONS) {
      const prefix = `${section.type}-`;
      if (selectedId.startsWith(prefix)) {
        const equipId = selectedId.slice(prefix.length);
        const items = equipmentByType(equipment, section.type);
        const idx = items.findIndex(
          (e) => String(e.location_equipment_id) === equipId,
        );
        if (idx !== -1) {
          return {
            title: formatEquipmentTitle(section.titlePrefix, idx + 1),
            status: normalizeStatus(items[idx].location_equipment_status),
          };
        }
      }
    }
    return null;
  }, [selectedId, equipment]);

  function handleStartWash() {
    setShowCarPicker(true);
  }

  function routeToSingleWash(car: Car) {
    router.push(`${ROUTES.singlewash}?plate=${encodeURIComponent(car.car_license_plate)}&carId=${encodeURIComponent(car.car_id)}&location=${encodeURIComponent(locationId ?? "")}&equipment=${encodeURIComponent(selectedId ?? "")}`);
  }

  function handleCarSelected(car: Car) {
    setShowCarPicker(false);
    const isSelfService =
      selectedId?.startsWith("stovsuger") || selectedId?.startsWith("vask_selv");
    if (isSelfService) {
      router.push(
        `${ROUTES.selfWash(locationId ?? "", selectedId ?? "")}&carId=${encodeURIComponent(car.car_id)}`,
      );
      return;
    }
    const carSub = userSubscriptions.find(
      (s) => s.car_id === car.car_id && s.subscriptions_status === "aktiv",
    );
    if (carSub) {
      const coversThisLocation = !carSub.location_id || carSub.location_id === locationId;
      if (!coversThisLocation) {
        setPendingCar(car);
        setShowLocationWarning(true);
        return;
      }
      router.push(ROUTES.startWashSubscription(locationId ?? "", selectedId ?? "", car.car_id));
    } else {
      routeToSingleWash(car);
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Titelbar med lokationsnavn og favoritknap.
          z-10 sikrer at den ligger over det scrollende indhold nedenunder.
          Baggrunden er transparent så app-gradientet vises bag den skrå kant. */}
      <section className="relative z-10 h-12">
        <div className="relative inline-flex h-full min-w-45 items-center gap-3 bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
          <p className="whitespace-nowrap text-2xl font-bold text-white">
            {loadStatus === "loading" ? "Henter…" : (location?.name ?? "—")}
          </p>
          <button
            type="button"
            onClick={() => locationId && toggleFavorite(locationId)}
            aria-label={liked ? "Fjern fra favoritter" : "Tilføj til favoritter"}
            disabled={loadStatus !== "ready"}
          >
            <Star
              size={22}
              className={liked ? "fill-yellow-400 stroke-yellow-400" : "stroke-white/70"}
            />
          </button>
        </div>
      </section>

      <CarPickerSheet
        isOpen={showCarPicker}
        cars={cars}
        subscriptions={userSubscriptions}
        onSelect={handleCarSelected}
        onClose={() => setShowCarPicker(false)}
      />

      {showLocationWarning && pendingCar && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 pb-10 px-6">
          <div className="w-full max-w-sm rounded-[3px] bg-white p-6 shadow-xl">
            <h2 className="text-[1.1rem] font-bold text-neutral-900">
              Abonnement dækker ikke her
            </h2>
            <p className="mt-2 text-[0.85rem] leading-snug text-neutral-600">
              Dit abonnement er kun gyldigt på én WashWorld. En vask her vil
              blive kvitteret som en enkelt vask og koster ekstra.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowLocationWarning(false);
                  routeToSingleWash(pendingCar);
                  setPendingCar(null);
                }}
                className="h-11 w-full bg-(--brand-green-01) text-[0.9rem] font-bold text-white"
              >
                Start enkelt vask
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLocationWarning(false);
                  setPendingCar(null);
                }}
                className="h-11 w-full border border-(--brand-green-01) text-[0.9rem] font-bold text-(--brand-green-01)"
              >
                Annuller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollbart indholdsområde – alt nedenfor titelbaren kan scrolles */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-6 px-6 py-5">
          {/* Fejlbesked hvis lokationen ikke kunne hentes */}
          {loadStatus === "error" ? (
            <p className="text-center text-sm text-(--color-danger)">
              {loadError ?? "Kunne ikke indlæse lokationen."}
            </p>
          ) : null}

          {loadStatus === "ready" && location ? (
            <>
              {/* Lokationsinformation: adresse, åbningstider og ID */}
              <section className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-neutral-900">{location.address}</p>
                  <p className="text-sm text-neutral-900">Miljøvenlig bilvask</p>
                  <p className="text-sm text-neutral-900">ID: {location.id}</p>
                </div>
                {/* Cirkel der viser åbningstider */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-(--brand-green-01) text-sm font-bold text-neutral-800">
                  {formatOpenHoursDisplay(location.openHours)}
                </div>
              </section>

              {/* Live Status: viser antal ledige maskiner per udstyrstype */}
              <section>
                <h2 className="mb-2 font-bold text-neutral-900">Live Status</h2>
                <div className="flex items-center justify-around divide-x divide-neutral-200 rounded-[3px] bg-white py-3 shadow-sm">
                  {liveStatusCounts.map((s) => (
                    <div key={s.liveStatusLabel} className="flex flex-1 items-center justify-center gap-2">
                      <Image
                        src={s.liveStatusIcon}
                        alt={s.liveStatusLabel}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                      <span className="text-sm font-bold text-neutral-700">
                        {formatLiveStatus(s.counts)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Maskinlister: én sektion per udstyrstype (vaskehaller, vask selv, støvsugere).
                  Info-knappen viser en popup med køretøjsdimensioner for sektionen.
                  Kortene nummereres 1, 2, 3... per sektion uafhængigt af API's numre. */}
              {EQUIPMENT_SECTIONS.map((section) => (
                <section key={section.type}>
                  <div className="relative mb-3">
                    <h2 className="flex items-center gap-1.5 text-xl font-bold text-neutral-900">
                      {section.label}
                      {/* Info-knap der toggler dimensionspopuppen for denne sektion */}
                      <button
                        type="button"
                        onClick={() => setOpenInfo(openInfo === section.type ? null : section.type)}
                        aria-label={`Vis dimensioner for ${section.label}`}
                        className="text-black"
                      >
                        <Info size={13} />
                      </button>
                    </h2>
                    {/* Popup med maks. køretøjsdimensioner – vises kun for den valgte sektion */}
                    {openInfo === section.type && (
                      <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-[3px] bg-white px-4 py-3 text-sm text-neutral-700 shadow-lg ring-1 ring-black/10">
                        <p className="font-semibold mb-1">Maks. køretøjsdimensioner</p>
                        <p>Højde: 2,6 m</p>
                        <p>Sidespejl til sidespejl: 2,58 m</p>
                      </div>
                    )}
                  </div>
                  {/* Vandret scrollbar med maskinekort – sorteret efter nummer fra API'et */}
                  <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                    {equipmentByType(equipment, section.type).map((item, idx) => {
                      const cardId = `${section.type}-${item.location_equipment_id}`;
                      const isSelected = selectedId === cardId;
                      const isFaded = selectedId !== null && !isSelected;
                      return (
                        <MachineCard
                          key={item.location_equipment_id}
                          id={cardId}
                          image={section.image}
                          title={formatEquipmentTitle(section.titlePrefix, idx + 1)}
                          status={normalizeStatus(item.location_equipment_status)}
                          selected={isSelected}
                          faded={isFaded}
                          onSelect={setSelectedId}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Start vask-knap – deaktiveret hvis ingen maskine er valgt eller maskinen er optaget */}
              <StartWashButton onClick={handleStartWash} status={selectedItem?.status ?? null} />
              {/* Viser navnet på den valgte maskine under knappen */}
              {selectedItem && (
                <p className="text-center text-sm text-white">
                  Valgt: {selectedItem.title}
                </p>
              )}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

// Kort der repræsenterer én maskine. Klikkes for at vælge/fravælge maskinen.
// Viser status (ledig/optaget/ud af drift) med farvekodet badge i hjørnet.
function MachineCard({ id, image, title, status, selected, faded, onSelect }: MachineCardProps) {
  return (
    <button
      onClick={() => onSelect(selected ? null : id)}
      className={`flex h-20 min-w-50 shrink-0 items-end overflow-hidden rounded-[3px] bg-white font-bold shadow-md ring-inset transition-all ${selected ? `ring-4 ${selectedRingClass[status] ?? "ring-(--brand-green-01)"}` : ""} ${faded ? "opacity-40" : ""}`}
    >
      <div className="flex flex-1 self-center flex-row items-center justify-start gap-2 p-1">
        <Image
          src={image}
          alt={title}
          width={67}
          height={67}
          className="h-14 w-14 object-contain"
        />
        <span className="text-sm font-bold text-neutral-800">{title}</span>
      </div>
      {/* Farvekodet statusbadge i hjørnet af kortet */}
      <AngleButton
        text={status}
        size="lg"
        className={statusClass[status] ?? "bg-neutral-400"}
      />
    </button>
  );
}
