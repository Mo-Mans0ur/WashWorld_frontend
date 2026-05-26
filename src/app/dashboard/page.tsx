// DashboardPage – forsiden brugeren lander på efter login.
// Viser nærmeste vaskehal (via GPS), favoritter som vandret karussel og nyheder/tilbud.
//
// Hooks der bruges:
//   useAuth()            → henter brugerens fornavn til velkomsthilsen (PageInfo)
//   useVehicles()        → tjekker om brugeren har registreret et køretøj (til notifikationsklokken)
//   useFavorites()       → henter liste af favorit-lokations-id'er (FavoritesContext, localStorage)
//   useNearestLocation() → bruger GPS og haversineKm til at sortere lokationer efter afstand
//   useAnimatedToast()   → styrer notifikations-toastens animationsfaser
//   useQuery()           → henter lokationer og tilbud fra API'et via TanStack Query (cachet 5 min)
//
// Komponenter der bruges:
//   PageInfo         → viser sidetitel og brugerens fornavn øverst
//   FavoriteCard     → enkelt favoritkort i karussellen (defineret nedenfor)
//   NewsCard         → tilbudskort i nyhedskarussellen (defineret nedenfor)

"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardPageNames } from "@/data/dashboardData";
import PageInfo from "@/components/PageInfo";
import { fetchLocations } from "@/lib/Api";
import { fetchOffers, getOfferImageSrc } from "@/lib/offersApi";
import type { Offer } from "@/types/api";
import { formatLocationAddress } from "@/lib/locationsApi";
import { useFavorites, useAuth, useVehicles, useNearestLocation, useAnimatedToast } from "@/hooks";
import { ROUTES } from "@/lib/routes";

export default function DashboardPage() {
  const { displayFirstName } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { favorites } = useFavorites();

  const [missingPaymentCard] = useState(
    () => typeof window !== "undefined"
      ? window.localStorage.getItem("washworld-saved-payment-card") === null
      : false,
  );

  const missingVehicle = !vehiclesLoading && vehicles.length === 0;
  const hasMissingProfileInfo = missingVehicle || missingPaymentCard;

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 5,
  });

  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: fetchOffers,
    staleTime: 1000 * 60 * 5,
  });

  const { nearestLocation, locationsWithDistance, locationError } = useNearestLocation(locations);
  const { show: showToast, phase: toastPhase, trigger: triggerToast } = useAnimatedToast(5000, 5500);

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
      {showToast && (
        <div
          className={`profile-update-toast absolute right-5 top-18 z-30 w-[calc(100%-2.5rem)] max-w-80 rounded-[3px] bg-white/96 px-4 py-3 text-left shadow-[0_12px_24px_rgba(0,0,0,0.16)] ${toastPhase === "enter" ? "profile-update-toast-enter" : ""} ${toastPhase === "exit" ? "profile-update-toast-exit" : ""}`}
        >
          <p className="text-[0.86rem] font-bold text-(--brand-green-01)">{notificationToastTitle}</p>
          <p className="mt-1 text-[0.78rem] leading-snug text-[#5d645f]">{notificationToastMessage}</p>
          <div className="mt-3 flex justify-end">
            <Link
              href={ROUTES.profile}
              className="flex h-11 items-center justify-center bg-(--brand-green-01) pl-5 pr-4 text-[0.92rem] font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] [clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]"
            >
              {dashboardPageNames.notificationToastButton}
            </Link>
          </div>
        </div>
      )}

      {hasMissingProfileInfo && (
        <button
          type="button"
          onClick={triggerToast}
          aria-label="Åbn notifikationer"
          className="notification-bell-active absolute right-8 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition"
        >
          <span className="notification-bell-icon">
            <Bell className="h-6 w-6" strokeWidth={2.3} />
          </span>
          <span className="notification-bell-dot absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-(--color-secondary)" />
        </button>
      )}

      <PageInfo userName={displayFirstName} />

      <section className="px-8 pt-10">
        <h2 className="mb-5 text-2xl font-bold text-black">{dashboardPageNames.nearbyTitle}</h2>

        <div className="flex items-center gap-3">
          <div className="flex h-20 flex-1 items-center justify-between rounded-[3px] bg-(--brand-green-01) px-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white ring-2 ring-white">
                W
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-white">
                  {isLoading ? "Henter..." : locationError ? "Placering ikke tilgængelig" : (nearestLocation?.location_name ?? "Finder nærmeste...")}
                </p>
                <p className="text-sm font-bold leading-tight text-white">
                  {nearestLocation ? formatLocationAddress(nearestLocation) : null}
                </p>
              </div>
            </div>
            <p className="text-sm font-bold text-black">{nearestLocation?.distance ?? "—"}</p>
          </div>

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

      {favoriteLocationsWithDistance.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 px-8 text-2xl font-bold text-black">{dashboardPageNames.favoritesTitle}</h2>
          <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
            {favoriteLocationsWithDistance.map((location) => (
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
      )}

      {!offersLoading && offers.length > 0 && (
        <section className="mt-12 pb-8">
          <h2 className="mb-3 px-8 text-2xl font-bold text-black">{dashboardPageNames.forYouTitle}</h2>
          <h3 className="mb-4 px-8 text-xl font-bold text-black">{dashboardPageNames.newsTitle}</h3>
          <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
            {offers.map((offer) => (
              <NewsCard key={offer.offer_id} offer={offer} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

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
          <h3 className="text-sm font-bold leading-tight text-white">{title}</h3>
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

function NewsCard({ offer }: { offer: Offer }) {
  const imageSrc = getOfferImageSrc(offer.offer_photo_base64);
  const isDataUrl = imageSrc.startsWith("data:");

  return (
    <Link
      href={ROUTES.underConstruction}
      className="w-46 shrink-0 overflow-hidden rounded-[3px] border-white/90 bg-white shadow-md block"
    >
      {isDataUrl ? (
        <img src={imageSrc} alt={offer.offer_description} className="h-20 w-full object-cover" />
      ) : (
        <Image
          src={imageSrc}
          alt={offer.offer_description}
          className="h-20 w-full object-cover"
          width={184}
          height={80}
          quality={75}
          loading="eager"
        />
      )}
      <p className="px-2 py-2 text-sm font-bold leading-tight text-neutral-600">
        {offer.offer_description}
      </p>
    </Link>
  );
}
