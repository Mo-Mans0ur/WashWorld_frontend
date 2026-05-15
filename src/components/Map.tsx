"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapControls from "./MapControls";
import type { MapLocation } from "../data/washworldLocations";
import { fetchMapLocations } from "../lib/locationsApi";
import {
  formatKmDa,
  formatOpenHoursDisplay,
  haversineKm,
  locationShortName,
} from "../lib/locationGeo";

// Henter access token variablen fra .env.local
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type LightPreset = "day" | "night";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Her laver vi stylingen af markørerne på kortet
function createPrimaryPin(): HTMLImageElement {
  const img = document.createElement("img");
  img.src = "/washworld-pin.svg";
  img.alt = "";
  img.width = 28;
  img.height = 28;
  return img;
}

function createUserLocationPin(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "washworld-user-location-pin";
  return el;
}

function updateUserLocationMarker(
  map: mapboxgl.Map,
  markerRef: MutableRefObject<mapboxgl.Marker | null>,
  lngLat: [number, number],
): void {
  if (!markerRef.current) {
    markerRef.current = new mapboxgl.Marker({
      element: createUserLocationPin(),
      anchor: "center",
    })
      .setLngLat(lngLat)
      .addTo(map);
    return;
  }

  markerRef.current.setLngLat(lngLat);
}

function addLocationMarkers(
  map: mapboxgl.Map,
  locations: MapLocation[],
  getUserLngLat: () => [number, number] | null,
): void {
  let activePopup: mapboxgl.Popup | null = null;
  let isMarkerFlyTo = false;

  const closeActivePopup = () => {
    if (!activePopup) return;
    activePopup.remove();
    activePopup = null;
  };

  map.on("click", closeActivePopup);
  map.on("zoomstart", () => {
    if (isMarkerFlyTo) return;
    closeActivePopup();
  });
  map.on("moveend", () => {
    isMarkerFlyTo = false;
  });

  locations.forEach((loc) => {
    const popup = new mapboxgl.Popup({
      offset: 20,
      maxWidth: "400px",
      className: "washworld-popup",
      closeOnClick: true,
      closeOnMove: false,
    });

    const marker = new mapboxgl.Marker({
      element: createPrimaryPin(),
      anchor: "center",
    })
      .setLngLat(loc.coords)
      .addTo(map);

    marker.getElement().addEventListener("click", (event) => {
      event.stopPropagation();
      closeActivePopup();

      const user = getUserLngLat();
      const distancePart = user
        ? formatKmDa(haversineKm(user, loc.coords))
        : "— km";
      const hours = escapeHtml(formatOpenHoursDisplay(loc.openHours));
      const shortName = escapeHtml(locationShortName(loc.name));
      const addressHtml = escapeHtml(loc.address);

      popup
        .setHTML(
          `
        <div class="washworld-popup-card">
          <h4 class="washworld-popup-title">
            ${shortName} • <span class="washworld-popup-distance">${distancePart}</span>
          </h4>
          <p class="washworld-popup-address">${addressHtml}</p>
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
        .addTo(map);
      activePopup = popup;

      isMarkerFlyTo = true;
      map.flyTo({
        center: loc.coords,
        zoom: 12,
      });
    });
  });
}

function fitMapToLocations(
  map: mapboxgl.Map,
  locations: MapLocation[],
): void {
  if (locations.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => bounds.extend(loc.coords));
  map.fitBounds(bounds, { padding: 56, maxZoom: 8.5 });
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userLngLatRef = useRef<[number, number] | null>(null);
  const [lightPreset, setLightPreset] = useState<LightPreset>("day");
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchMapLocations();
        if (cancelled) return;
        setLocations(data);
        setLoadStatus("ready");
        setLoadError(null);
      } catch (e) {
        if (cancelled) return;
        setLoadStatus("error");
        setLoadError(e instanceof Error ? e.message : "Ukendt fejl");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lngLat: [number, number] = [
          pos.coords.longitude,
          pos.coords.latitude,
        ];
        userLngLatRef.current = lngLat;

        const map = mapRef.current;
        if (map) {
          updateUserLocationMarker(map, userMarkerRef, lngLat);
        }
      },
      () => {
        userLngLatRef.current = null;
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    );
  }, []);

  useEffect(() => {
    if (loadStatus !== "ready") return;
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      attributionControl: false,
      config: { basemap: { theme: "monochrome", lightPreset } },
      center: [12.5683, 55.6761],
      zoom: 6,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      addLocationMarkers(map, locations, () => userLngLatRef.current);
      if (userLngLatRef.current) {
        updateUserLocationMarker(map, userMarkerRef, userLngLatRef.current);
      }
      fitMapToLocations(map, locations);
    });

    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [loadStatus, locations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setConfigProperty("basemap", "lightPreset", lightPreset);
  }, [lightPreset]);

  const cycleLightPreset = () => {
    setLightPreset((current) => (current === "day" ? "night" : "day"));
  };

  const centerOnUser = () => {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) return;

    const focus = (lngLat: [number, number]) => {
      userLngLatRef.current = lngLat;
      updateUserLocationMarker(map, userMarkerRef, lngLat);
      map.flyTo({ center: lngLat, zoom: 13, duration: 700 });
    };

    if (userLngLatRef.current) {
      focus(userLngLatRef.current);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        focus([pos.coords.longitude, pos.coords.latitude]);
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    );
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.85)",
    zIndex: 2,
    fontSize: "0.95rem",
    padding: "1rem",
    textAlign: "center",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "calc(120dvh - 112px)",
        position: "relative",
      }}
    >
      <MapControls
        lightPreset={lightPreset}
        onCycleLightPreset={cycleLightPreset}
        onCenterOnUser={centerOnUser}
      />
      {loadStatus === "loading" ? (
        <div style={overlayStyle}>Henter lokationer…</div>
      ) : null}
      {loadStatus === "error" ? (
        <div style={overlayStyle}>
          <span>{loadError ?? "Kunne ikke indlæse kortet."}</span>
        </div>
      ) : null}
      <div
        ref={mapContainer}
        className="washworld-map"
        style={{
          width: "100%",
          height: "100%",
          visibility: loadStatus === "ready" ? "visible" : "hidden",
        }}
      />
    </div>
  );
}
