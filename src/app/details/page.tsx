"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Star, Info } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AngleButton from "@/components/buttons/AngleButton";
import StartWashButton from "@/components/buttons/StartWashButton";
import {
  VaskselvDetails,
  StovsugerDetails,
  VaskehallDetails,
} from "@/data/detailsPageData";
import type { MapLocation } from "@/data/washworldLocations";
import {
  EQUIPMENT_SECTIONS,
  countEquipmentByType,
  fetchLocationEquipment,
  type LocationEquipment,
} from "@/lib/equipmentApi";
import { fetchLocationById } from "@/lib/locationsApi";
import { formatOpenHoursDisplay } from "@/lib/locationGeo";

interface MachineCardProps {
  id: string;
  image: string;
  title: string;
  status: string;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

const statusClass: Record<string, string> = {
  Ledig: "bg-(--brand-green-01)",
  Optaget: "bg-amber-500",
};

/** Vises når API'et endnu ikke returnerer udstyr for lokationen. */
const MOCK_LIVE_STATUS = [
  {
    liveStatusIcon: "/icons/EnkeltVaskIcon.png",
    liveStatusLabel: "Bilvask",
    counts: { available: 1, total: 3 },
  },
  {
    liveStatusIcon: "/icons/vaskselvIcon.png",
    liveStatusLabel: "Vask selv",
    counts: { available: 2, total: 3 },
  },
  {
    liveStatusIcon: "/icons/vacuum.png",
    liveStatusLabel: "Støvsugere",
    counts: { available: 0, total: 5 },
  },
] as const;

function formatLiveStatus(counts: { available: number; total: number }): string {
  return `${counts.available} / ${counts.total}`;
}

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("id");

  const [liked, setLiked] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [equipment, setEquipment] = useState<LocationEquipment[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);

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

  const liveStatusCounts = useMemo(() => {
    if (equipment.length === 0) {
      return MOCK_LIVE_STATUS;
    }

    return EQUIPMENT_SECTIONS.map((section) => ({
      liveStatusIcon: section.liveStatusIcon,
      liveStatusLabel: section.liveStatusLabel,
      counts: countEquipmentByType(equipment, section.type),
    }));
  }, [equipment]);

  const displayName = location?.name ?? "Herlev";
  const displayAddress = location?.address ?? "Dynamovej 4, 2860 Søborg";
  const displayHours = location
    ? formatOpenHoursDisplay(location.openHours)
    : "7-22";
  const displayId = location?.id ?? locationId ?? "1040";

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      <section className="relative h-12">
        <div className="relative inline-flex h-full min-w-45 items-center gap-3 bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
          <p className="whitespace-nowrap text-2xl font-bold text-white">
            {loadStatus === "loading" ? "Henter…" : displayName}
          </p>
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            aria-label={liked ? "Fjern fra favoritter" : "Tilføj til favoritter"}
            disabled={loadStatus !== "ready"}
          >
            <Star
              size={22}
              className={
                liked ? "fill-yellow-400 stroke-yellow-400" : "stroke-white/70"
              }
            />
          </button>
        </div>
      </section>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-6 px-6 py-5">
          {loadStatus === "error" ? (
            <p className="text-center text-sm text-(--color-danger)">
              {loadError ?? "Kunne ikke indlæse lokationen."}
            </p>
          ) : null}

          {loadStatus === "ready" ? (
            <>
              <section className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-neutral-900">{displayAddress}</p>
                  <p className="text-sm text-neutral-600">Miljøvenlig bilvask</p>
                  <p className="text-sm text-neutral-600">ID: {displayId}</p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-(--brand-green-01) text-sm font-bold text-neutral-800">
                  {displayHours}
                </div>
              </section>

              <section>
                <h2 className="mb-2 font-bold text-neutral-900">Live Status</h2>
                <div className="flex items-center justify-around rounded bg-white/80 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Image
                      src={liveStatusCounts[0].liveStatusIcon}
                      alt={liveStatusCounts[0].liveStatusLabel}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                    <span className="text-sm font-bold text-neutral-700">
                      {formatLiveStatus(liveStatusCounts[0].counts)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-neutral-200" />
                  <div className="flex items-center gap-2">
                    <Image
                      src={liveStatusCounts[1].liveStatusIcon}
                      alt={liveStatusCounts[1].liveStatusLabel}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                    <span className="text-sm font-bold text-neutral-700">
                      {formatLiveStatus(liveStatusCounts[1].counts)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-neutral-200" />
                  <div className="flex items-center gap-2">
                    <Image
                      src={liveStatusCounts[2].liveStatusIcon}
                      alt={liveStatusCounts[2].liveStatusLabel}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                    <span className="text-sm font-bold text-neutral-700">
                      {formatLiveStatus(liveStatusCounts[2].counts)}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-1.5 text-xl font-bold text-neutral-900">
                  Vaskehaller <Info size={16} className="text-neutral-500" />
                </h2>
                <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                  {VaskehallDetails.map((item) => (
                    <MachineCard
                      key={item.id}
                      id={`vaskehall-${item.id}`}
                      image={item.image}
                      title={item.title}
                      status={item.status}
                      selected={selectedId === `vaskehall-${item.id}`}
                      onSelect={setSelectedId}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-1.5 text-xl font-bold text-neutral-900">
                  Vask selv <Info size={16} className="text-neutral-500" />
                </h2>
                <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                  {VaskselvDetails.map((item) => (
                    <MachineCard
                      key={item.id}
                      id={`vaskselv-${item.id}`}
                      image={item.image}
                      title={item.title}
                      status={item.status}
                      selected={selectedId === `vaskselv-${item.id}`}
                      onSelect={setSelectedId}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 flex items-center gap-1.5 text-xl font-bold text-neutral-900">
                  Støvsugere <Info size={16} className="text-neutral-500" />
                </h2>
                <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                  {StovsugerDetails.map((item) => (
                    <MachineCard
                      key={item.id}
                      id={`stovsuger-${item.id}`}
                      image={item.image}
                      title={item.title}
                      status={item.status}
                      selected={selectedId === `stovsuger-${item.id}`}
                      onSelect={setSelectedId}
                    />
                  ))}
                </div>
              </section>

              <StartWashButton onClick={() => {}} />
              {selectedId &&
                (() => {
                  const allItems = [
                    ...VaskehallDetails.map((i) => ({
                      key: `vaskehall-${i.id}`,
                      title: i.title,
                    })),
                    ...VaskselvDetails.map((i) => ({
                      key: `vaskselv-${i.id}`,
                      title: i.title,
                    })),
                    ...StovsugerDetails.map((i) => ({
                      key: `stovsuger-${i.id}`,
                      title: i.title,
                    })),
                  ];
                  const selected = allItems.find((i) => i.key === selectedId);
                  return selected ? (
                    <p className="text-center text-sm text-white">
                      Valgt: {selected.title}
                    </p>
                  ) : null;
                })()}
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function MachineCard({
  id,
  image,
  title,
  status,
  selected,
  onSelect,
}: MachineCardProps) {
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
