export type SubscriptionFeature = {
  text: string;
  level: number;
};

export type SubscriptionPlan = {
  slug: "guld" | "premium" | "brilliant";
  name: string;
  price: string;
  firstMonth: string;
  description: string;
  features: SubscriptionFeature[];
};

export type SubscriptionOption = {
  value: string;
  label: string;
};

export const subscriptionPageNames = {
  listTitle: "Abonnement",
  createTitle: "Opret",
  createTitleLineOne: "Opret",
  createTitleLineTwo: "vaskeabonnement",
  createDescription: "Hold din bil ren med et vaskeabonnement og spar penge",
  createButton: "Opret vaskeabonnement",
  footnote:
    "*Gælder kun nummerplader, der ikke før har haft et abonnement hos Wash world.",
  pickerIntro: "Vælg bil og betalingsmiddel til dit vaskeabonnement",
  vehiclePlaceholder: "Vælg køretøj",
  paymentPlaceholder: "Vælg betalingsmetode",
  selectButton: "Vælg",
  termsPrefix: "Jeg accepterer",
  termsLinkLabel: "abonnementsvilkår",
  backButton: "Tilbage",
  submitButton: "Opret",
  vehicleSheetTitle: "Vælg køretøj",
  paymentSheetTitle: "Vælg betalingsmetode",
} as const;

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    slug: "guld",
    name: "Guld",
    price: "139kr./ md.",
    firstMonth: "Første måned 99kr.",
    description: "God og effektiv",
    features: [
      { text: "Skumforvask", level: 1 },
      { text: "Tørring", level: 1 },
      { text: "Aktiv Shampoo", level: 1 },
      { text: "Højglans", level: 0 },
      { text: "Hjulvask", level: 1 },
      { text: "Undervognsvask", level: 0 },
      { text: "Højtryksvask", level: 1 },
      { text: "Skumvask", level: 0 },
      { text: "Børstevask", level: 1 },
      { text: "Affedtning", level: 0 },
      { text: "Voks", level: 1 },
      { text: "Sæsonrens", level: 0 },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    price: "169kr./ md.",
    firstMonth: "Første måned 129kr.",
    description: "Ekstra grundig",
    features: [
      { text: "Skumforvask", level: 1 },
      { text: "Tørring", level: 1 },
      { text: "Aktiv Shampoo", level: 1 },
      { text: "Højglans", level: 1 },
      { text: "Hjulvask", level: 1 },
      { text: "Undervognsvask", level: 1 },
      { text: "Højtryksvask", level: 1 },
      { text: "Skumvask", level: 0 },
      { text: "Børstevask", level: 2 },
      { text: "Affedtning", level: 0 },
      { text: "Voks", level: 1 },
      { text: "Sæsonrens", level: 0 },
    ],
  },
  {
    slug: "brilliant",
    name: "Brilliant",
    price: "199kr./ md.",
    firstMonth: "Første måned 159kr.",
    description: "Bedste vask året rundt",
    features: [
      { text: "Skumforvask", level: 2 },
      { text: "Tørring", level: 2 },
      { text: "Aktiv Shampoo", level: 1 },
      { text: "Højglans", level: 1 },
      { text: "Hjulvask", level: 1 },
      { text: "Undervognsvask", level: 1 },
      { text: "Højtryksvask", level: 2 },
      { text: "Skumvask", level: 1 },
      { text: "Børstevask", level: 2 },
      { text: "Affedtning", level: 1 },
      { text: "Voks", level: 2 },
      { text: "Sæsonrens", level: 2 },
    ],
  },
];

export const subscriptionVehicles: SubscriptionOption[] = [
  { value: "", label: "Vælg køretøj" },
  { value: "abc12345", label: "ABC12345 - Tesla Model 3" },
  { value: "def67890", label: "DEF67890 - Audi A4" },
];

export const subscriptionPaymentMethods: SubscriptionOption[] = [
  { value: "card", label: "Kort •••• 4242" },
  { value: "mobilepay", label: "MobilePay" },
  { value: "invoice", label: "Månedlig faktura" },
];

export function getSubscriptionPlanBySlug(slug: string) {
  return (
    subscriptionPlans.find((plan) => plan.slug === slug) || subscriptionPlans[0]
  );
}
