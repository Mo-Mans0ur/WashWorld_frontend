// useLocationDetails – henter lokationsdata og udstyrsstatus for én vaskelokalitet.
// Bruges på details/page.tsx til at vise adresse, åbningstider, maskiner og live-status.
//
// Henter to ting sekventielt:
//   1. fetchLocationById (locationsApi.ts)       → navn, adresse, åbningstider
//   2. fetchLocationEquipment (equipmentApi.ts)  → maskiner med status (ledig/optaget/ud af drift)
//
// Udstyrskaldet fejler lydstille – siden viser blot 0-tæller hvis API'et er nede.
// cancelled-flaget forhindrer setState-kald efter komponenten er unmountet (fx ved navigation).
//
// selectedId styrer hvilken maskine der er valgt (format: "{type}-{equipment_id}", fx "vaskehal-42").
// Den første ledige vaskehal vælges automatisk når data er hentet.
//
// Returnerer: { location, equipment, loadStatus, loadError, selectedId, setSelectedId }

import { useEffect, useState } from "react";
import {
  fetchLocationEquipment,
  type LocationEquipment,
} from "@/lib/equipmentApi";
import { fetchLocationById } from "@/lib/locationsApi";
import type { MapLocation } from "@/types/location";

type LoadStatus = "loading" | "error" | "ready";

export function useLocationDetails(locationId: string | null) {
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [equipment, setEquipment] = useState<LocationEquipment[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(locationId ? "loading" : "error");
  const [loadError, setLoadError] = useState<string | null>(
    locationId ? null : "Manglende lokations-id",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) return;

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
          }
        } catch {
          // Udstyrsfejl er ikke kritiske – vis bare tomme tællere
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

  return { location, equipment, loadStatus, loadError, selectedId, setSelectedId };
}
