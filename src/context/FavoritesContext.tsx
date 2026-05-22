"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";
import { apiRequest } from "@/lib/apiClient";

type FavoritesContextType = {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const [favorites, setFavorites] = useState<string[]>([]);
  const loadedForRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = auth?.user?.user_id ?? null;

    if (!userId || !auth?.token) {
      setFavorites([]);
      loadedForRef.current = null;
      return;
    }

    if (loadedForRef.current === userId) return;
    loadedForRef.current = userId;

    apiRequest<{ favorites: string[] }>(`/api/users/${userId}/favorites`)
      .then((data) => setFavorites(data.favorites))
      .catch(() => setFavorites([]));
  }, [auth?.user?.user_id, auth?.token]);

  async function toggleFavorite(id: string) {
    const userId = auth?.user?.user_id;
    if (!userId) return;

    const isCurrentlyFav = favorites.includes(id);

    // Optimistic update
    setFavorites((prev) =>
      isCurrentlyFav ? prev.filter((f) => f !== id) : [...prev, id],
    );

    try {
      if (isCurrentlyFav) {
        await apiRequest(`/api/users/${userId}/favorites/${id}`, { method: "DELETE" });
      } else {
        await apiRequest(`/api/users/${userId}/favorites`, {
          method: "POST",
          body: { location_id: id },
        });
      }
    } catch {
      // Roll back on failure
      setFavorites((prev) =>
        isCurrentlyFav ? [...prev, id] : prev.filter((f) => f !== id),
      );
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite: (id) => favorites.includes(id),
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
