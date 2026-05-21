import { apiRequest } from "@/lib/apiClient";
import type { Car } from "@/types/api";

export async function fetchUserCars(userId: string): Promise<Car[]> {
  const data = await apiRequest<{ cars: Car[] }>(
    `/api/users/${encodeURIComponent(userId)}/cars`,
  );
  return data.cars;
}

export type CreateCarInput = {
  car_license_plate: string;
};

export async function createCar(
  userId: string,
  input: CreateCarInput,
): Promise<{ message: string; car: Car }> {
  return apiRequest(`/api/users/${encodeURIComponent(userId)}/cars`, {
    method: "POST",
    body: input,
  });
}

export type UpdateCarInput = {
  car_license_plate: string;
};

export async function updateCar(
  userId: string,
  carId: string,
  input: UpdateCarInput,
): Promise<{ message: string }> {
  return apiRequest(
    `/api/users/${encodeURIComponent(userId)}/cars/${encodeURIComponent(carId)}`,
    { method: "PUT", body: input },
  );
}

export async function deleteCar(
  userId: string,
  carId: string,
): Promise<{ message: string }> {
  return apiRequest(
    `/api/users/${encodeURIComponent(userId)}/cars/${encodeURIComponent(carId)}`,
    { method: "DELETE" },
  );
}
