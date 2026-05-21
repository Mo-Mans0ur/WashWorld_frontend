"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { dashboardNewsItems, dashboardPageNames } from "@/data/dashboardData";
import { getMissingProfileInfoState } from "@/data/profileData";
import PageInfo from "@/components/PageInfo";
import { fetchLocations } from "@/lib/Api";
import { formatLocationAddress } from "@/lib/locationsApi";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useVehicles } from "@/context/VehiclesContext";
import { ROUTES } from "@/lib/routes";

// Haversine-formel: beregner afstanden i km mellem to GPS-koordinater
function getDistanceInKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // jordens radius i km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DashboardPage() {
  const { displayFirstName } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { missingPaymentCard } = getMissingProfileInfoState();
  const missingVehicle = !vehiclesLoading && vehicles.length === 0;
  const hasMissingProfileInfo = missingVehicle || missingPaymentCard;
  const { favorites } = useFavorites();
  // TanStack Query henter alle lokationer fra API'et og cacher dem automatisk.
  // isLoading er true mens det første kald er i gang – bruges til at vise "Henter...".
  // staleTime på 5 minutter betyder at det cachede data genbruges i stedet for at
  // lave et nyt API-kald, så længe brugeren navigerer frem og tilbage inden for 5 min.
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 5,
  });

  // Lokationer beriget med beregnet afstand til brugeren
  const [nearestLocation, setNearestLocation] = useState<any>(null);
  const [locationsWithDistance, setLocationsWithDistance] = useState<any[]>([]);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [notificationToastPhase, setNotificationToastPhase] = useState<
    "idle" | "pre-enter" | "enter" | "exit"
  >("idle");
  const notificationToastTimeoutsRef = useRef<number[]>([]);

  // Når lokationer er hentet, beder vi om brugerens GPS-position og beregner
  // afstand til hver lokation. Sorteres nærmest-først, og nærmeste gemmes separat.
  useEffect(() => {
    if (!locations.length || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      const withDistances = locations
        .map((loc: any) => {
          const km = getDistanceInKm(
            latitude,
            longitude,
            loc.location_coordinate_y,
            loc.location_coordinate_x,
          );
          return { ...loc, distance: `${km.toFixed(1)} km` };
        })
        .sort(
          (a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance),
        );

      setLocationsWithDistance(withDistances);
      setNearestLocation(withDistances[0]);
    });
  }, [locations]);

  function handleNotificationClick() {
    notificationToastTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });

    setShowNotificationToast(true);
    setNotificationToastPhase("pre-enter");

    notificationToastTimeoutsRef.current = [
      window.setTimeout(() => {
        setNotificationToastPhase("enter");
      }, 40),
      window.setTimeout(() => {
        setNotificationToastPhase("exit");
      }, 5000),
      window.setTimeout(() => {
        setShowNotificationToast(false);
        setNotificationToastPhase("idle");
      }, 5500),
    ];
  }

  // Filtrerer de hentede lokationer ned til kun brugerens favoritter
  const favoriteLocationsWithDistance = locationsWithDistance.filter((loc) =>
    favorites.includes(loc.location_id),
  );

  const notificationToastTitle =
    missingVehicle && missingPaymentCard
      ? dashboardPageNames.notificationToastTitleBoth
      : missingVehicle
        ? dashboardPageNames.notificationToastTitleVehicle
        : dashboardPageNames.notificationToastTitleCard;

  const notificationToastMessage =
    missingVehicle && missingPaymentCard
      ? dashboardPageNames.notificationToastMessageBoth
      : missingVehicle
        ? dashboardPageNames.notificationToastMessageVehicle
        : dashboardPageNames.notificationToastMessageCard;

  return (
    <div className="relative flex flex-1 min-h-0 flex-col">
      {showNotificationToast ? (
        <div
          className={`profile-update-toast absolute right-5 top-18 z-30 w-[calc(100%-2.5rem)] max-w-80 rounded-[3px] bg-white/96 px-4 py-3 text-left shadow-[0_12px_24px_rgba(0,0,0,0.16)] ${notificationToastPhase === "enter" ? "profile-update-toast-enter" : ""} ${notificationToastPhase === "exit" ? "profile-update-toast-exit" : ""}`}
        >
          <p className="text-[0.86rem] font-bold text-(--brand-green-01)">
            {notificationToastTitle}
          </p>
          <p className="mt-1 text-[0.78rem] leading-snug text-[#5d645f]">
            {notificationToastMessage}
          </p>
          <div className="mt-3 flex justify-end">
            <Link
              href={ROUTES.profile}
              className="flex h-11 items-center justify-center bg-(--brand-green-01) pl-5 pr-4 text-[0.92rem] font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] [clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]"
            >
              {dashboardPageNames.notificationToastButton}
            </Link>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleNotificationClick}
        aria-label="Åbn notifikationer"
        className={`absolute right-8 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition ${hasMissingProfileInfo ? "notification-bell-active" : "hover:bg-white/16"}`}
      >
        <span className={hasMissingProfileInfo ? "notification-bell-icon" : ""}>
          <Bell className="h-6 w-6" strokeWidth={2.3} />
        </span>
        <span
          className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-(--color-secondary) transition ${hasMissingProfileInfo ? "notification-bell-dot" : "opacity-100"}`}
        />
      </button>

      <PageInfo userName={displayFirstName} />

      {/* Nærmeste vaskehal med link til kort */}
      <section className="px-8 pt-10">
        <h2 className="mb-5 text-2xl font-bold text-black">
          {dashboardPageNames.nearbyTitle}
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex h-20 flex-1 items-center justify-between rounded-[3px] bg-(--brand-green-01) px-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white ring-2 ring-white">
                W
              </div>

              <div>
                <p className="text-sm font-bold leading-tight text-white">
                  {isLoading
                    ? "Henter..."
                    : (nearestLocation?.location_name ?? "Finder nærmeste...")}
                </p>
                <p className="text-sm font-bold leading-tight text-white">
                  {nearestLocation
                    ? formatLocationAddress(nearestLocation)
                    : null}
                </p>
              </div>
            </div>

            <p className="text-sm font-bold text-black">
              {nearestLocation?.distance ?? "—"}
            </p>
          </div>

          {/* Bil-knap → navigerer til kortet med rute til nærmeste vaskehal */}
          <Link
            href={
              nearestLocation
                ? `${ROUTES.map}?locationId=${nearestLocation.location_id}&lat=${nearestLocation.location_coordinate_y}&lng=${nearestLocation.location_coordinate_x}`
                : ROUTES.map
            }
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[3px] bg-(--white-white) shadow-md"
            title={dashboardPageNames.currentLocationButtonAlt}
          >
            <Image
              src="/Car1.png"
              alt={dashboardPageNames.currentLocationButtonAlt}
              className="h-14 w-14 object-contain"
              width={56}
              height={56}
            />
          </Link>
        </div>
      </section>

      {/* Favoritvaskehaller – vandret scrollbar med kort der linker til detaljesiden */}
      <section className="mt-12">
        <h2 className="mb-5 px-8 text-2xl font-bold text-black">
          {dashboardPageNames.favoritesTitle}
        </h2>

        <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
          {favoriteLocationsWithDistance.map((location: any) => (
            <FavoriteCard
              key={location.location_id}
              locationId={location.location_id}
              title={location.location_name}
              address={formatLocationAddress(location)}
              distance={location.distance}
            />
          ))}
        </div>
      </section>

      {/* Nyheder og tilbud – statisk indhold fra dashboardData */}
      <section className="mt-12 pb-8">
        <h2 className="mb-3 px-8 text-2xl font-bold text-black">
          {dashboardPageNames.forYouTitle}
        </h2>

        <h3 className="mb-4 px-8 text-xl font-bold text-black">
          {dashboardPageNames.newsTitle}
        </h3>

        <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
          {dashboardNewsItems.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              image={newsItem.image}
              description={newsItem.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// Kort der viser en favoritlokation med billede, navn, adresse og afstand.
// Klikkes for at gå til lokationens detaljeside.
function FavoriteCard({
  locationId,
  title,
  address,
  distance,
}: {
  locationId: string;
  title: string;
  address: string;
  distance: string | null;
}) {
  return (
    <Link
      href={ROUTES.details(locationId)}
      className="relative h-32 w-36 shrink-0 overflow-hidden rounded-[3px] bg-black shadow-lg border-2 border-(--brand-green-01) block"
    >
      <Image
        src="/locations-pictures/Herlev.jpg"
        alt={title}
        className="h-full w-full object-cover opacity-80"
        fill
        sizes="144px"
        quality={75}
        loading="eager"
      />

      <div className="absolute inset-0 flex flex-col justify-between">
        <div className="px-3 pt-3">
          <h3 className="text-sm font-bold leading-tight text-white">
            {title}
          </h3>
          <p className="text-xs leading-tight text-white/70">{address}</p>
        </div>

        <p className="absolute bottom-1.5 left-2.5 z-10 text-sm font-bold text-(--brand-green-01)">
          {distance ?? "—"}
        </p>

        <div className="absolute -right-px -bottom-px h-6">
          <span className="flex h-full items-center justify-end bg-(--brand-green-01) pl-6 pr-2 text-xs leading-none font-bold text-white [clip-path:polygon(24%_0,101%_0,101%_101%,0_101%)]">
            {dashboardPageNames.favoriteCardButton}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Kort der viser en nyhed med billede og beskrivelse
function NewsCard({
  image,
  description,
}: {
  image: string;
  description: string;
}) {
  return (
    <Link
      href={ROUTES.underConstruction}
      className="w-46 shrink-0 overflow-hidden rounded-[3px] border-white/90 bg-white shadow-md block"
    >
      <Image
        src={image}
        alt={description}
        className="w-full h-20 object-cover"
        width={184}
        height={80}
        quality={75}
      />

      <p className="px-2 py-2 text-sm font-bold leading-tight text-neutral-600">
        {description}
      </p>
    </Link>
  );
}
