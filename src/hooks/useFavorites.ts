// useFavorites er en hjælpefunktion (hook) der giver nem adgang til favoritlisten fra FavoritesContext.
import { useContext } from "react";
import { FavoritesContext } from "@/context/FavoritesContext";

// Returnerer favorites[], isFavorite() og toggleFavorite().
// Bruges i lokationslisten og kortet til at vise og skifte favoritstjerner.
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites skal bruges inden i FavoritesProvider");
  return ctx;
}
