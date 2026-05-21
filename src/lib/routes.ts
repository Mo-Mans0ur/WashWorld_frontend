export const ROUTES = {
  // Utility
  underConstruction: "/under-construction",

  // Auth
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",
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
  payment: (plan: string) => `/betaling?plan=${plan}`,
  licensePlate: (plan: string, payment: string) =>
    `/singlewash/nummerplade?plan=${plan}&payment=${payment}`,
  startWash: (plan: string, payment: string, plate: string) =>
    `/singlewash/startvask?plan=${plan}&payment=${payment}&plate=${encodeURIComponent(plate)}`,
  activeWash: (plan: string, payment: string, plate: string) =>
    `/activewash?plan=${plan}&payment=${payment}&plate=${encodeURIComponent(plate)}`,
  activeWashSubscription: (location: string, equipment: string) =>
    `/activewash?subscription=true&location=${location}&equipment=${equipment}`,

  // Self wash
  selfWash: (location: string, equipment: string) =>
    `/selfwash?location=${location}&equipment=${equipment}`,

  // Subscription flow
  subscription: "/abonnement",
  subscriptionPayment: (plan: string) => `/abonnement/betaling?plan=${plan}`,
  subscriptionConfirmation: (plan: string) =>
    `/abonnement/handlesubscription?plan=${plan}`,

  // Vehicles
  cars: "/cars",
  addCar: "/cars/add",
  editCar: (id: string) => `/cars/edit/${id}`,

  // Wash history
  washHistory: "/vaskehistorik",
  washHistoryDetails: "/vaskehistorik/detaljer",
} as const;
