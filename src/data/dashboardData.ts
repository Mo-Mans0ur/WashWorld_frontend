export type DashboardLocation = {
  id: number;
  image: string;
  title: string;
  distance: string;
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
  currentLocationTitle: "Gunnar Clausens Vej 2A",
  currentLocationSubtitle: "8260 Viby",
  currentLocationDistance: "9.6 km",
  currentLocationButtonAlt: "Find vaskehal",
  favoriteCardButton: "Se mere",
} as const;

export const dashboardFavoriteLocations: DashboardLocation[] = [
  {
    id: 1,
    image: "/locations-pictures/herlev.jpg",
    title: "Herlev",
    distance: "9.6 km",
  },
  {
    id: 2,
    image: "/locations-pictures/ballerup.jpg",
    title: "Ballerup",
    distance: "12.3 km",
  },
  {
    id: 3,
    image: "/locations-pictures/brøndby-strand.jpg",
    title: "Brøndby Strand",
    distance: "15.8 km",
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
