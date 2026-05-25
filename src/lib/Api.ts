// src/lib/api.ts

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