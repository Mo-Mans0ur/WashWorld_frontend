"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type LightPreset = "day" | "night";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function bindDetailsLink(
  popup: mapboxgl.Popup,
  locationId: string,
  onOpenDetails: (locationId: string) => void,
): void {
  const link = popup.getElement()?.querySelector(".washworld-popup-more");
  if (!link) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpenDetails(locationId);
  });
}

function addLocationMarkers(
  map: mapboxgl.Map,
  locations: MapLocation[],
  getUserLngLat: () => [number, number] | null,
  onOpenDetails: (locationId: string) => void,
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
              <a href="/details?id=${encodeURIComponent(loc.id)}" class="washworld-popup-more">Se mere</a>
            </div>
          </div>
        `,
        )
        .setLngLat(loc.coords)
        .addTo(map);
      bindDetailsLink(popup, loc.id, onOpenDetails);
      activePopup = popup;

      isMarkerFlyTo = true;
      map.flyTo({ center: loc.coords, zoom: 12 });
    });
  });
}

function fitMapToLocations(map: mapboxgl.Map, locations: MapLocation[]): void {
  if (locations.length === 0) return;
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => bounds.extend(loc.coords));
  map.fitBounds(bounds, { padding: 56, maxZoom: 8.5 });
}

async function drawRoute(
  map: mapboxgl.Map,
  from: [number, number],
  to: [number, number],
): Promise<void> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  const json = await res.json();
  const route = json.routes?.[0]?.geometry;
  if (!route) return;

  if (map.getSource("route")) {
    (map.getSource("route") as mapboxgl.GeoJSONSource).setData(route);
    return;
  }

  map.addSource("route", { type: "geojson", data: route });
  map.addLayer({
    id: "route",
    type: "line",
    source: "route",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": "#00b140",
      "line-width": 5,
      "line-opacity": 0.85,
    },
  });
}

export default function Map() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destLat = searchParams.get("lat");
  const destLng = searchParams.get("lng");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userLngLatRef = useRef<[number, number] | null>(null);
  const routeDrawnRef = useRef(false);

  const [lightPreset, setLightPreset] = useState<LightPreset>("day");
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const orig = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (pointerId) {
      try { orig.call(this, pointerId); } catch { /* mapbox-gl throws NotFoundError on fast drags */ }
    };
    return () => { Element.prototype.releasePointerCapture = orig; };
  }, []);

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
    return () => { cancelled = true; };
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
        if (map) updateUserLocationMarker(map, userMarkerRef, lngLat);
      },
      () => { userLngLatRef.current = null; },
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
      addLocationMarkers(
        map,
        locations,
        () => userLngLatRef.current,
        (locationId) =>
          router.push(`/details?id=${encodeURIComponent(locationId)}`),
      );

      if (userLngLatRef.current) {
        updateUserLocationMarker(map, userMarkerRef, userLngLatRef.current);
      }

      // Tegn rute hvis vi kom fra dashboard med en destination
      if (destLat && destLng && userLngLatRef.current && !routeDrawnRef.current) {
        const to: [number, number] = [parseFloat(destLng), parseFloat(destLat)];
        routeDrawnRef.current = true;

        drawRoute(map, userLngLatRef.current, to).then(() => {
          const bounds = new mapboxgl.LngLatBounds()
            .extend(userLngLatRef.current!)
            .extend(to);
          map.fitBounds(bounds, { padding: 80 });
        });
      } else {
        fitMapToLocations(map, locations);
      }
    });

    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [loadStatus, locations, destLat, destLng]);

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
      (pos) => focus([pos.coords.longitude, pos.coords.latitude]),
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
    <div style={{ width: "100%", height: "calc(120dvh - 112px)", position: "relative" }}>
      <MapControls
        lightPreset={lightPreset}
        onCycleLightPreset={cycleLightPreset}
        onCenterOnUser={centerOnUser}
      />
      {loadStatus === "loading" && (
        <div style={overlayStyle}>Henter lokationer…</div>
      )}
      {loadStatus === "error" && (
        <div style={overlayStyle}>
          <span>{loadError ?? "Kunne ikke indlæse kortet."}</span>
        </div>
      )}
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