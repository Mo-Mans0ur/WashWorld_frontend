// Vaskehistorik – liste over alle brugerens tidligere vaske og abonnementer.
// Henter vaskelog, abonnementer og biler fra API'et og kombinerer dem til en kronologisk liste.
// Hvert kort kan klikkes for at se detaljerne på detaljesiden.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageInfo from "@/components/PageInfo";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { receiptPageNames } from "@/data/receiptHistory";
import {
  fetchWashLog,
  buildReceiptList,
  formatWashDate,
  formatWashTime,
  washLogIcon,
  formatPrice,
  type ReceiptItem,
} from "@/lib/washLogApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";
import { useAuth } from "@/hooks";
import { ROUTES } from "@/lib/routes";

export default function Vaskehistorik() {
  const { user } = useAuth();
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchWashLog(user.user_id),
      fetchUserSubscriptions(user.user_id),
      fetchUserCars(user.user_id),
    ])
      .then(([washLog, subscriptions, cars]) => {
        setItems(buildReceiptList(washLog, subscriptions, cars));
      })
      .catch(() => setError("Kunne ikke hente kvitteringer"))
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.historyTitle} userName={""} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-3 px-5 py-4">
          {isLoading && (
            <p className="text-center text-sm font-semibold text-neutral-500">
              Henter kvitteringer...
            </p>
          )}
          {error && (
            <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
          {!isLoading && !error && items.length === 0 && (
            <p className="text-center text-sm font-semibold text-neutral-500">
              Ingen kvitteringer endnu.
            </p>
          )}

          {items.map((item) =>
            item.kind === "wash" ? (
              <WashCard key={item.entry.wash_log_id} item={item} />
            ) : (
              <SubscriptionCard key={item.entry.subscription_id} item={item} />
            ),
          )}
        </main>
      </div>
    </div>
  );
}

function WashCard({ item }: { item: Extract<ReceiptItem, { kind: "wash" }> }) {
  const { entry } = item;
  const locationText =
    entry.location_address && entry.location_zipcode
      ? `${entry.location_address}, ${entry.location_zipcode}`
      : entry.location_name ?? "—";

  return (
    <article className="relative w-full overflow-hidden rounded-[3px] bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-3 px-3 pb-2 pt-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white">
          <Image
            src={washLogIcon(entry.product_name)}
            alt={entry.product_name ?? "Vask"}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 pr-2">
              <h3 className="text-[15px] font-bold text-neutral-950">
                {entry.product_name ?? "Enkelt vask"}
              </h3>
              <div className="mt-1.5 space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-600">
                  <MapPinIcon className="h-3 w-3 shrink-0 text-neutral-500" />
                  <span className="truncate">{locationText}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-600">
                  <CalendarDaysIcon className="h-3 w-3 shrink-0 text-neutral-500" />
                  <span>
                    {formatWashDate(entry.wash_log_start_time)} ·{" "}
                    {formatWashTime(entry.wash_log_start_time)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
              <span className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-400 text-emerald-900">
                Gennemført
              </span>
              <p className="text-[18px] font-bold text-neutral-950">
                {formatPrice(entry.product_price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      <div className="flex items-end justify-between gap-3 px-3 pb-3 pt-3 pr-36">
        <LicensePlate plate={entry.car_license_plate} />
      </div>

      <Link
        href={`${ROUTES.washHistoryDetails}?kind=wash&id=${entry.wash_log_id}`}
        className="absolute bottom-0 right-0 inline-flex h-10 items-center bg-(--brand-green-01) px-4 text-sm font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
      >
        {receiptPageNames.detailButton}
      </Link>
    </article>
  );
}

function SubscriptionCard({ item }: { item: Extract<ReceiptItem, { kind: "subscription" }> }) {
  const { entry } = item;
  const isActive = entry.subscriptions_status === "aktiv";

  return (
    <article className="relative w-full overflow-hidden rounded-[3px] bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-3 px-3 pb-2 pt-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white">
          <Image
            src="/icons/EnkeltVaskIcon.png"
            alt="Abonnement"
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 pr-2">
              <h3 className="text-[15px] font-bold text-neutral-950">
                {entry.subscriptions_name}
              </h3>
              <div className="mt-1.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-600">
                  <CalendarDaysIcon className="h-3 w-3 shrink-0 text-neutral-500" />
                  <span>
                    {formatWashDate(entry.subscriptions_start_date)} ·{" "}
                    {formatWashTime(entry.subscriptions_start_date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-emerald-400 text-emerald-900"
                    : "bg-neutral-300 text-neutral-600"
                }`}
              >
                {isActive ? "Aktiv" : entry.subscriptions_status}
              </span>
              <p className="text-[18px] font-bold text-neutral-950">
                {formatPrice(entry.subscriptions_price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      <div className="flex items-end justify-between gap-3 px-3 pb-3 pt-3 pr-36">
        <LicensePlate plate={entry.car_license_plate} />
      </div>

      <Link
        href={`${ROUTES.washHistoryDetails}?kind=subscription&id=${entry.subscription_id}`}
        className="absolute bottom-0 right-0 inline-flex h-10 items-center bg-(--brand-green-01) px-4 text-sm font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
      >
        {receiptPageNames.detailButton}
      </Link>
    </article>
  );
}

function LicensePlate({ plate }: { plate: string }) {
  return (
    <div className="flex h-10 overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
      <span className="flex w-6 items-center justify-center bg-[#327fc2]" />
      <span className="flex items-center px-3 text-[15px] font-bold tracking-[0.08em]">
        {plate}
      </span>
    </div>
  );
}
