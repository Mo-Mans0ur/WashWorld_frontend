"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  LifebuoyIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { receiptActionNames, receiptPageNames } from "@/data/receiptHistory";
import {
  fetchWashLog,
  formatWashDate,
  formatWashTime,
  washLogIcon,
  formatPrice,
} from "@/lib/washLogApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";
import { useAuth } from "@/hooks";
import type { WashLogEntry, Subscription } from "@/types/api";

const receiptActionIcons = {
  "Download Kvittering": <ArrowDownTrayIcon className="h-5 w-5" />,
  "Send til email": <EnvelopeIcon className="h-5 w-5" />,
  "Kontakt support": <LifebuoyIcon className="h-5 w-5" />,
};

export default function VaskehistorikDetaljer() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") ?? "wash";
  const id = searchParams.get("id") ?? "";

  const [washEntry, setWashEntry] = useState<WashLogEntry | null>(null);
  const [subEntry, setSubEntry] = useState<(Subscription & { car_license_plate: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (kind === "wash") {
      fetchWashLog(user.user_id)
        .then((entries) => setWashEntry(entries.find((e) => e.wash_log_id === id) ?? null))
        .finally(() => setIsLoading(false));
    } else {
      Promise.all([fetchUserSubscriptions(user.user_id), fetchUserCars(user.user_id)])
        .then(([subs, cars]) => {
          const plateByCarId = Object.fromEntries(cars.map((c) => [c.car_id, c.car_license_plate]));
          const sub = subs.find((s) => s.subscription_id === id) ?? null;
          if (sub) setSubEntry({ ...sub, car_license_plate: plateByCarId[sub.car_id] ?? "—" });
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, kind, id]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
        <p className="mt-8 text-center text-sm font-semibold text-neutral-500">Henter detaljer...</p>
      </div>
    );
  }

  if (kind === "wash" && washEntry) {
    return <WashDetail entry={washEntry} />;
  }
  if (kind === "subscription" && subEntry) {
    return <SubscriptionDetail entry={subEntry} />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
      <p className="mt-8 text-center text-sm font-semibold text-neutral-500">Ingen detaljer fundet.</p>
    </div>
  );
}

function ActionList() {
  return (
    <article className="rounded-[3px] bg-white px-4 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
      {receiptActionNames.map((action, index) => (
        <button
          key={action}
          type="button"
          className={`flex w-full items-center gap-3 py-3 text-left text-[13px] font-bold text-neutral-950 ${
            index < receiptActionNames.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <span className="text-(--brand-green-01)">{receiptActionIcons[action]}</span>
          <span>{action}</span>
          <span className="ml-auto text-(--brand-green-01)">
            <ChevronRightIcon className="h-5 w-5" />
          </span>
        </button>
      ))}
    </article>
  );
}

function LicensePlate({ plate }: { plate: string }) {
  return (
    <div className="mt-4 flex h-10 w-fit overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
      <span className="flex w-6 items-center justify-center bg-[#327fc2]" />
      <span className="flex items-center px-3 text-[15px] font-bold tracking-[0.08em]">{plate}</span>
    </div>
  );
}

function WashDetail({ entry }: { entry: WashLogEntry }) {
  const locationDisplay =
    entry.location_address && entry.location_zipcode
      ? `${entry.location_address}, ${entry.location_zipcode}`
      : entry.location_name ?? "—";

  const details = [
    { name: "Vasketype", value: entry.product_name ?? "—" },
    { name: "Vaskestation", value: entry.location_name ?? "—" },
    { name: "Lokation", value: locationDisplay },
    { name: "Ordre ID", value: `#${entry.wash_log_id.slice(0, 8).toUpperCase()}` },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-4 px-5 py-4">
          <article className="rounded-[3px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-neutral-400 bg-white">
                <Image src={washLogIcon(entry.product_name)} alt={entry.product_name ?? "Vask"} fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-[15px] font-bold text-neutral-950">{entry.product_name ?? "Enkelt vask"}</h1>
                  <span className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-400 text-emerald-900">Gennemført</span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <MapPinIcon className="h-3 w-3 shrink-0" /><span className="truncate">{locationDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <CalendarDaysIcon className="h-3 w-3 shrink-0" /><span>{formatWashDate(entry.wash_log_start_time)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <ClockIcon className="h-3 w-3 shrink-0" /><span>{formatWashTime(entry.wash_log_start_time)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 h-px bg-neutral-200" />
            <LicensePlate plate={entry.car_license_plate} />

            <section className="mt-5">
              <h2 className="text-[13px] font-bold text-neutral-900">{receiptPageNames.detailsSection}</h2>
              <div className="mt-2 h-px bg-neutral-200" />
              <dl className="space-y-2 pt-4 text-[13px] text-neutral-600">
                {details.map((f) => (
                  <div key={f.name} className="flex items-center justify-between gap-3">
                    <dt>{f.name}</dt><dd className="text-right text-neutral-700">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-5">
              <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
                <CurrencyDollarIcon className="h-4 w-4 text-(--brand-green-01)" />
                <h2>{receiptPageNames.priceOverview}</h2>
              </div>
              <div className="mt-2 h-px bg-neutral-200" />
              <div className="flex items-center justify-between gap-3 py-4 text-[13px] text-neutral-700">
                <p>{receiptPageNames.washLine}</p>
                <p>{entry.product_name ?? "—"}</p>
                <p>{formatPrice(entry.product_price)}</p>
              </div>
            </section>

            <div className="mt-16 h-px bg-neutral-200" />
            <div className="flex items-center justify-between pt-4">
              <p className="text-2xl font-bold text-neutral-950">{receiptPageNames.totalLabel}</p>
              <p className="text-2xl font-bold text-(--brand-green-01)">{formatPrice(entry.product_price)}</p>
            </div>
          </article>
          <ActionList />
        </main>
      </div>
    </div>
  );
}

function SubscriptionDetail({ entry }: { entry: Subscription & { car_license_plate: string } }) {
  const isActive = entry.subscriptions_status === "aktiv";

  const details = [
    { name: "Abonnement", value: entry.subscriptions_name },
    { name: "Startdato", value: formatWashDate(entry.subscriptions_start_date) },
    { name: "Slutdato", value: formatWashDate(entry.subscriptions_end_date) },
    { name: "Næste betaling", value: formatWashDate(entry.subscriptions_next_billing_date) },
    { name: "Ordre ID", value: `#${entry.subscription_id.slice(0, 8).toUpperCase()}` },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-4 px-5 py-4">
          <article className="rounded-[3px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-neutral-400 bg-white">
                <Image src="/icons/EnkeltVaskIcon.png" alt="Abonnement" fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-[15px] font-bold text-neutral-950">{entry.subscriptions_name}</h1>
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-emerald-400 text-emerald-900" : "bg-neutral-300 text-neutral-600"}`}>
                    {isActive ? "Aktiv" : entry.subscriptions_status}
                  </span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <CalendarDaysIcon className="h-3 w-3 shrink-0" /><span>{formatWashDate(entry.subscriptions_start_date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <ClockIcon className="h-3 w-3 shrink-0" /><span>{formatWashTime(entry.subscriptions_start_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 h-px bg-neutral-200" />
            <LicensePlate plate={entry.car_license_plate} />

            <section className="mt-5">
              <h2 className="text-[13px] font-bold text-neutral-900">{receiptPageNames.detailsSection}</h2>
              <div className="mt-2 h-px bg-neutral-200" />
              <dl className="space-y-2 pt-4 text-[13px] text-neutral-600">
                {details.map((f) => (
                  <div key={f.name} className="flex items-center justify-between gap-3">
                    <dt>{f.name}</dt><dd className="text-right text-neutral-700">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-5">
              <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
                <CurrencyDollarIcon className="h-4 w-4 text-(--brand-green-01)" />
                <h2>{receiptPageNames.priceOverview}</h2>
              </div>
              <div className="mt-2 h-px bg-neutral-200" />
              <div className="flex items-center justify-between gap-3 py-4 text-[13px] text-neutral-700">
                <p>Abonnement</p>
                <p>{entry.subscriptions_name}</p>
                <p>{formatPrice(entry.subscriptions_price)}</p>
              </div>
            </section>

            <div className="mt-16 h-px bg-neutral-200" />
            <div className="flex items-center justify-between pt-4">
              <p className="text-2xl font-bold text-neutral-950">{receiptPageNames.totalLabel}</p>
              <p className="text-2xl font-bold text-(--brand-green-01)">{formatPrice(entry.subscriptions_price)}</p>
            </div>
          </article>
          <ActionList />
        </main>
      </div>
    </div>
  );
}
