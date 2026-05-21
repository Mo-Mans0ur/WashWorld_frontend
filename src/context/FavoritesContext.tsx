"use client";

// FavoritesContext giver hele appen adgang til brugerens favoritvaskehaller.
// Favoritter gemmes i localStorage så de overlever en side-genindlæsning uden login.
// Brug useFavorites() hook i en komponent for at læse eller ændre favoritter.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Nøgle brugt til at gemme favoritter i localStorage
const STORAGE_KEY = "washworld-favorites";

type FavoritesContextType = {
  favorites: string[];                  // liste af location_id strenge
  isFavorite: (id: string) => boolean; // tjekker om en lokation er i favoritter
  toggleFavorite: (id: string) => void; // tilføjer eller fjerner en lokation
};

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Indlæs gemte favoritter fra localStorage når appen starter.
  // Kører kun én gang (tom afhængighedsarray), og fejler lydstille hvis
  // localStorage indeholder ugyldig JSON.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  // Tilføjer id'et hvis det ikke allerede er der, ellers fjernes det.
  // Opdaterer både React-state og localStorage atomisk via setState-callback,
  // så vi altid skriver den nyeste version og ikke en forældet snapshot.
  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite: (id) => favorites.includes(id), toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

