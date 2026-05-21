import { useContext } from "react";
import { VehiclesContext } from "@/context/VehiclesContext";

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
