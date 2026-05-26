// dashboardData – statiske data til dashboard-siden: tekster, eksempel-favoritter og nyheder/tilbud-kort.
// dashboardFavoriteLocations bruges kun som fallback hvis API'et ikke returnerer favoritter.

export type DashboardLocation = {
  id: number;
  image: string;
  title: string;
  address: {
    street: string;
    city: string;
  };
  coords: {
    lat: number;
    lng: number;
  };
};

export type DashboardNewsItem = {
  id: number;
  image: string;
  description: string;
  imageClassName?: string;
};

export const dashboardPageNames = {
  userName: "Jeppe",
  nearbyTitle: "Nær dig nu",
  favoritesTitle: "Favoritter",
  forYouTitle: "Til dig",
  newsTitle: "Nyheder og tilbud",
  currentLocationButtonAlt: "Find vaskehal",
  favoriteCardButton: "Se mere",
  notificationToastTitleBoth: "Tilføj bil og betalingskort",
  notificationToastTitleVehicle: "Tilføj biloplysninger",
  notificationToastTitleCard: "Tilføj betalingskort",
  notificationToastMessageBoth:
    "Udfyld dine biloplysninger og dit betalingskort i din profil, så du er klar til næste vask.",
  notificationToastMessageVehicle:
    "Gå til Mine køretøjer og tilføj din bil, så du er klar til næste vask.",
  notificationToastMessageCard:
    "Gå til din profil og tilføj et betalingskort, så du er klar til næste vask.",
  notificationToastButton: "Gå til profil",
} as const;

export const dashboardFavoriteLocations: DashboardLocation[] = [
  {
    id: 1,
    image: "/locations-pictures/herlev.jpg",
    title: "Herlev",
    address: {
      street: "Dynamovej 5",
      city: "2730 Herlev",
    },
    coords: { lat: 55.7276, lng: 12.4394 },
  },
  {
    id: 2,
    image: "/locations-pictures/ballerup.jpg",
    title: "Ballerup",
    address: {
      street: "Telegrafvej 5",
      city: "2750 Ballerup",
    },
    coords: { lat: 55.7289, lng: 12.3613 },
  },
  {
    id: 3,
    image: "/locations-pictures/brøndby-strand.jpg",
    title: "Brøndby Strand",
    address: {
      street: "Brøndby Strand Torv 1",
      city: "2660 Brøndby Strand",
    },
    coords: { lat: 55.6289, lng: 12.3939 },
  },
];

export const dashboardNewsItems: DashboardNewsItem[] = [
  {
    id: 1,
    image: "/logos/WashWorld-black-greenbg.png",
    description: "Start nemt din bilvask med appen",
  },
  {
    id: 2,
    image: "/locations-pictures/Oil.jpg",
    description: "Tank oktan 100% Køreglæde",
  },
  {
    id: 3,
    image: "/locations-pictures/WashWorld_lokation-min.jpg",
    description: "Vask 10 gange og få premium for 1 kr.",
  },
  {
    id: 4,
    image: "/tilbud.png",
    description: "Spar 50% på alle vaske i denne uge",
    imageClassName: "h-16 object-contain p-2",
  },
];
