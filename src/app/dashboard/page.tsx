"use client";

import Image from "next/image";
import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";
import HeaderThing from "@/components/PageInfo.jsx";
import ScreenLayout from "@/components/ScreenLayout";
import {
  dashboardFavoriteLocations,
  dashboardNewsItems,
  dashboardPageNames,
} from "@/data/dashboardData";
import PageInfo from "@/components/PageInfo.jsx";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <ScreenLayout>
        <PageInfo text={"Hej"} userName={dashboardPageNames.userName} />

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
                    {dashboardPageNames.currentLocationTitle}
                  </p>
                  <p className="text-sm font-bold leading-tight text-white">
                    {dashboardPageNames.currentLocationSubtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-black">
                {dashboardPageNames.currentLocationDistance}
              </p>
            </div>

            <button className="flex h-20 w-20 shrink-0 items-center justify-center bg-(--white-white) shadow-md" title={dashboardPageNames.currentLocationButtonAlt}>
              <Image
                src="/Car1.png"
                alt={dashboardPageNames.currentLocationButtonAlt}
                className="h-14 w-14 object-contain"
                width={56}
                height={56}
              />
            </button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 px-8 text-2xl font-bold text-black">
            {dashboardPageNames.favoritesTitle}
          </h2>

          <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
            {dashboardFavoriteLocations.map((location) => (
              <FavoriteCard
                key={location.id}
                image={location.image}
                title={location.title}
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

      <BottomNav />
    </div>
  );
}

function FavoriteCard({ image, title, distance }) {
  return (
    <article className="relative h-32 w-36 shrink-0 overflow-hidden bg-black shadow-lg border-2 border-(--brand-green-01)">
      <Image
        src={image}
        alt={title}
        className="h-full w-full object-cover opacity-80"
        fill
        sizes="144px"
      />

      <div className="absolute inset-0 flex flex-col justify-between">
        <h3 className="px-3 pt-3 text-xl font-bold leading-tight text-white">
          {title}
        </h3>
        <p className="absolute bottom-1.5 left-2.5 z-10 text-sm font-bold text-(--brand-green-01)">
          {distance}
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

function NewsCard({
  image,
  description
}) {
  return (
    <article className="w-46 shrink-0 overflow-hidden border-white/90 bg-white shadow-md">
      <Image
        src={image}
        alt={description}
        className="w-full h-20 object-cover"
        width={184}
        height={80}
      />

      <p className="px-2 py-2 text-sm font-bold leading-tight text-neutral-600">
        {description}
      </p>
    </article>
  );
}
