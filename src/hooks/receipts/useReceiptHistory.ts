// useReceiptHistory – henter brugerens fulde vaskehistorik og bygger en samlet kronologisk liste.
// Bruges på receipts/page.tsx til at vise alle tidligere vaske og abonnementer.
//
// Kalder tre API-endpoints parallelt:
//   - fetchWashLog (washLogApi.ts)       → individuelle vaske med pris, lokation, tid
//   - fetchUserSubscriptions (subscriptionsApi.ts) → abonnements-køb og status
//   - fetchUserCars (carsApi.ts)         → bruges til at slå nummerplade op på hvert kort
//
// buildReceiptList() (washLogApi.ts) kombinerer de tre svar til én sorteret liste af ReceiptItem.
// Hvert element har kind = "wash" eller kind = "subscription" – bruges til at vælge det rigtige kort.
//
// Returnerer: { items, isLoading, error }

import { useEffect, useState } from "react";
import {
  fetchWashLog,
  buildReceiptList,
  type ReceiptItem,
} from "@/lib/washLogApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";

export function useReceiptHistory(userId: string | undefined) {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      fetchWashLog(userId),
      fetchUserSubscriptions(userId),
      fetchUserCars(userId),
    ])
      .then(([washLog, subscriptions, cars]) => {
        setItems(buildReceiptList(washLog, subscriptions, cars));
      })
      .catch(() => setError("Kunne ikke hente kvitteringer"))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { items, isLoading, error };
}
