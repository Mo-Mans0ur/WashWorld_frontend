// useSubscriptions – henter og holder styr på brugerens aktive abonnementer.
// Bruges på profiles/page.tsx (viser abonnementsliste med mulighed for opsigelse)
// og details/page.tsx (tjekker om det valgte køretøj har et abonnement der dækker lokationen).
//
// Kalder fetchUserSubscriptions() fra subscriptionsApi.ts via brugerens user_id.
// setSubscriptions returneres så siden selv kan opdatere listen optimistisk,
// fx når brugeren opsiger et abonnement (profiles/page.tsx filtrerer det ud lokalt).
//
// Returnerer: { subscriptions, setSubscriptions }

import { useEffect, useState } from "react";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import type { Subscription } from "@/types/api";

export function useSubscriptions(userId: string | undefined) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchUserSubscriptions(userId)
      .then(setSubscriptions)
      .catch(() => {});
  }, [userId]);

  return { subscriptions, setSubscriptions };
}
