// Samlet eksport af alle custom hooks i projektet.
// Importer altid hooks herfra ("@/hooks") frem for direkte fra den enkelte fil,
// så man nemt kan se hvad der er tilgængeligt og refaktorere uden at opdatere alle imports.
//
// Hooks og hvad de bruges til:
//   useAuth            → login-session, token, bruger-objekt, login/logout
//   useFavorites       → favorit-lokationer gemt i localStorage, toggle og isFavorite
//   useNavVisibility   → skjul/vis bottomnavigationen (fx under aktiv vask)
//   useVehicles        → brugerens køretøjer, CRUD-operationer, loading/error
//   useClickOutside    → luk en dropdown/menu ved klik udenfor et element
//   useAnimatedToast   → animationsfaser (enter/exit) til toast-beskeder
//   useNearestLocation → GPS + haversine til at finde og sortere lokationer efter afstand
//   useReceiptHistory  → henter vaskelog + abonnementer + biler og bygger kvitteringsliste
//   useSubscriptions   → henter brugerens abonnementer (bruges på profil og detalje-side)
//   useLocationDetails → henter lokationsdata + udstyr for én lokation (bruges på details-siden)
//   usePlanCarousel    → styrer planvalg (Guld/Premium/Brilliant), slideretning og animKey (subscriptions + singlewash)

export { useAuth } from "./useAuth";
export { useFavorites } from "./useFavorites";
export { useNavVisibility } from "./useNavVisibility";
export { useVehicles } from "./useVehicles";
export { useClickOutside } from "./useClickOutside";
export { useAnimatedToast } from "./useAnimatedToast";
export { useNearestLocation } from "./useNearestLocation";
export { useReceiptHistory } from "./useReceiptHistory";
export { useSubscriptions } from "./useSubscriptions";
export { useLocationDetails } from "./useLocationDetails";
export { usePlanCarousel } from "./usePlanCarousel";
