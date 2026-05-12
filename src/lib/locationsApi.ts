import type { MapLocation } from "../data/washworldLocations";

type ApiLocationRow = {
  location_id: string;
  location_address: string;
  location_zipcode: string;
  location_coordinate_x: number;
  location_coordinate_y: number;
  location_open_hours: string;
};

function mapApiRowToMapLocation(row: ApiLocationRow): MapLocation | null {
  const lng = Number(row.location_coordinate_x);
  const lat = Number(row.location_coordinate_y);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const inDenmark = lng >= 7 && lng <= 16 && lat >= 54 && lat <= 58;
  if (!inDenmark) return null;

  const address = `${row.location_address}, ${row.location_zipcode}`.trim();
  const name = row.location_address.trim();

  return {
    id: row.location_id,
    name,
    address,
    coords: [lng, lat],
    openHours: row.location_open_hours ?? "",
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
