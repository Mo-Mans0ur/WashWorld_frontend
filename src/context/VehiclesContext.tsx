"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createCar,
  deleteCar,
  fetchUserCars,
  updateCar,
} from "@/lib/carsApi";
import { fetchSubscriptions } from "@/lib/subscriptionsApi";
import type { Car, Subscription } from "@/types/api";

const CAR_META_KEY = "washworld-car-meta";

export type VehicleType = "car" | "motorcycle" | "truck" | "bus";

type CarMeta = {
  name?: string;
  countryCode?: string;
  isEV?: boolean;
  vehicleType?: VehicleType;
};

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  countryCode: string;
  active: boolean;
  isEV: boolean;
  vehicleType: VehicleType;
};

type VehiclesContextType = {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, "id" | "active">) => Promise<void>;
  updateVehicle: (id: string, v: Omit<Vehicle, "id" | "active">) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
};

const VehiclesContext = createContext<VehiclesContextType | null>(null);

function loadMeta(): Record<string, CarMeta> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CAR_META_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CarMeta>) : {};
  } catch {
    return {};
  }
}

function saveMeta(meta: Record<string, CarMeta>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAR_META_KEY, JSON.stringify(meta));
}

function mapCarsToVehicles(
  cars: Car[],
  meta: Record<string, CarMeta>,
  subscriptions: Subscription[],
): Vehicle[] {
  return cars.map((car, index) => {
    const m = meta[car.car_id] ?? {};
    const active = subscriptions.some(
      (s) => s.car_id === car.car_id && s.subscriptions_status === "aktiv",
    );
    return {
      id: car.car_id,
      name: m.name ?? (index === 0 ? "Primær" : `Bil ${index + 1}`),
      plate: car.car_license_plate,
      countryCode: m.countryCode ?? "DK",
      active,
      isEV: m.isEV ?? false,
      vehicleType: m.vehicleType ?? "car",
    };
  });
}

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshVehicles = useCallback(async () => {
    if (!user) {
      setVehicles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [cars, subscriptions] = await Promise.all([
        fetchUserCars(user.user_id),
        fetchSubscriptions().catch(() => [] as Subscription[]),
      ]);
      setVehicles(mapCarsToVehicles(cars, loadMeta(), subscriptions));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunne ikke hente køretøjer");
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refreshVehicles();
  }, [authLoading, refreshVehicles]);

  async function addVehicle(v: Omit<Vehicle, "id" | "active">) {
    if (!user) throw new Error("Ikke logget ind");

    const { car } = await createCar(user.user_id, {
      car_license_plate: v.plate,
    });

    const meta = loadMeta();
    meta[car.car_id] = {
      name: v.name,
      countryCode: v.countryCode,
      isEV: v.isEV,
      vehicleType: v.vehicleType,
    };
    saveMeta(meta);
    await refreshVehicles();
  }

  async function updateVehicle(id: string, v: Omit<Vehicle, "id" | "active">) {
    if (!user) throw new Error("Ikke logget ind");

    await updateCar(user.user_id, id, { car_license_plate: v.plate });

    const meta = loadMeta();
    meta[id] = {
      name: v.name,
      countryCode: v.countryCode,
      isEV: v.isEV,
      vehicleType: v.vehicleType,
    };
    saveMeta(meta);
    await refreshVehicles();
  }

  async function deleteVehicle(id: string) {
    if (!user) throw new Error("Ikke logget ind");

    await deleteCar(user.user_id, id);

    const meta = loadMeta();
    delete meta[id];
    saveMeta(meta);

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

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
