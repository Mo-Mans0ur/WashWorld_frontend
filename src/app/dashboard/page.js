"use client";

import Image from "next/image";
import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <main
        className="relative flex min-h-dvh flex-col pb-28"
        style={{
          background: "linear-gradient(90deg, #75cfa0 0%, #8f9994 100%)",
        }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ marginTop: 50, marginLeft: 30 }}
        >
          Nær dig nu
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center justify-between bg-[#39c765] px-4 py-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xl font-bold text-white ring-2 ring-white">
                W
              </div>
            </div>
          </div>
        </div>

        <h2
          className="text-2xl font-bold"
          style={{ marginTop: 50, marginLeft: 30 }}
        >
          Favoritter
        </h2>
        <h2
          className="text-2xl font-bold"
          style={{ marginTop: 50, marginLeft: 30 }}
        >
          Til dig
        </h2>
        <h3
          className="text-1xl font-bold"
          style={{ marginTop: 10, marginLeft: 30 }}
        >
          Nyheder og tilbud
        </h3>
      </main>
      <BottomNav />
    </>
  );
}

function FavoriteCard({ image, title, description }) {
  return (
    <article className="relative h-3 min-w-2 overflow-hidden bg-black shadow-md">
      <Image src={image} alt={title} fill className="object-cover" />


    </article>
  );
}
