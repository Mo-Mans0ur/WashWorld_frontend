// Api.ts – simpel fetch-wrapper der stadig bruges af dashboard/page.tsx (fetchLocations).
// Nyere kode bruger locationsApi.ts (Map, LocationsList) og apiClient.ts i stedet.
// Undgå at tilføje nye funktioner her – brug apiClient.ts til alt nyt.

export const fetchLocations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`);
  if (!res.ok) throw new Error("Kunne ikke hente lokationer");
  const data = await res.json();
  return data.locations;
};

export const fetchFavoriteLocations = async (userId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userId}/favorites`);
  if (!res.ok) throw new Error("Kunne ikke hente favoritter");
  const data = await res.json();
  return data.locations;
};