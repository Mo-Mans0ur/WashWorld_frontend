export type ProfileBadge = {
  id: number;
  label: string;
  description: string;
  achieved: boolean;
  image: string;
  lockedImage: string;
};

export type ProfileMenuItem = {
  label: string;
  href: string;
  iconKey: "sparkles" | "calendar" | "credit-card" | "bell" | "question-mark";
};

export type ProfileStamp = {
  label: string;
  filled: boolean;
};

export const profileUser = {
  userName: "Jeppe olsen",
  email: "Example@email.dk",
  phoneNumber: "+45 48 58 77 58",
  memberSince: "Januar 2022",
} as const;

export const profilePageNames = {
  title: "Profil",
  memberSinceLabel: "Meldlem siden:",
  editProfile: "Rediger profil",
  clipCardTitle: "klippekort",
  clipCardProgress: "3 ud af 5 vaske",
  badgesTitle: "Badges",
  badgesSubtitle: "Dine optjente badges",
  showAll: "Se alle",
  activeBadgeHint: "Tryk på et badge for at se hvordan det optjenes",
  logout: "Log ud",
  deleteAccount: "Slet konto",
} as const;

export const profileStamps: ProfileStamp[] = [
  { label: "W", filled: true },
  { label: "W", filled: true },
  { label: "W", filled: true },
  { label: "4", filled: false },
  { label: "5", filled: false },
];

export const profileBadges: ProfileBadge[] = [
  {
    id: 1,
    label: "Første vask",
    description: "Optjenes efter din allerførste vask.",
    achieved: true,
    image: "/badges/First_Wash.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 2,
    label: "5 vaske",
    description: "Optjenes efter din femte vask.",
    achieved: false,
    image: "/badges/5vaske.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 3,
    label: "10 vaske",
    description: "Optjenes efter din tiende vask.",
    achieved: false,
    image: "/badges/10vaske.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 4,
    label: "Vaskemester",
    description: "Optjenes når du har gennemført 15 vaske.",
    achieved: false,
    image: "/badges/Vaskemester.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 5,
    label: "Opret abonnement",
    description: "Optjenes når du opretter et abonnement.",
    achieved: false,
    image: "/badges/OpretAbonnement.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 6,
    label: "Tillad notifikationer",
    description: "Optjenes når du tillader push-notifikationer.",
    achieved: true,
    image: "/badges/TilladNotifikationer.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 7,
    label: "Vasker Ofte",
    description: "Optjenes når du vasker 5 gange inden for 30 dage.",
    achieved: true,
    image: "/badges/VaskerOfte-v2.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 8,
    label: "Udforsker",
    description: "Optjenes når du besøger 3 forskellige lokationer.",
    achieved: false,
    image: "/badges/Udforsker.png",
    lockedImage: "/badges/Locked.png",
  },
];

export const profileMenuItems: ProfileMenuItem[] = [
  { label: "mine biler", href: "mine biler", iconKey: "sparkles" },
  { label: "vaskehistorik", href: "vaskehistorik", iconKey: "calendar" },
  {
    label: "betaling og kort",
    href: "betaling og kort",
    iconKey: "credit-card",
  },
  { label: "notifikationer", href: "notifikationer", iconKey: "bell" },
  { label: "kundeservice", href: "kundeservice", iconKey: "question-mark" },
];
