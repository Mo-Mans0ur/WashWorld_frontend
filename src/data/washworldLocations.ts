// Midlertidig datakilde til kortet, indtil vi henter lokationer fra backend.

import washworldLocationsJson from '../../washworld-locations.json'

export type MapLocation = {
  id: string
  name: string
  address: string
  coords: [number, number]
  openHours: string
}

type RawRow = {
  Location_id?: string
  name?: string
  address?: string
  open_hours?: string
  coordinates?: {
    x?: string | number | null
    y?: string | number | null
  }
  hidden?: number
}

function parseLngLat(row: RawRow): [number, number] | null {
  const { x, y } = row.coordinates ?? {}
  const lng = Number(x)
  const lat = Number(y)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null
  const inDenmark = lng >= 7 && lng <= 16 && lat >= 54 && lat <= 58
  if (!inDenmark) return null
  return [lng, lat]
}

export const washworldMapLocations: MapLocation[] = (
  washworldLocationsJson as RawRow[]
)
  .filter((row) => row.hidden !== 1)
  .map((row) => {
    const coords = parseLngLat(row)
    if (!coords || !row.name) return null
    const rawId = String(row.Location_id ?? '').trim()
    if (!rawId) return null
    return {
      id: rawId,
      name: row.name,
      address: row.address ?? '',
      coords,
      openHours: row.open_hours ?? '',
    }
  })
  .filter((loc): loc is MapLocation => loc !== null)
