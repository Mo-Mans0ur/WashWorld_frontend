"use client";

// Providers samler alle React Context-udbydere ét sted og wrapper app-indholdet.
// Rækkefølgen er vigtig: AuthProvider skal ligge udenfor FavoritesProvider
// fordi FavoritesProvider potentielt kan udvides til at bruge brugerId fra AuthContext.
//
// Tilføj nye Context-udbydere her frem for i layout.tsx for at holde det overskueligt.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { VehiclesProvider } from "@/context/VehiclesContext";

// QueryClient caches API-svar (fx lokationer) på tværs af sider.
// staleTime på den enkelte query styrer hvor længe cachen genbruges.
const queryClient = new QueryClient();

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VehiclesProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </VehiclesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
