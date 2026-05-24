// src/lib/Api.ts — simple hente-funktioner der bruges af ældre dele af koden.
// Nyere kode bruger locationsApi.ts og apiClient.ts i stedet.

// Henter alle vaskelokationer fra API'et (bruges på kort- og listesiden)
export const fetchLocations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`);
  if (!res.ok) throw new Error("Kunne ikke hente lokationer");
  const data = await res.json();
  return data.locations;
};

// Henter brugerens gemte favoritlokationer
export const fetchFavoriteLocations = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/favorites`);
  if (!res.ok) throw new Error("Kunne ikke hente favoritter");
  const data = await res.json();
  return data.locations;
};