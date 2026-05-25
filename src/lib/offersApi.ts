// offersApi – henter og filtrerer tilbud fra API'et (/api/offers).
// fetchOffers() bruges af dashboard/page.tsx til at vise aktuelle tilbud i "Til dig"-sektionen.
// Tilbud er kun aktive indenfor deres start- og slutdato (isOfferActive).
// getOfferImageSrc() bruges i NewsCard (dashboard/page.tsx) til at konvertere rå base64-strenge
// fra databasen til et kilde-format der kan bruges direkte i <img> og Next.js Image-komponenten.
import { apiRequest } from "@/lib/apiClient";
import type { Offer } from "@/types/api";

/** Returnerer true hvis tilbuddet er aktivt på reference-datoen (kalenderdag). */
export function isOfferActive(
  offer: Offer,
  referenceDate: Date = new Date(),
): boolean {
  const start = new Date(offer.offer_start_date);
  const end = new Date(offer.offer_end_date);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  const dayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const dayEnd = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    23,
    59,
    59,
    999,
  );

  return start.getTime() <= dayEnd.getTime() && end.getTime() >= dayStart.getTime();
}

/** Henter alle tilbud fra API'et og returnerer kun dem der er aktive i dag. */
export async function fetchOffers(): Promise<Offer[]> {
  const data = await apiRequest<{ offers: Offer[] }>("/api/offers");
  const today = new Date();
  return data.offers.filter((offer) => isOfferActive(offer, today));
}

const DEFAULT_OFFER_IMAGE = "/tilbud.png";

/** Gør base64 fra databasen klar til <img> / Next Image. */
export function getOfferImageSrc(
  base64: string | null | undefined,
  fallback = DEFAULT_OFFER_IMAGE,
): string {
  const value = base64?.trim();
  if (!value) return fallback;
  if (value.startsWith("data:")) return value;
  return `data:image/jpeg;base64,${value}`;
}
