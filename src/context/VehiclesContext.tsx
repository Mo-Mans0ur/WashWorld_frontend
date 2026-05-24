// VehiclesContext giver alle sider og komponenter adgang til brugerens køretøjer.
// Den henter biler og abonnementer fra API'et og kombinerer dem til ét samlet
// Vehicle-objekt — fx om en bil har et aktivt abonnement.
//
// Brug useVehicles() hook for at tilgå listen af køretøjer og funktioner
// til at tilføje, redigere og slette dem.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks";
import {
  createCar,
  deleteCar,
  fetchUserCars,
  updateCar,
} from "@/lib/carsApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import type { Car, Subscription } from "@/types/api";

// De køretøjstyper som appen understøtter
export type VehicleType = "car" | "motorcycle" | "truck" | "bus";

const VEHICLE_TYPES: VehicleType[] = ["car", "motorcycle", "truck", "bus"];

// Sikrer at en ukendt string fra API'et altid bliver til en gyldig VehicleType
function normalizeVehicleType(value: string | undefined): VehicleType {
  if (value && VEHICLE_TYPES.includes(value as VehicleType)) {
    return value as VehicleType;
  }
  return "car";
}

// Det interne køretøjsobjekt som appen bruger — en sammensmeltning af bil + abonnement
export type Vehicle = {
  id: string;
  name: string;           // Brugerens navn til bilen (eller "Primær" / "Bil 2" som standard)
  plate: string;          // Nummerplade
  countryCode: string;    // Landekode, fx "DK"
  active: boolean;        // true hvis bilen har et aktivt abonnement
  subscriptionName: string | null; // Navn på det aktive abonnement, eller null
  isEV: boolean;          // true hvis bilen er en elbil
  vehicleType: VehicleType;
};

// Den type som VehiclesContext stiller til rådighed for resten af appen
type VehiclesContextType = {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, "id" | "active" | "subscriptionName">) => Promise<void>;
  updateVehicle: (
    id: string,
    v: Omit<Vehicle, "id" | "active" | "subscriptionName">,
  ) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
};

export const VehiclesContext = createContext<VehiclesContextType | null>(null);

// Oversætter et Vehicle-objekt til det format som backend-API'et forventer
function toCarPayload(v: Omit<Vehicle, "id" | "active" | "subscriptionName">) {
  return {
    car_license_plate: v.plate,
    car_name: v.name.trim() || undefined,
    car_is_ev: v.isEV,
    car_country_code: v.countryCode,
    car_vehicle_type: v.vehicleType,
  };
}

// Kombinerer en liste af biler og abonnementer til Vehicle-objekter.
// Finder det aktive abonnement til hver bil (status = "aktiv") og sætter
// et læsevenligt navn hvis brugeren ikke selv har navngivet bilen.
function mapCarsToVehicles(
  cars: Car[],
  subscriptions: Subscription[],
): Vehicle[] {
  return cars.map((car, index) => {
    const activeSubscription = subscriptions.find(
      (s) => s.car_id === car.car_id && s.subscriptions_status === "aktiv",
    );
    const displayName =
      car.car_name?.trim() ||
      (index === 0 ? "Primær" : `Bil ${index + 1}`);

    return {
      id: car.car_id,
      name: displayName,
      plate: car.car_license_plate,
      countryCode: car.car_country_code || "DK",
      active: Boolean(activeSubscription),
      subscriptionName: activeSubscription?.subscriptions_name ?? null,
      isEV: Boolean(car.car_is_ev),
      vehicleType: normalizeVehicleType(car.car_vehicle_type),
    };
  });
}

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Henter biler og abonnementer fra API'et parallelt og opdaterer listen.
  // Venter med at køre indtil AuthContext har bekræftet om brugeren er logget ind.
  const refreshVehicles = useCallback(async () => {
    if (!user) {
      setVehicles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Henter biler og abonnementer på samme tid for at spare tid
      const [cars, subscriptions] = await Promise.all([
        fetchUserCars(user.user_id),
        fetchUserSubscriptions(user.user_id).catch(() => [] as Subscription[]),
      ]);
      setVehicles(mapCarsToVehicles(cars, subscriptions));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunne ikke hente køretøjer");
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Kør refreshVehicles automatisk når login-status er klar
  useEffect(() => {
    if (authLoading) return;
    refreshVehicles();
  }, [authLoading, refreshVehicles]);

  // Opretter en ny bil via API'et og opdaterer listen bagefter
  async function addVehicle(v: Omit<Vehicle, "id" | "active" | "subscriptionName">) {
    if (!user) throw new Error("Ikke logget ind");

    await createCar(user.user_id, toCarPayload(v));
    await refreshVehicles();
  }

  // Redigerer en eksisterende bil og opdaterer listen bagefter
  async function updateVehicle(
    id: string,
    v: Omit<Vehicle, "id" | "active" | "subscriptionName">,
  ) {
    if (!user) throw new Error("Ikke logget ind");

    await updateCar(user.user_id, id, toCarPayload(v));
    await refreshVehicles();
  }

  // Sletter en bil og opdaterer listen bagefter
  async function deleteVehicle(id: string) {
    if (!user) throw new Error("Ikke logget ind");

    await deleteCar(user.user_id, id);
    await refreshVehicles();
  }

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        isLoading,
        error,
        refreshVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

