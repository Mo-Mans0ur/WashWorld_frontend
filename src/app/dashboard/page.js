"use client";

import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";
import HeaderThing from "@/components/HeaderThing.jsx";

const favoriteLocations = [
  {
    id: 1,
    image: "/locations-pictures/herlev.jpg",
    title: "Herlev",
    distance: "9.6 km",
  },
  {
    id: 2,
    image: "/locations-pictures/ballerup.jpg",
    title: "Ballerup",
    distance: "12.3 km",
  },
  {
    id: 3,
    image: "/locations-pictures/brøndby-strand.jpg",
    title: "Brøndby Strand",
    distance: "15.8 km",
  },
];

const NEWS = [
  {
    id: 1,
    image: "/logos/WashWorld-black-greenbg.png",
    description: "Start nemt din bilvask med appen",
  },
  {
    id: 2,
    image: "/locations-pictures/Oil.jpg",
    description: "Tank oktan 100% Køreglæde",
  },
  {
    id: 3,
    image: "/locations-pictures/WashWorld_lokation-min.jpg",
    description: "Vask 10 gange og få premium for 1 kr.",
  },
  {
    id: 4,
    image: "/tilbud.png",
    description: "Spar 50% på alle vaske i denne uge",
    imageClassName: "h-16 object-contain p-2",
  },
];

export default function DashboardPage() {
  const userName = "Jeppe";

  return (
    <>
      <AppHeader />

     <main
  className="relative flex min-h-dvh flex-col pb-28"
  style={{
    background: `
      linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
      linear-gradient(90deg, var(--color-dashboard-gradient-start) 0%, var(--color-dashboard-gradient-end) 100%)
    `,
  }}
>

        <HeaderThing userName={userName} />

        <section className="px-8 pt-10">
          <h2 className="mb-5 text-2xl font-bold text-black">Nær dig nu</h2>

          <div className="flex items-center gap-3">
            <div className="flex h-20 flex-1 items-center justify-between bg-(--brand-green-01) px-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white ring-2 ring-white">
                  W
                </div>

                <div>
                  <p className="text-sm font-bold leading-tight text-white">
                    Gunnar Clausens Vej 2A
                  </p>
                  <p className="text-sm font-bold leading-tight text-white">
                    8260 Viby
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-black">9.6 km</p>
            </div>

            <button className="flex h-20 w-20 shrink-0 items-center justify-center bg-(--white-white) shadow-md">
              <img
                src="/Car1.png"
                alt="Find vaskehal"
                className="h-14 w-14 object-contain"
              />
            </button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 px-8 text-2xl font-bold text-black">
            Favoritter
          </h2>

          <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
            {favoriteLocations.map((location) => (
              <FavoriteCard
                key={location.id}
                image={location.image}
                title={location.title}
                distance={location.distance}
              />
            ))}
          </div>
        </section>

        <section className="mt-12 px-8">
          <h2 className="mb-3 text-2xl font-bold text-black">Til dig</h2>

          <h3 className="mb-4 text-xl font-bold text-black">
            Nyheder og tilbud
          </h3>

          <div className="carousel-scroll flex gap-4 overflow-x-auto pb-3">
            {NEWS.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
                image={newsItem.image}
                description={newsItem.description}
                imageClassName={newsItem.imageClassName}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

function FavoriteCard({ image, title, distance }) {
  return (
    <article className="relative h-32 w-36 shrink-0 overflow-hidden bg-black shadow-lg border-2 border-(--brand-green-01)">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover opacity-80"
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
            Se mere
          </button>
        </div>
      </div>
    </article>
  );
}

function NewsCard({
  image,
  description,
  imageClassName = "h-20 object-cover",
}) {
  return (
    <article className="w-46 shrink-0 overflow-hidden rounded-sm border border-white/90 bg-white shadow-md">
      <img
        src={image}
        alt={description}
        className={`w-full ${imageClassName}`}
      />

      <p className="px-2 py-2 text-sm font-bold leading-tight text-neutral-600">
        {description}
      </p>
    </article>
  );
}
