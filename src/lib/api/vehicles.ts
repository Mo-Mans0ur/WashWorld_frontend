import { apiRequest } from "@/lib/apiClient";
import type { Car } from "@/types/api";

export async function getCars(userId: string): Promise<Car[]> {
  const data = await apiRequest<{ cars: Car[] }>(`/api/users/${userId}/cars`);
  return data.cars;
}

export async function createCar(
  userId: string,
  car: { car_license_plate: string },
): Promise<Car> {
  return apiRequest<Car>(`/api/users/${userId}/cars`, {
    method: "POST",
    body: car,
  });
}

export async function updateCar(
  carId: string,
  car: { car_license_plate?: string },
): Promise<Car> {
  return apiRequest<Car>(`/api/cars/${carId}`, {
    method: "PUT",
    body: car,
  });
}

export async function deleteCar(carId: string): Promise<void> {
  return apiRequest<void>(`/api/cars/${carId}`, {
    method: "DELETE",
  });
}
