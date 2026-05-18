"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Info } from "lucide-react";
import AngleButton from "@/components/buttons/AngleButton";
import StartWashButton from "@/components/buttons/StartWashButton";
import {
  VaskselvDetails,
  StovsugerDetails,
  VaskehallDetails,
} from "@/data/detailsPageData";

interface MachineCardProps {
  id: string;
  image: string;
  title: string;
  status: string;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

const statusClass: Record<string, string> = {
  Ledig: "bg-(--brand-green-01)",
  Optaget: "bg-amber-500",
};

export default function DetailsPage() {
  const [liked, setLiked] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <section className="relative h-12">
        <div className="relative inline-flex h-full min-w-45 items-center gap-3 bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
          <p className="whitespace-nowrap text-2xl font-bold text-white">Herlev</p>
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            aria-label={liked ? "Fjern fra favoritter" : "Tilføj til favoritter"}
          >
            <Star size={22} className={liked ? "fill-yellow-400 stroke-yellow-400" : "stroke-white/70"} />
          </button>
        </div>
      </section>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-6 px-6 py-5">

          {/* Location info — sits directly on the gradient background */}
          <section className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-neutral-900">Dynamovej 4, 2860 Søborg</p>
              <p className="text-sm text-neutral-600">Miljøvenlig bilvask</p>
              <p className="text-sm text-neutral-600">ID: 1040</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-(--brand-green-01) text-sm font-bold text-neutral-800">
              7-22
            </div>
          </section>

          {/* Live Status */}
          <section>
            <h2 className="mb-2 font-bold text-neutral-900">Live Status</h2>
            <div className="flex items-center justify-around rounded bg-white/80 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Image src="/icons/EnkeltVaskIcon.png" alt="Bilvask" width={28} height={28} className="object-contain" />
                <span className="text-sm font-bold text-neutral-700">1 / 3</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex items-center gap-2">
                <Image src="/icons/vaskselvIcon.png" alt="Vask selv" width={28} height={28} className="object-contain" />
                <span className="text-sm font-bold text-neutral-700">2 / 3</span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="flex items-center gap-2">
                <Image src="/icons/vacuum.png" alt="Støvsugere" width={28} height={28} className="object-contain" />
                <span className="text-sm font-bold text-neutral-700">0 / 5</span>
              </div>
            </div>
          </section>

          {/* Vaskehaller */}
          <section>
            <h2 className="mb-3 flex items-center gap-1.5 text-xl font-bold text-neutral-900">
              Vaskehaller <Info size={16} className="text-neutral-500" />
            </h2>
            <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
              {VaskehallDetails.map((item) => (
                <MachineCard
                  key={item.id}
                  id={`vaskehall-${item.id}`}
                  image={item.image}
                  title={item.title}
                  status={item.status}
                  selected={selectedId === `vaskehall-${item.id}`}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </section>

          {/* Vask selv */}
          <section>
            <h2 className="mb-3 flex items-center gap-1.5 text-xl font-bold text-neutral-900">
              Vask selv <Info size={16} className="text-neutral-500" />
            </h2>
            <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
              {VaskselvDetails.map((item) => (
                <MachineCard
                  key={item.id}
                  id={`vaskselv-${item.id}`}
                  image={item.image}
                  title={item.title}
                  status={item.status}
                  selected={selectedId === `vaskselv-${item.id}`}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </section>

          {/* Støvsugere */}
          <section>
            <h2 className="mb-3 flex items-center gap-1.5 text-xl font-bold text-neutral-900">
              Støvsugere <Info size={16} className="text-neutral-500" />
            </h2>
            <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
              {StovsugerDetails.map((item) => (
                <MachineCard
                  key={item.id}
                  id={`stovsuger-${item.id}`}
                  image={item.image}
                  title={item.title}
                  status={item.status}
                  selected={selectedId === `stovsuger-${item.id}`}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </section>

          {/* Start vask */}
          <StartWashButton onClick={() => {}} />
          {selectedId && (() => {
            const allItems = [
              ...VaskehallDetails.map((i) => ({ key: `vaskehall-${i.id}`, title: i.title })),
              ...VaskselvDetails.map((i) => ({ key: `vaskselv-${i.id}`, title: i.title })),
              ...StovsugerDetails.map((i) => ({ key: `stovsuger-${i.id}`, title: i.title })),
            ];
            const selected = allItems.find((i) => i.key === selectedId);
            return selected ? (
              <p className="text-center text-sm text-white">Valgt: {selected.title}</p>
            ) : null;
          })()}

        </main>
      </div>
    </div>
  );
}

function MachineCard({ id, image, title, status, selected, onSelect }: MachineCardProps) {
  return (
    <button
      onClick={() => onSelect(selected ? null : id)}
      className={`flex h-20 min-w-50 shrink-0 items-end overflow-hidden bg-white font-bold shadow-md ring-inset transition-shadow ${selected ? "ring-4 ring-(--brand-green-01)" : ""}`}
    >
      <div className="flex flex-1 self-center flex-row items-center justify-start gap-2 p-1">
        <Image
          src={image}
          alt={title}
          width={67}
          height={67}
          className="h-14 w-14 object-contain"
        />
        <span className="text-sm font-bold text-neutral-800">{title}</span>
      </div>
      <AngleButton text={status} className={statusClass[status] ?? "bg-neutral-400"} />
    </button>
  );
}
