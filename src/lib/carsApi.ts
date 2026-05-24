// carsApi indeholder alle API-kald til brugerens biler.
// Alle funktioner bruger apiRequest() fra apiClient, som håndterer token og fejl automatisk.

import { apiRequest } from "@/lib/apiClient";
import type { Car } from "@/types/api";

// Henter alle biler tilknyttet en bestemt bruger
export async function fetchUserCars(userId: string): Promise<Car[]> {
  const data = await apiRequest<{ cars: Car[] }>(
    `/api/users/${encodeURIComponent(userId)}/cars`,
  );
  return data.cars;
}

// Dataform til oprettelse eller opdatering af en bil i API'et
export type CarWriteInput = {
  car_license_plate: string;   // Nummerpladen (påkrævet)
  car_name?: string;            // Brugerens kaldenavn til bilen (valgfrit)
  car_is_ev?: boolean;          // true hvis det er en elbil
  car_country_code?: string;    // Landekode, fx "DK"
  car_vehicle_type?: string;    // Type, fx "car", "motorcycle"
};

// Opretter en ny bil og returnerer den oprettede bil fra serveren
export async function createCar(
  userId: string,
  input: CarWriteInput,
): Promise<{ message: string; car: Car }> {
  return apiRequest(`/api/users/${encodeURIComponent(userId)}/cars`, {
    method: "POST",
    body: input,
  });
}

// Opdaterer en eksisterende bil med nye data
export async function updateCar(
  userId: string,
  carId: string,
  input: CarWriteInput,
): Promise<{ message: string }> {
  return apiRequest(
    `/api/users/${encodeURIComponent(userId)}/cars/${encodeURIComponent(carId)}`,
    { method: "PUT", body: input },
  );
}

// Sletter en bil permanent fra databasen
export async function deleteCar(
  userId: string,
  carId: string,
): Promise<{ message: string }> {
  return apiRequest(
    `/api/users/${encodeURIComponent(userId)}/cars/${encodeURIComponent(carId)}`,
    { method: "DELETE" },
  );
}
