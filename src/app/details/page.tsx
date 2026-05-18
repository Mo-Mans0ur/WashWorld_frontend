"use client";

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

// TODO: erstat med rigtig subscription-check når auth er implementeret
const HAS_SUBSCRIPTION = true;

interface MachineCardProps {
  id: string;
  image: string;
  title: string;
  status: string;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

// Mapning fra API-status til Tailwind baggrundsfarve på maskinkortet
const statusClass: Record<string, string> = {
  Ledig: "bg-(--brand-green-01)",
  Optaget: "bg-amber-500",
  "Ud af drift": "bg-red-500",
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

  // Brugerens interaktionstilstande
  const [liked, setLiked] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // fx "vaskehal-42"
  const [openInfo, setOpenInfo] = useState<string | null>(null); // hvilken sektion der viser dimensionspopup

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
          if (!cancelled) setEquipment(equipmentData);
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

  // Sender brugeren videre afhængigt af om de har et abonnement:
  // - Med abonnement: direkte til aktiv vask med lokation og maskine
  // - Uden abonnement: til enkeltvaske-flowet hvor de vælger vasketype
  function handleStartWash() {
    if (HAS_SUBSCRIPTION) {
      router.push(
        `/activewash?subscription=true&location=${locationId ?? ""}&equipment=${selectedId ?? ""}`,
      );
    } else {
      router.push("/singlewash");
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header med lokationsnavn og favoritknap */}
      <section className="relative h-12">
        <div className="relative inline-flex h-full min-w-45 items-center gap-3 bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
          <p className="whitespace-nowrap text-2xl font-bold text-white">
            {loadStatus === "loading" ? "Henter…" : (location?.name ?? "—")}
          </p>
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
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
                  <p className="text-sm text-neutral-600">Miljøvenlig bilvask</p>
                  <p className="text-sm text-neutral-600">ID: {location.id}</p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-(--brand-green-01) text-sm font-bold text-neutral-800">
                  {formatOpenHoursDisplay(location.openHours)}
                </div>
              </section>

              {/* Live Status: viser antal ledige maskiner per udstyrstype */}
              <section>
                <h2 className="mb-2 font-bold text-neutral-900">Live Status</h2>
                <div className="flex items-center justify-around divide-x divide-neutral-200 rounded bg-white/80 py-3 shadow-sm">
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
                      <button
                        type="button"
                        onClick={() => setOpenInfo(openInfo === section.type ? null : section.type)}
                        aria-label={`Vis dimensioner for ${section.label}`}
                        className="text-black"
                      >
                        <Info size={13} />
                      </button>
                    </h2>
                    {openInfo === section.type && (
                      <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded bg-white px-4 py-3 text-sm text-neutral-700 shadow-lg ring-1 ring-black/10">
                        <p className="font-semibold mb-1">Maks. køretøjsdimensioner</p>
                        <p>Højde: 2,6 m</p>
                        <p>Sidespejl til sidespejl: 2,58 m</p>
                      </div>
                    )}
                  </div>
                  {/* Vandret scrollbar med maskinekort – sorteret efter nummer fra API'et */}
                  <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                    {equipmentByType(equipment, section.type).map((item, idx) => (
                      <MachineCard
                        key={item.location_equipment_id}
                        id={`${section.type}-${item.location_equipment_id}`}
                        image={section.image}
                        title={formatEquipmentTitle(section.titlePrefix, idx + 1)}
                        status={normalizeStatus(item.location_equipment_status)}
                        selected={selectedId === `${section.type}-${item.location_equipment_id}`}
                        onSelect={setSelectedId}
                      />
                    ))}
                  </div>
                </section>
              ))}

              {/* Start vask-knap og navn på valgt maskine */}
              <StartWashButton onClick={handleStartWash} status={selectedItem?.status ?? null} />
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
function MachineCard({ id, image, title, status, selected, onSelect }: MachineCardProps) {
  return (
    <button
      onClick={() => onSelect(selected ? null : id)}
      className={`flex h-20 min-w-50 shrink-0 items-end overflow-hidden bg-white font-bold shadow-md ring-inset transition-shadow ${selected ? "ring-4 ring-(--brand-green-01)" : ""}`}
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
      <AngleButton
        text={status}
        className={statusClass[status] ?? "bg-neutral-400"}
      />
    </button>
  );
}
