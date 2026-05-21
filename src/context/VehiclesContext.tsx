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
import type { Car } from "@/types/api";

const ACTIVE_CAR_KEY = "washworld-active-car-id";
const CAR_META_KEY = "washworld-car-meta";

type CarMeta = {
  name?: string;
  countryCode?: string;
  isEV?: boolean;
};

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  countryCode: string;
  active: boolean;
  isEV: boolean;
};

type VehiclesContextType = {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, "id" | "active">) => Promise<void>;
  updateVehicle: (id: string, v: Omit<Vehicle, "id" | "active">) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  setActiveVehicle: (id: string) => void;
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

function mapCarsToVehicles(cars: Car[], meta: Record<string, CarMeta>): Vehicle[] {
  const storedActive = localStorage.getItem(ACTIVE_CAR_KEY);
  const activeId =
    storedActive && cars.some((c) => c.car_id === storedActive)
      ? storedActive
      : cars[0]?.car_id ?? null;

  if (activeId) {
    localStorage.setItem(ACTIVE_CAR_KEY, activeId);
  }

  return cars.map((car, index) => {
    const m = meta[car.car_id] ?? {};
    return {
      id: car.car_id,
      name: m.name ?? (index === 0 ? "Primær" : `Bil ${index + 1}`),
      plate: car.car_license_plate,
      countryCode: m.countryCode ?? "DK",
      active: car.car_id === activeId,
      isEV: m.isEV ?? false,
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
      const cars = await fetchUserCars(user.user_id);
      setVehicles(mapCarsToVehicles(cars, loadMeta()));
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

    if (localStorage.getItem(ACTIVE_CAR_KEY) === id) {
      localStorage.removeItem(ACTIVE_CAR_KEY);
    }

    await refreshVehicles();
  }

  function setActiveVehicle(id: string) {
    localStorage.setItem(ACTIVE_CAR_KEY, id);
    setVehicles((prev) => prev.map((x) => ({ ...x, active: x.id === id })));
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
        setActiveVehicle,
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
