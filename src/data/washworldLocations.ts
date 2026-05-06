// REMOVE LATER: WHEN A DATABASE HAS BEEN ESTABLISHED TO CONTAIN LOCATIONS

import washworldLocationsJson from '../../washworld-locations.json'

export type MapLocation = {
  id: number
  name: string
  address: string
  coords: [number, number]
}

type RawRow = {
  Location_id?: string
  name?: string
  address?: string
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
    const id = Number.parseInt(String(row.Location_id ?? ''), 10)
    if (!Number.isFinite(id)) return null
    return {
      id,
      name: row.name,
      address: row.address ?? '',
      coords,
    }
  })
  .filter((loc): loc is MapLocation => loc !== null)
