"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { useVehicles } from "@/context/VehiclesContext";
import { Car, MoreVertical, Plus, Pencil, Trash2, CircleCheck } from "lucide-react";

export default function BilerPage() {
  const router = useRouter();
  const { vehicles, deleteVehicle, setActiveVehicle } = useVehicles();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  function handleEdit(id: number) {
    setOpenMenuId(null);
    router.push(`/biler/rediger/${id}`);
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Dine køretøjer" />

      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            menuOpen={openMenuId === vehicle.id}
            onMenuToggle={() =>
              setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)
            }
            onEdit={() => handleEdit(vehicle.id)}
            onDelete={() => {
              deleteVehicle(vehicle.id);
              setOpenMenuId(null);
            }}
            onSetActive={() => {
              setActiveVehicle(vehicle.id);
              setOpenMenuId(null);
            }}
            onCloseMenu={() => setOpenMenuId(null)}
          />
        ))}

        <button
          type="button"
          onClick={() => router.push("/biler/tilfoej")}
          className="relative mt-2 flex items-center justify-center gap-2 bg-(--brand-green-01) py-4 text-xl font-bold text-white shadow-md active:opacity-80 [clip-path:polygon(6%_0,100%_0,100%_100%,0_100%)]"
        >
          <Plus size={22} strokeWidth={3} />
          Tilføj bil
        </button>
      </main>
    </div>
  );
}

function VehicleCard({
  vehicle,
  menuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
  onSetActive,
  onCloseMenu,
}: {
  vehicle: ReturnType<typeof useVehicles>["vehicles"][number];
  menuOpen: boolean;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetActive: () => void;
  onCloseMenu: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, onCloseMenu]);

  return (
    <article className="relative overflow-visible rounded-[3px] bg-(--white-white) shadow-md">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <Car size={24} className="text-neutral-700" />
          <span className="text-lg font-bold text-neutral-800">
            {vehicle.name}
          </span>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Muligheder"
            onClick={onMenuToggle}
            className="flex h-8 w-8 items-center justify-center text-neutral-500"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-50 w-44 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/10">
              {!vehicle.active && (
                <>
                  <button
                    type="button"
                    onClick={onSetActive}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                  >
                    <CircleCheck size={15} className="text-(--brand-green-01)" />
                    Sæt som aktiv
                  </button>
                  <div className="h-px bg-neutral-200" />
                </>
              )}
              <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <Pencil size={15} className="text-(--brand-green-01)" />
                Rediger
              </button>
              <div className="h-px bg-neutral-200" />
              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} />
                Slet
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3">
        <LicensePlate plate={vehicle.plate} countryCode={vehicle.countryCode} />
        <StatusBadge active={vehicle.active} />
      </div>
    </article>
  );
}

function LicensePlate({ plate, countryCode }: { plate: string; countryCode: string }) {
  return (
    <div className="flex overflow-hidden rounded border border-neutral-400 text-sm font-bold">
      <div className="flex items-center bg-blue-700 px-1.5 py-1 text-white text-xs font-bold">
        {countryCode}
      </div>
      <div className="bg-white px-2 py-1 text-neutral-900 tracking-wide">
        {plate}
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-sm px-3 py-1 text-sm font-bold text-white ${
        active ? "bg-(--brand-green-01)" : "bg-neutral-600"
      }`}
    >
      {active ? "Aktiv" : "Inaktiv"}
    </span>
  );
}
