// locationsApi indeholder typer, formateringsfunktioner og API-kald til WashWorld-lokationer.
// fetchMapLocations() bruges af Map.tsx (kortet) og LocationsList.tsx (listetabellen).
// fetchLocationById() bruges af details/page.tsx til at vise én lokations detaljer.
// mapApiRowToMapLocation() konverterer rå API-rækker til det MapLocation-format som kortet forventer.
// Koordinatvalidering sikrer at kun gyldige danske koordinater vises på kortet.
import type { MapLocation } from "@/types/location";

export type ApiLocationRow = {
  location_id: string;
  location_name: string;
  location_address: string;
  location_zipcode: string;
  location_coordinate_x: number;
  location_coordinate_y: number;
  location_open_hours: string;
};

export function formatLocationAddress(row: {
  location_address: string;
  location_zipcode: string;
}): string {
  const street = row.location_address.trim();
  const zip = row.location_zipcode.trim();
  if (street && zip) return `${street}, ${zip}`;
  return street || zip;
}

function mapApiRowToMapLocation(row: ApiLocationRow): MapLocation | null {
  const lng = Number(row.location_coordinate_x);
  const lat = Number(row.location_coordinate_y);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const inDenmark = lng >= 7 && lng <= 16 && lat >= 54 && lat <= 58;
  if (!inDenmark) return null;

  const name = row.location_name?.trim();
  if (!name) return null;

  return {
    id: row.location_id,
    name,
    address: formatLocationAddress(row),
    coords: [lng, lat],
    openHours: row.location_open_hours?.trim() ?? "",
  };
}

/**
 * Henter lokationer fra Flask (`GET /api/locations`).
 * Base-URL sættes med `NEXT_PUBLIC_API_BASE_URL` i `.env.local`.
 */
export async function fetchMapLocations(): Promise<MapLocation[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base?.trim()) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL er ikke sat");
  }

  const url = `${base.replace(/\/$/, "")}/api/locations`;
  const res = await fetch(url);

  if (!res.ok) {
    let message = `Kunne ikke hente lokationer (${res.status})`;
    try {
      const body: unknown = await res.json();
      if (
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as { error: unknown }).error === "string"
      ) {
        message = (body as { error: string }).error;
      }
    } catch {
      /* ignore parse errors */
    }
    throw new Error(message);
  }

  const data: unknown = await res.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("locations" in data) ||
    !Array.isArray((data as { locations: unknown }).locations)
  ) {
    throw new Error("Uventet svar fra serveren");
  }

  const rows = (data as { locations: ApiLocationRow[] }).locations;
  return rows
    .map(mapApiRowToMapLocation)
    .filter((loc): loc is MapLocation => loc !== null);
}

/** Finder én lokation ud fra API-listen (samme endpoint som kortet). */
export async function fetchLocationById(
  id: string,
): Promise<MapLocation | null> {
  const locations = await fetchMapLocations();
  return locations.find((loc) => loc.id === id) ?? null;
}
