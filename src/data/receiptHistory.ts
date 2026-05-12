export type ReceiptHistoryItem = {
  id: number;
  title: string;
  status: string;
  statusClass: string;
  date: string;
  time: string;
  location: string;
  amount: string;
  plate: string;
  image: string;
  washType: string;
  station: string;
  payment: string;
  orderId: string;
  summaryLabel: string;
  summaryValue: string;
};

export type ReceiptDetailFieldKey =
  | "washType"
  | "station"
  | "payment"
  | "orderId";

export type ReceiptDetailField = {
  name: string;
  key: ReceiptDetailFieldKey;
};

export const receiptPageNames = {
  historyTitle: "Kvitteringer",
  detailsTitle: "Detaljer",
  detailButton: "Se detaljer ›",
  detailsSection: "Detaljer",
  priceOverview: "Pris oversigt",
  washLine: "Vask",
  totalLabel: "Total",
} as const;

export const receiptDetailFieldNames: ReceiptDetailField[] = [
  { name: "Vasketype", key: "washType" },
  { name: "Vaskestation", key: "station" },
  { name: "Betaling", key: "payment" },
  { name: "Ordre ID", key: "orderId" },
];

export const receiptActionNames = [
  "Download Kvittering",
  "Send til email",
  "Kontakt support",
] as const;

export function getReceiptById(id: number) {
  return receiptHistory.find((item) => item.id === id) || receiptHistory[0];
}

export const receiptHistory: ReceiptHistoryItem[] = [
  {
    id: 1,
    title: "Selvvask",
    status: "Gennemført",
    statusClass: "bg-emerald-400 text-emerald-900",
    date: "7. April 2026",
    time: "14:36",
    location: "Gunnar Clausens Vej 2A, 8260 Viby",
    amount: "156 Dkk",
    plate: "AF 22 454",
    image: "/locations-pictures/WashWorld_lokation-min.jpg",
    washType: "Selvvask",
    station: "Selvvaskehal 01",
    payment: "Kortbetaling",
    orderId: "#1042-7845",
    summaryLabel: "26 min x 6 kr.",
    summaryValue: "156 Dkk",
  },
  {
    id: 2,
    title: "Enkeltvask",
    status: "Afventer betaling",
    statusClass: "bg-neutral-300 text-neutral-600",
    date: "3. Marts 2026",
    time: "12:56",
    location: "Tornsøvej 4, 8600 Silkeborg",
    amount: "59 Dkk",
    plate: "AF 67 802",
    image: "/locations-pictures/Oil.jpg",
    washType: "Enkeltvask",
    station: "Tornsovej 4",
    payment: "Afventer betaling",
    orderId: "#2188-3901",
    summaryLabel: "Standardvask",
    summaryValue: "59 Dkk",
  },
];
