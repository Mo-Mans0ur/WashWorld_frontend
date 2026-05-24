// useAuth er en hjælpefunktion (hook) der giver nem adgang til login-data fra AuthContext.
// Kast en fejl hvis den bruges uden for AuthProvider, så vi opdager fejl tidligt.
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Returnerer token, user, login(), logout() og isAuthenticated.
// Bruges i alle komponenter der har brug for at vide om brugeren er logget ind.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth skal bruges inden i AuthProvider");
  return ctx;
}
