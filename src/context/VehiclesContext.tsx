"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Vehicle = {
  id: number;
  name: string;
  plate: string;
  countryCode: string;
  active: boolean;
  isEV: boolean;
};

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 1, name: "Primær", plate: "AF 22 454", countryCode: "DK", active: true, isEV: false },
  { id: 2, name: "Secondær", plate: "AF 67 802", countryCode: "DK", active: false, isEV: false },
];

type VehiclesContextType = {
  vehicles: Vehicle[];
  addVehicle: (v: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: number, v: Omit<Vehicle, "id">) => void;
  deleteVehicle: (id: number) => void;
  setActiveVehicle: (id: number) => void;
};

const VehiclesContext = createContext<VehiclesContextType | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  function addVehicle(v: Omit<Vehicle, "id">) {
    const id = Date.now();
    setVehicles((prev) => [...prev, { ...v, id }]);
  }

  function updateVehicle(id: number, v: Omit<Vehicle, "id">) {
    setVehicles((prev) => prev.map((x) => (x.id === id ? { ...v, id } : x)));
  }

  function deleteVehicle(id: number) {
    setVehicles((prev) => prev.filter((x) => x.id !== id));
  }

  function setActiveVehicle(id: number) {
    setVehicles((prev) => prev.map((x) => ({ ...x, active: x.id === id })));
  }

  return (
    <VehiclesContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle, setActiveVehicle }}>
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
