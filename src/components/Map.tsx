'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapControls from './MapControls'
import { washworldMapLocations } from '../data/washworldLocations'

// Henter access token variablen fra .env.local
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

const LOCATIONS = washworldMapLocations

type LightPreset = 'day' | 'night'

const EARTH_RADIUS_KM = 6371

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Afstand mellem to punkter som [lng, lat] — grov men fin til "km væk" på et kort. */
function haversineKm(from: [number, number], to: [number, number]): number {
  const [lng1, lat1] = from
  const [lng2, lat2] = to
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

/** Dansk kilometerstreng, fx "7,6 km" */
function formatKmDa(km: number): string {
  return `${km.toFixed(1).replace('.', ',')} km`
}

/** Gør "7-22" til "07-22" til visning — matcher det I har i datasættet. */
function formatOpenHoursDisplay(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return '—'

  const parts = trimmed.split('-').map((s) => s.trim())
  if (parts.length < 2) return trimmed

  const padHour = (h: string): string =>
    /^\d{1,2}$/.test(h) ? h.padStart(2, '0') : h

  return `${padHour(parts[0])}-${padHour(parts[1])}`
}

/** Kun by/navn-delen: første ord før mellemrum, fx "Slagelse - Smedegade" → "Slagelse". */
function locationShortName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0]
  return first ?? ''
}

// Her laver vi stylingen af markørerne på kortet
function createPrimaryPin(): HTMLImageElement {
  const img = document.createElement('img')
  img.src = '/washworld-pin.svg'
  img.alt = ''
  img.width = 28
  img.height = 28
  return img
}

function addLocationMarkers(
  map: mapboxgl.Map,
  getUserLngLat: () => [number, number] | null,
): void {
  let activePopup: mapboxgl.Popup | null = null
  let isMarkerFlyTo = false

  const closeActivePopup = () => {
    if (!activePopup) return
    activePopup.remove()
    activePopup = null
  }

  map.on('click', closeActivePopup)
  map.on('zoomstart', () => {
    if (isMarkerFlyTo) return
    closeActivePopup()
  })
  map.on('moveend', () => {
    isMarkerFlyTo = false
  })

  LOCATIONS.forEach((loc) => {
    const popup = new mapboxgl.Popup({
      offset: 20,
      maxWidth: '400px',
      className: 'washworld-popup',
      closeOnClick: true,
      closeOnMove: false,
    })

    const marker = new mapboxgl.Marker({
      element: createPrimaryPin(),
      anchor: 'center',
    })
      .setLngLat(loc.coords)
      .addTo(map)

    marker.getElement().addEventListener('click', (event) => {
      event.stopPropagation()
      closeActivePopup()

      const user = getUserLngLat()
      const distancePart = user ? formatKmDa(haversineKm(user, loc.coords)) : '— km'
      const hours = formatOpenHoursDisplay(loc.openHours)
      const shortName = locationShortName(loc.name)

      popup
        .setHTML(
          `
        <div class="washworld-popup-card">
          <h4 class="washworld-popup-title">
            ${shortName} • <span class="washworld-popup-distance">${distancePart}</span>
          </h4>
          <p class="washworld-popup-address">${loc.address}</p>
          <div class="washworld-popup-footer">
            <p class="washworld-popup-hours">
              <span class="washworld-popup-hours-accent">Åben</span>
              ${hours}
            </p>
            <span class="washworld-popup-more">Se mere</span>
          </div>
        </div>
      `,
        )
        .setLngLat(loc.coords)
        .addTo(map)
      activePopup = popup

      isMarkerFlyTo = true
      map.flyTo({
        center: loc.coords,
        zoom: 12,
      })
    })
  })
}

function fitMapToLocations(map: mapboxgl.Map): void {
  if (LOCATIONS.length === 0) return

  const bounds = new mapboxgl.LngLatBounds()
  LOCATIONS.forEach((loc) => bounds.extend(loc.coords))
  map.fitBounds(bounds, { padding: 56, maxZoom: 8.5 })
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const userLngLatRef = useRef<[number, number] | null>(null)
  const [lightPreset, setLightPreset] = useState<LightPreset>('day')

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLngLatRef.current = [pos.coords.longitude, pos.coords.latitude]
      },
      () => {
        userLngLatRef.current = null
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    )
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return
    if (mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      attributionControl: false,
      config: { basemap: { theme: 'monochrome', lightPreset } },
      center: [12.5683, 55.6761],
      zoom: 6,
    })
    mapRef.current = map

    // Standard Mapbox knapper (zoom ind/ud)
    map.addControl(new mapboxgl.NavigationControl())

    map.on('load', () => {
      addLocationMarkers(map, () => userLngLatRef.current)
      fitMapToLocations(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Vi skifter kun lys-tilstand (dag/nat), ikke tema/farver.
    map.setConfigProperty('basemap', 'lightPreset', lightPreset)
  }, [lightPreset])

  const cycleLightPreset = () => {
    setLightPreset((current) => (current === 'day' ? 'night' : 'day'))
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <MapControls
        lightPreset={lightPreset}
        onCycleLightPreset={cycleLightPreset}
      />
      <div
        ref={mapContainer}
        className="washworld-map"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}