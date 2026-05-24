// receiptHistory – kvitteringsdata og hjælpefunktioner til vaskehistorik-siden.
// Den seneste enkelt vask gemmes i localStorage og sættes ind ved getReceiptHistoryItems().
// saveLatestSingleWashReceipt() kaldes efter en gennemført betaling for at persistere kvitteringen.

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

export type LatestSingleWashReceiptInput = {
  planName: string;
  price: string;
  plate: string;
  payment: string;
  location?: string;
  station?: string;
};

export const LATEST_SINGLE_WASH_RECEIPT_KEY =
  "washworld.latestSingleWashReceipt";

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

// Konverterer prisformat fra "59kr." til "59 Dkk" til brug i kvitteringer.
function formatReceiptAmount(price: string) {
  return price.replace("kr.", " Dkk");
}

// Bygger et komplet kvitterings-objekt ud fra den seneste enkelt-vaske-session og aktuel dato/tid.
function buildLatestSingleWashReceipt(
  latestReceipt: LatestSingleWashReceiptInput,
): ReceiptHistoryItem {
  const now = new Date();
  const date = new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const time = new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  const amount = formatReceiptAmount(latestReceipt.price);

  return {
    id: 2,
    title: "Enkeltvask",
    status: "Gennemført",
    statusClass: "bg-emerald-400 text-emerald-900",
    date,
    time,
    location: latestReceipt.location ?? "Gunnar Clausens Vej 2A, 8260 Viby",
    amount,
    plate: latestReceipt.plate || "DB 43 234",
    image: "/icons/EnkeltVaskIcon.png",
    washType: latestReceipt.planName,
    station: latestReceipt.station ?? "Vaskehal 01",
    payment: latestReceipt.payment,
    orderId: "#2188-3901",
    summaryLabel: latestReceipt.planName,
    summaryValue: amount,
  };
}

// Gemmer den seneste enkelt-vaske-kvittering i localStorage så den kan vises i vaskehistorikken.
export function saveLatestSingleWashReceipt(
  latestReceipt: LatestSingleWashReceiptInput,
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    LATEST_SINGLE_WASH_RECEIPT_KEY,
    JSON.stringify(latestReceipt),
  );
}

// Returnerer alle kvitteringer inkl. den seneste enkelt vask fra localStorage (hvis den findes).
export function getReceiptHistoryItems() {
  if (typeof window === "undefined") {
    return receiptHistory;
  }

  const latestReceipt = window.localStorage.getItem(
    LATEST_SINGLE_WASH_RECEIPT_KEY,
  );

  if (!latestReceipt) {
    return receiptHistory;
  }

  try {
    const parsedReceipt = JSON.parse(
      latestReceipt,
    ) as LatestSingleWashReceiptInput;

    return receiptHistory.map((item) =>
      item.id === 2 ? buildLatestSingleWashReceipt(parsedReceipt) : item,
    );
  } catch {
    return receiptHistory;
  }
}

// Finder én kvittering ud fra dens id — bruges til detaljeside for en enkelt vask.
export function getReceiptById(id: number) {
  return (
    getReceiptHistoryItems().find((item) => item.id === id) || receiptHistory[0]
  );
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
    image: "/icons/VaskSelvIcon.png",
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
    image: "/icons/EnkeltvaskIcon.png",
    washType: "Enkeltvask",
    station: "Tornsovej 4",
    payment: "Afventer betaling",
    orderId: "#2188-3901",
    summaryLabel: "Standardvask",
    summaryValue: "59 Dkk",
  },
];
