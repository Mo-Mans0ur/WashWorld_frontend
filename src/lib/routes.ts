export const ROUTES = {
  // Utility
  underConstruction: "/under-construction",

  // Auth
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",
  resetPasswordConfirm: (key: string) => `/reset-password/confirm?key=${encodeURIComponent(key)}`,
  terms: "/terms",

  // Main
  dashboard: "/dashboard",
  profile: "/profile",
  profileUpdated: "/profile?updated=1",
  profileUpdatedPreferences: "/profile?updated=preferences",
  updateProfile: "/profile/updateprofile",
  notifications: "/notifikationer",
  customerService: "/kundeservice",

  // Locations
  map: "/locations/map",
  locationList: "/locations/list",
  details: (id: string) => `/details?id=${encodeURIComponent(id)}`,

  // Single wash flow
  singlewash: "/singlewash",
  paymentSettings: "/betaling",
  savePaymentCard: "/betaling?saveCard=true",
  payment: (plan: string, plate?: string, carId?: string, locationId?: string, equipmentId?: string) =>
    `/betaling?plan=${plan}${plate ? `&plate=${encodeURIComponent(plate)}` : ""}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${locationId ? `&location=${encodeURIComponent(locationId)}` : ""}${equipmentId ? `&equipment=${encodeURIComponent(equipmentId)}` : ""}`,
  licensePlate: (plan: string, payment: string, plate?: string, carId?: string) =>
    `/singlewash/nummerplade?plan=${plan}&payment=${payment}${plate ? `&plate=${encodeURIComponent(plate)}` : ""}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}`,
  startWash: (plan: string, payment: string, plate: string, carId?: string, locationId?: string, equipmentId?: string) =>
    `/singlewash/startvask?plan=${plan}&payment=${payment}&plate=${encodeURIComponent(plate)}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${locationId ? `&location=${encodeURIComponent(locationId)}` : ""}${equipmentId ? `&equipment=${encodeURIComponent(equipmentId)}` : ""}`,
  activeWash: (plan: string, payment: string, plate: string, carId?: string, locationId?: string, equipmentId?: string) =>
    `/activewash?plan=${plan}&payment=${payment}&plate=${encodeURIComponent(plate)}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${locationId ? `&location=${encodeURIComponent(locationId)}` : ""}${equipmentId ? `&equipment=${encodeURIComponent(equipmentId)}` : ""}`,
  activeWashSubscription: (location: string, equipment: string, carId?: string) =>
    `/activewash?subscription=true&location=${location}&equipment=${equipment}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}`,

  // Self wash
  selfWash: (location: string, equipment: string) =>
    `/selfwash?location=${location}&equipment=${equipment}`,

  // Subscription flow
  subscription: "/abonnement",
  subscriptionForCar: (carId: string) => `/abonnement?carId=${encodeURIComponent(carId)}`,
  subscriptionPayment: (plan: string, carId?: string, allLocations?: boolean) =>
    `/abonnement/betaling?plan=${plan}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${allLocations ? "&allLocations=true" : ""}`,
  subscriptionConfirmation: (plan: string, carId?: string, allLocations?: boolean) =>
    `/abonnement/handlesubscription?plan=${plan}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${allLocations ? "&allLocations=true" : ""}`,

  // Vehicles
  cars: "/cars",
  addCar: "/cars/add",
  editCar: (id: string) => `/cars/edit/${id}`,

  // Wash history
  washHistory: "/vaskehistorik",
  washHistoryDetails: "/vaskehistorik/detaljer",
} as const;
