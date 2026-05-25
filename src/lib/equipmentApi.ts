// equipmentApi – typer og API-kald til udstyr på vaskelokationer (vaskehaller, selvvask, støvsugere).
// Bruger apiRequest() fra apiClient.ts til alle kald mod /api/location_equipment.
// Bruges af details/page.tsx til at vise hvilke faciliteter der er til rådighed på en lokation.

export type LocationEquipment = {
  location_equipment_id: string;
  location_id: string;
  location_equipment_type: string;
  location_equipment_number: number;
  location_equipment_status: string;
  location_equipment_max_height: number;
  location_equipment_max_width: number;
};

export type EquipmentCounts = {
  available: number;
  total: number;
};

// De tre udstyrstyper vi viser på lokationssiden, med tilhørende labels og ikoner
export const EQUIPMENT_SECTIONS = [
  {
    type: "vaskehal",
    label: "Vaskehaller",
    titlePrefix: "Vaskehal",
    image: "/icons/EnkeltVaskIcon.png",
    liveStatusLabel: "Bilvask",
    liveStatusIcon: "/icons/EnkeltVaskIcon.png",
  },
  {
    type: "vask_selv",
    label: "Vask selv",
    titlePrefix: "Vask selv",
    image: "/icons/vaskselvIcon.png",
    liveStatusLabel: "Vask selv",
    liveStatusIcon: "/icons/vaskselvIcon.png",
  },
  {
    type: "stovsuger",
    label: "Støvsugere",
    titlePrefix: "Støvsuger",
    image: "/icons/vacuum.png",
    liveStatusLabel: "Støvsugere",
    liveStatusIcon: "/icons/vacuum.png",
  },
] as const;

function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base?.trim()) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL er ikke sat");
  }
  return base.replace(/\/$/, "");
}

// Returnerer true hvis udstyrets status er "ledig" (ikke optaget eller ude af drift)
export function isEquipmentAvailable(status: string): boolean {
  return status.trim().toLowerCase() === "ledig";
}

// Gør udstyrtypen til små bogstaver uden mellemrum for sikker sammenligning
export function normalizeEquipmentType(type: string): string {
  return type.trim().toLowerCase();
}

// Tæller hvor mange af en given udstyrstype der er ledige og hvor mange der er i alt
export function countEquipmentByType(
  equipment: LocationEquipment[],
  type: string,
): EquipmentCounts {
  const normalized = normalizeEquipmentType(type);
  const ofType = equipment.filter(
    (item) => normalizeEquipmentType(item.location_equipment_type) === normalized,
  );

  return {
    total: ofType.length,
    available: ofType.filter((item) =>
      isEquipmentAvailable(item.location_equipment_status),
    ).length,
  };
}

// Returnerer alle udstyr af en given type, sorteret efter nummer (fx Vaskehal 01, 02, 03...)
export function equipmentByType(
  equipment: LocationEquipment[],
  type: string,
): LocationEquipment[] {
  const normalized = normalizeEquipmentType(type);
  return equipment
    .filter(
      (item) =>
        normalizeEquipmentType(item.location_equipment_type) === normalized,
    )
    .sort((a, b) => a.location_equipment_number - b.location_equipment_number);
}

// Formaterer en overskrift til et enkelt udstyr, fx "Vaskehal 01"
export function formatEquipmentTitle(
  titlePrefix: string,
  number: number,
): string {
  return `${titlePrefix} ${String(number).padStart(2, "0")}`;
}

/**
 * Henter udstyr for en lokation (`GET /api/locations/:id/equipment`).
 */
export async function fetchLocationEquipment(
  locationId: string,
): Promise<LocationEquipment[]> {
  const url = `${getApiBase()}/api/locations/${encodeURIComponent(locationId)}/equipment`;
  const res = await fetch(url);

  if (!res.ok) {
    let message = `Kunne ikke hente udstyr (${res.status})`;
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
  if (Array.isArray(data)) {
    return data as LocationEquipment[];
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("equipment" in data) ||
    !Array.isArray((data as { equipment: unknown }).equipment)
  ) {
    throw new Error(`Uventet svar fra serveren: ${JSON.stringify(data)}`);
  }

  return (data as { equipment: LocationEquipment[] }).equipment;
}
