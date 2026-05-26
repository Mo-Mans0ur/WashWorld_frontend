// VaskehistorikDetaljer – detaljeside for én vask eller ét abonnement.
// URL-parametrene ?kind=wash&id=... eller ?kind=subscription&id=... bestemmer hvad der vises.

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageInfo from "@/components/shared/PageInfo";
import WashDetail from "@/components/receipts/WashDetail";
import SubscriptionDetail from "@/components/receipts/SubscriptionDetail";
import { receiptPageNames } from "@/data/receiptHistory";
import { fetchWashLog } from "@/lib/washLogApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";
import { useAuth } from "@/hooks";
import type { WashLogEntry, Subscription } from "@/types/api";

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
        <p className="mt-8 text-center text-sm font-semibold text-white">Henter detaljer...</p>
      </div>
    );
  }

  if (kind === "wash" && washEntry) return <WashDetail entry={washEntry} />;
  if (kind === "subscription" && subEntry) return <SubscriptionDetail entry={subEntry} />;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
      <p className="mt-8 text-center text-sm font-semibold text-white">Ingen detaljer fundet.</p>
    </div>
  );
}
