'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapControls from './MapControls'
import { washworldMapLocations } from '../data/washworldLocations'

// Henter access token variablen fra .env.local
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const LOCATIONS = washworldMapLocations

type LightPreset = 'dawn' | 'day' | 'dusk' | 'night'

function readPrimaryCss(root: HTMLElement | null): string {
  const v = getComputedStyle(root ?? document.documentElement)
    .getPropertyValue('--color-primary')
    .trim()
  return v || '#06C167'
}

function applyWashworldBasemap(
  map: mapboxgl.Map,
  primary: string,
  lightPreset: LightPreset,
): void {
  map.setConfigProperty('basemap', 'theme', 'monochrome')
  map.setConfigProperty('basemap', 'lightPreset', lightPreset)
  map.setConfigProperty('basemap', 'colorRoads', primary)
  map.setConfigProperty('basemap', 'colorMotorways', primary)
  map.setConfigProperty('basemap', 'colorTrunks', primary)
  map.setConfigProperty('basemap', 'colorRoadLabels', primary)
}

// Her laver vi stylingen af markørerne på kortet
function createPrimaryPin(primary: string): HTMLDivElement {
  const img = document.createElement('img')
  img.src = '/washworld-pin.svg'
  img.alt = ''
  img.width = 28
  img.height = 28
  return img
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [is3D, setIs3D] = useState(true)
  const [pitch, setPitch] = useState(30)
  const [lightPreset, setLightPreset] = useState<LightPreset>('day')

  useEffect(() => {
    if (!mapContainer.current) return
    if (mapRef.current) return

    const primary = readPrimaryCss(mapContainer.current)

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      config: {
        basemap: {
          lightPreset,
          theme: 'monochrome',
          colorRoads: primary,
          colorMotorways: primary,
          colorTrunks: primary,
          colorRoadLabels: primary,
        },
      },
      center: [12.5683, 55.6761],
      zoom: 6,
      pitch: 30,
      bearing: -20,
      antialias: true,
    })
    mapRef.current = map

    // Add controls (zoom buttons)
    map.addControl(new mapboxgl.NavigationControl())

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })

      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      LOCATIONS.forEach((loc) => {
        const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '280px' }).setHTML(
          `<strong>${escapeHtml(loc.name)}</strong><div style="font-size:12px;margin-top:4px;line-height:1.35;">${escapeHtml(loc.address)}</div>`,
        )

        const marker = new mapboxgl.Marker({
          element: createPrimaryPin(primary),
          anchor: 'center',
        })
          .setLngLat(loc.coords)
          .setPopup(popup)
          .addTo(map)

        marker.getElement().addEventListener('click', () => {
          map.flyTo({
            center: loc.coords,
            zoom: 12,
          })
        })
      })

      if (LOCATIONS.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        LOCATIONS.forEach((loc) => bounds.extend(loc.coords))
        map.fitBounds(bounds, { padding: 56, maxZoom: 8.5 })
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    if (is3D) {
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        })
      }

      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
      map.easeTo({ pitch, bearing: -20, duration: 400 })
      return
    }

    map.setTerrain(null)
    map.easeTo({ pitch: 0, bearing: 0, duration: 400 })
  }, [is3D, pitch])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const syncBasemap = () => {
      const primary = readPrimaryCss(mapContainer.current)
      applyWashworldBasemap(map, primary, lightPreset)
    }

    if (map.isStyleLoaded()) {
      syncBasemap()
      return
    }

    map.once('load', syncBasemap)
  }, [lightPreset])

  const cycleLightPreset = () => {
    const order: LightPreset[] = ['day', 'night']
    setLightPreset((current) => order[(order.indexOf(current) + 1) % order.length])
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <MapControls
        is3D={is3D}
        pitch={pitch}
        lightPreset={lightPreset}
        onToggle3D={() => setIs3D((prev) => !prev)}
        onCycleLightPreset={cycleLightPreset}
        onPitchChange={(value) => setPitch(value)}
      />
      <div
        ref={mapContainer}
        className="washworld-map"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}