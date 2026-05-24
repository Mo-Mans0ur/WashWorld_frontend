// useVehicles er en hjælpefunktion (hook) der giver nem adgang til køretøjslisten fra VehiclesContext.
import { useContext } from "react";
import { VehiclesContext } from "@/context/VehiclesContext";

// Returnerer vehicles[], isLoading, error, refreshVehicles(), addVehicle(), updateVehicle() og deleteVehicle().
// Bruges på bil-siden og overalt hvor man skal vælge eller vise brugerens biler.
export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
