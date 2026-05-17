// src/lib/api.ts

const TEMP_USER_ID = "1234"; // skift til et rigtigt user_id fra jeres database

export const fetchLocations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`);
  if (!res.ok) throw new Error("Kunne ikke hente lokationer");
  const data = await res.json();
  return data.locations;
};

export const fetchFavoriteLocations = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${TEMP_USER_ID}/favorites`);
  if (!res.ok) throw new Error("Kunne ikke hente favoritter");
  const data = await res.json();
  return data.locations;
};