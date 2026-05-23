import { apiRequest } from "@/lib/apiClient";
import type { Offer } from "@/types/api";

export async function fetchOffers(): Promise<Offer[]> {
  const data = await apiRequest<{ offers: Offer[] }>("/api/offers");
  return data.offers;
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
