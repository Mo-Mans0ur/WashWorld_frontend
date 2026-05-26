// BilerPage (cars/page.tsx) – oversigt over brugerens registrerede køretøjer.
// Viser hvert køretøj som et kort med nummerplade, abonnementsstatus og en dropdown-menu.
//
// Hooks der bruges:
//   useVehicles()      → henter køretøjsliste, loading/error-state og deleteVehicle() fra VehiclesContext
//   useClickOutside()  → lukker dropdown-menuen når der klikkes udenfor (ét menuRef per VehicleCard)
//
// Komponenter der bruges:
//   PageInfo       → sidetitel øverst
//   LicensePlate   → viser nummerplade med landekode-stribe (components/LicensePlate.tsx)
//   VehicleCard    → enkelt køretøjskort med menu (defineret nedenfor)
//   StatusBadge    → badge der viser abonnementsnavn eller "Intet abonnement" (defineret nedenfor)
//
// Dropdown-menuen giver tre valg: Tilføj abonnement → /subscriptions, Rediger → /cars/edit/[id], Slet.
// Sletning kalder deleteVehicle() fra VehiclesContext som opdaterer listen optimistisk.

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import { LicensePlate } from "@/components/LicensePlate";
import { useVehicles, useClickOutside } from "@/hooks";
import { type ElementType } from "react";
import { Car, Motorbike, Truck, Bus, MoreVertical, Plus, Pencil, Trash2, BadgePlus } from "lucide-react";
import type { VehicleType } from "@/context/VehiclesContext";
import { ROUTES } from "@/lib/routes";
import { capitalizeName } from "@/lib/formatName";

const VEHICLE_ICONS: Record<VehicleType, ElementType> = {
  car: Car,
  motorcycle: Motorbike,
  truck: Truck,
  bus: Bus,
};

export default function BilerPage() {
  const router = useRouter();
  const { vehicles, isLoading, error, deleteVehicle } = useVehicles();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteVehicle(id);
      setOpenMenuId(null);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Kunne ikke slette køretøjet");
      setOpenMenuId(null);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Dine køretøjer" />

      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        {isLoading && (
          <p className="text-center text-sm font-semibold text-neutral-500">Henter køretøjer...</p>
        )}
        {error && (
          <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
        )}
        {deleteError && (
          <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{deleteError}</p>
        )}

        {!isLoading && !error && vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            menuOpen={openMenuId === vehicle.id}
            isDeleting={deletingId === vehicle.id}
            onMenuToggle={() => setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)}
            onAddSubscription={() => {
              router.push(ROUTES.subscriptionForCar(vehicle.id));
              setOpenMenuId(null);
            }}
            onEdit={() => {
              setOpenMenuId(null);
              router.push(ROUTES.editCar(vehicle.id));
            }}
            onDelete={() => handleDelete(vehicle.id)}
            onCloseMenu={() => setOpenMenuId(null)}
          />
        ))}

        {!isLoading && !error && vehicles.length === 0 && (
          <p className="text-center text-sm font-semibold text-neutral-500">
            Du har ingen køretøjer endnu.
          </p>
        )}

        <Link
          href={ROUTES.addCar}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-[3px] bg-(--brand-green-01) py-3 text-xl font-bold text-white"
        >
          <Plus size={22} strokeWidth={3} />
          Tilføj bil
        </Link>
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
  useClickOutside(menuRef, onCloseMenu, menuOpen);

  return (
    <article className="relative overflow-visible rounded-[3px] bg-(--white-white) shadow-md">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <VehicleIcon size={24} className="text-neutral-700" />
          <span className="text-lg font-bold text-neutral-800">{vehicle.name}</span>
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

function StatusBadge({ subscriptionName }: { subscriptionName: string | null }) {
  const hasSubscription = Boolean(subscriptionName);
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-2 text-center text-sm font-bold text-white ${
        hasSubscription ? "bg-(--brand-green-01)" : "bg-neutral-600"
      }`}
    >
      {hasSubscription ? capitalizeName(subscriptionName!) : "Intet abonnement"}
    </span>
  );
}
