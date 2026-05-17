"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import AppHeader from "@/components/AppHeader.jsx";
import ScreenLayout from "@/components/ScreenLayout";
import { dashboardNewsItems, dashboardPageNames } from "@/data/dashboardData";
import PageInfo from "@/components/PageInfo.jsx";
import { fetchLocations } from "@/lib/Api";

const TEMP_FAVORITE_IDS = ["1048", "1043", "1049", "1011", "1051"];

function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
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
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 5,
  });

  const [nearestLocation, setNearestLocation] = useState<any>(null);
  const [locationsWithDistance, setLocationsWithDistance] = useState<any[]>([]);

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
        .sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));

      setLocationsWithDistance(withDistances);
      setNearestLocation(withDistances[0]);
    });
  }, [locations]);

  const favoriteLocationsWithDistance = locationsWithDistance.filter(
    (loc) => TEMP_FAVORITE_IDS.includes(loc.location_id),
  );

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <ScreenLayout>
        <PageInfo userName={dashboardPageNames.userName} />

        <section className="px-8 pt-10">
          <h2 className="mb-5 text-2xl font-bold text-black">
            {dashboardPageNames.nearbyTitle}
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex h-20 flex-1 items-center justify-between bg-(--brand-green-01) px-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white ring-2 ring-white">
                  W
                </div>

                <div>
                  <p className="text-sm font-bold leading-tight text-white">
                    {isLoading ? "Henter..." : nearestLocation?.location_name ?? "Finder nærmeste..."}
                  </p>
                  <p className="text-sm font-bold leading-tight text-white">
                    {nearestLocation?.location_address}
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
                  ? `/locations/map?locationId=${nearestLocation.location_id}&lat=${nearestLocation.location_coordinate_y}&lng=${nearestLocation.location_coordinate_x}`
                  : "/locations/map"
              }
              className="flex h-20 w-20 shrink-0 items-center justify-center bg-(--white-white) shadow-md"
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

        <section className="mt-12">
          <h2 className="mb-5 px-8 text-2xl font-bold text-black">
            {dashboardPageNames.favoritesTitle}
          </h2>

          <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
            {favoriteLocationsWithDistance.map((location: any) => (
              <FavoriteCard
                key={location.location_id}
                title={location.location_name}
                address={location.location_address}
                distance={location.distance}
              />
            ))}
          </div>
        </section>

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
      </ScreenLayout>
    </div>
  );
}

function FavoriteCard({ title, address, distance }: { title: string; address: string; distance: string | null }) {
  return (
    <article className="relative h-32 w-36 shrink-0 overflow-hidden bg-black shadow-lg border-2 border-(--brand-green-01)">
      <Image
        src="/locations-pictures/Herlev.jpg"
        alt={title}
        className="h-full w-full object-cover opacity-80"
        fill
        sizes="144px"
        quality={70}
        loading="eager"
      />

      <div className="absolute inset-0 flex flex-col justify-between">
        <div className="px-3 pt-3">
          <h3 className="text-sm font-bold leading-tight text-white">
            {title}
          </h3>
          <p className="text-xs leading-tight text-white/70">
            {address}
          </p>
        </div>

        <p className="absolute bottom-1.5 left-2.5 z-10 text-sm font-bold text-(--brand-green-01)">
          {distance ?? "—"}
        </p>

        <div className="absolute -right-px -bottom-px h-6">
          <button className="flex h-full items-center justify-end rounded-none border-0 bg-(--brand-green-01) pl-6 pr-2 text-xs leading-none font-bold text-white [clip-path:polygon(24%_0,101%_0,101%_101%,0_101%)]">
            {dashboardPageNames.favoriteCardButton}
          </button>
        </div>
      </div>
    </article>
  );
}

function NewsCard({ image, description }: { image: string; description: string }) {
  return (
    <article className="w-46 shrink-0 overflow-hidden border-white/90 bg-white shadow-md">
      <Image
        src={image}
        alt={description}
        className="w-full h-20 object-cover"
        width={184}
        height={80}
        quality={70}
      />

      <p className="px-2 py-2 text-sm font-bold leading-tight text-neutral-600">
        {description}
      </p>
    </article>
  );
}