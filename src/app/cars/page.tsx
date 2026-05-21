"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { useVehicles } from "@/context/VehiclesContext";
import { type ElementType } from "react";
import { Car, Bike, Truck, Bus, MoreVertical, Plus, Pencil, Trash2, BadgePlus } from "lucide-react";
import type { VehicleType } from "@/context/VehiclesContext";

const VEHICLE_ICONS: Record<VehicleType, ElementType> = {
  car: Car,
  motorcycle: Bike,
  truck: Truck,
  bus: Bus,
};
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/buttons";
import { capitalizeName } from "@/lib/formatName";

export default function BilerPage() {
  const router = useRouter();
  const { vehicles, isLoading, error, deleteVehicle } = useVehicles();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(id: string) {
    setOpenMenuId(null);
    router.push(ROUTES.editCar(id));
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteVehicle(id);
      setOpenMenuId(null);
    } catch {
      // Fejl vises via error-state fra context ved næste refresh
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Dine køretøjer" />

      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        {isLoading && (
          <p className="text-center text-sm font-semibold text-neutral-500">
            Henter køretøjer...
          </p>
        )}

        {error && (
          <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              menuOpen={openMenuId === vehicle.id}
              isDeleting={deletingId === vehicle.id}
              onMenuToggle={() =>
                setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)
              }
              onAddSubscription={() => {
                router.push(ROUTES.subscriptionForCar(vehicle.id));
                setOpenMenuId(null);
              }}
              onEdit={() => handleEdit(vehicle.id)}
              onDelete={() => handleDelete(vehicle.id)}
              onCloseMenu={() => setOpenMenuId(null)}
            />
          ))}

        {!isLoading && !error && vehicles.length === 0 && (
          <p className="text-center text-sm font-semibold text-neutral-500">
            Du har ingen køretøjer endnu.
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push(ROUTES.addCar)}
          className="mt-2 flex w-full items-center justify-center gap-2"
        >
          <Plus size={22} strokeWidth={3} />
          Tilføj bil
        </Button>
      </main>
    </div>
  );
}

function VehicleCard({
  vehicle,
  menuOpen,
  isDeleting,
  onMenuToggle,
  onAddSubscription,
  onEdit,
  onDelete,
  onCloseMenu,
}: {
  vehicle: ReturnType<typeof useVehicles>["vehicles"][number];
  menuOpen: boolean;
  isDeleting: boolean;
  onMenuToggle: () => void;
  onAddSubscription: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCloseMenu: () => void;
}) {
  const VehicleIcon = VEHICLE_ICONS[vehicle.vehicleType ?? "car"];
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
          <VehicleIcon size={24} className="text-neutral-700" />
          <span className="text-lg font-bold text-neutral-800">
            {vehicle.name}
          </span>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Muligheder"
            onClick={onMenuToggle}
            disabled={isDeleting}
            className="flex h-8 w-8 items-center justify-center text-neutral-500 disabled:opacity-50"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/10">
              <button
                type="button"
                onClick={onAddSubscription}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <BadgePlus size={15} className="text-(--brand-green-01)" />
                Tilføj abonnement
              </button>
              <div className="h-px bg-neutral-200" />
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
                disabled={isDeleting}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
                {isDeleting ? "Sletter..." : "Slet"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3">
        <LicensePlate plate={vehicle.plate} countryCode={vehicle.countryCode} />
        <StatusBadge subscriptionName={vehicle.subscriptionName} />
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

function StatusBadge({ subscriptionName }: { subscriptionName: string | null }) {
  const hasSubscription = Boolean(subscriptionName);
  const label = hasSubscription
    ? capitalizeName(subscriptionName!)
    : "Intet abonnement";

  return (
    <span
      className={`inline-flex h-7 w-20 shrink-0 items-center justify-center truncate rounded-sm px-2 text-center text-sm font-bold text-white ${
        hasSubscription ? "bg-(--brand-green-01)" : "bg-neutral-600"
      }`}
      title={label}
    >
      {label}
    </span>
  );
}
