"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SAVED_PAYMENT_CARD_STORAGE_KEY } from "@/data/profileData";
import { useVehicles } from "@/context/VehiclesContext";
import {
  getSubscriptionPlanBySlug,
  subscriptionPageNames,
  subscriptionPaymentMethods,
  subscriptionVehicles,
} from "@/data/subscriptionData";
import PageInfo from "@/components/PageInfo";
import { createSubscription } from "@/lib/subscriptionsApi";

export default function HandleSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vehicles } = useVehicles();

  const planKey = (searchParams.get("plan") || "guld").toLowerCase();
  const activePlan = useMemo(
    () => getSubscriptionPlanBySlug(planKey),
    [planKey],
  );

  const savedVehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.plate} - ${vehicle.name}`,
      })),
    [vehicles],
  );
  const hasSavedVehicle = savedVehicleOptions.length > 0;
  const initialVehicleValue =
    savedVehicleOptions.find(
      (option) =>
        option.value ===
        String(vehicles.find((savedVehicle) => savedVehicle.active)?.id),
    )?.value ??
    savedVehicleOptions[0]?.value ??
    "";
  const hasSavedPaymentCard =
    typeof window !== "undefined" &&
    window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY) !== null;
  const vehicleOptions = hasSavedVehicle
    ? savedVehicleOptions
    : subscriptionVehicles.filter((item) => item.value);

  const [vehicle, setVehicle] = useState(initialVehicleValue);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const selectedVehicleLabel = vehicle
    ? vehicleOptions.find((option) => option.value === vehicle)?.label
    : "";
  const selectedPaymentMethodLabel = paymentMethod
    ? subscriptionPaymentMethods.find((item) => item.value === paymentMethod)
        ?.label
    : "";

  const canSubmit = Boolean(vehicle) && Boolean(paymentMethod) && acceptedTerms;

  function formatDate(d: Date): string {
    return d.toISOString().slice(0, 19).replace("T", " ");
  }

  async function handleSubmit() {
    if (!vehicle || !paymentMethod || !acceptedTerms) {
      setAttempted(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);
    const nextBilling = new Date(now);
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const priceRaw = parseInt(activePlan.price.replace(/[^0-9]/g, ""), 10);

    try {
      await createSubscription({
        subscription_name: activePlan.name,
        subscription_price: priceRaw,
        subscription_status: "aktiv",
        subscription_start_date: formatDate(now),
        subscription_end_date: formatDate(endDate),
        subscription_next_billing_date: formatDate(nextBilling),
      });
      router.push("/profile");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Kunne ikke oprette abonnement");
      setIsSubmitting(false);
    }
  }

  const isSheetOpen = activeSheet !== null;
  const sheetTitle =
    activeSheet === "vehicle"
      ? subscriptionPageNames.vehicleSheetTitle
      : subscriptionPageNames.paymentSheetTitle;
  const sheetOptions =
    activeSheet === "vehicle" ? vehicleOptions : subscriptionPaymentMethods;

  function selectFromSheet(value) {
    if (activeSheet === "vehicle") {
      setVehicle(value);
    }

    if (activeSheet === "payment") {
      setPaymentMethod(value);
    }

    setActiveSheet(null);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <PageInfo
        text={subscriptionPageNames.createTitle}
        userName=""
      />
      <main className="flex-1 overflow-y-auto px-6 pt-3.5 pb-4 text-white scrollbar-hide">
        <h1 className="text-center text-[2rem] font-bold leading-tight">
          {subscriptionPageNames.createTitleLineOne}
          <br />
          {subscriptionPageNames.createTitleLineTwo}
        </h1>
        <p className="mx-auto mt-1 max-w-64 text-center text-[1rem] font-semibold leading-tight">
          {subscriptionPageNames.createDescription}
        </p>

        <div className="mx-auto mt-3.5 w-full max-w-74 bg-(--brand-green-01) px-4 py-6 text-center shadow-lg">
          <h2 className="text-[2rem] font-bold leading-none">
            {activePlan.name}
          </h2>
          <p className="mt-1.5 text-[1rem] font-bold leading-none">
            {activePlan.price}
          </p>
          <p className="mt-1 text-[1.2rem] font-bold leading-none">
            {activePlan.firstMonth}
          </p>
        </div>

        <p className="mx-auto mt-2 max-w-74 text-center text-[0.95rem] leading-tight">
          {subscriptionPageNames.footnote}
        </p>

        <div className="mt-20">
          <p className="mx-auto max-w-68 text-center text-[1.2rem] font-bold leading-tight">
            {subscriptionPageNames.pickerIntro}
          </p>

          <div className="mx-auto mt-3.5 flex w-full max-w-72 flex-col gap-1.5">
            <div>
              <div className={`relative flex h-9.5 items-center overflow border bg-(--white-white) ${vehicle ? "border-(--brand-green-01)" : attempted ? "border-red-400" : "border-(--color-grey-02)"}`}>
                <span className={`pl-2 pr-1 ${vehicle ? "text-(--brand-green-01)" : "text-(--color-grey-01)"}`}>
                  <CarIcon />
                </span>
                <span className={`flex-1 truncate pr-20 text-[1rem] font-semibold ${vehicle ? "text-black" : "text-(--color-grey-01)"}`}>
                  {selectedVehicleLabel || subscriptionPageNames.vehiclePlaceholder}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSheet("vehicle")}
                  className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
                >
                  {subscriptionPageNames.selectButton}
                </button>
              </div>
              {attempted && !vehicle && (
                <p className="mt-1 text-xs font-semibold text-red-400">Vælg venligst et køretøj</p>
              )}
            </div>

            <div>
              <div className={`relative flex h-9.5 items-center overflow border bg-(--white-white) ${paymentMethod ? "border-(--brand-green-01)" : attempted ? "border-red-400" : "border-(--color-grey-02)"}`}>
                <span className={`pl-2 pr-1 ${paymentMethod ? "text-(--brand-green-01)" : "text-(--color-grey-01)"}`}>
                  <CardIcon />
                </span>
                <span className={`flex-1 pr-20 text-[1rem] font-semibold ${paymentMethod ? "text-black" : "text-(--color-grey-01)"}`}>
                  {selectedPaymentMethodLabel || subscriptionPageNames.paymentPlaceholder}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSheet("payment")}
                  className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
                >
                  {subscriptionPageNames.selectButton}
                </button>
              </div>
              {attempted && !paymentMethod && (
                <p className="mt-1 text-xs font-semibold text-red-400">Vælg venligst en betalingsmetode</p>
              )}
            </div>
          </div>
          <label className="mx-auto mt-2.5 flex w-full max-w-72 items-center justify-center gap-2 text-[0.95rem] font-semibold text-(--white-white)">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 accent-(--brand-green-01)"
            />
            <span>
              {subscriptionPageNames.termsPrefix}{" "}
              <a href="#" className="text-(--color-secondary)">
                {subscriptionPageNames.termsLinkLabel}
              </a>
            </span>
          </label>

          {submitError && (
            <p className="mx-auto mt-3 max-w-72 text-center text-sm font-semibold text-red-400">
              {submitError}
            </p>
          )}

          <div className="mx-auto mt-5.5 w-full max-w-69">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`h-8.5 w-full text-[1.45rem] font-semibold text-white [clip-path:polygon(0_0,100%_0,94%_100%,0_100%)] transition-opacity ${canSubmit && !isSubmitting ? "bg-(--brand-green-01)" : "bg-(--color-grey-01) opacity-60 cursor-not-allowed"}`}
            >
              {isSubmitting ? "Opretter..." : subscriptionPageNames.submitButton}
            </button>
          </div>
        </div>
      </main>

      <div
        className={`absolute inset-0 z-40 transition ${
          isSheetOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Luk vælger"
          onClick={() => setActiveSheet(null)}
          className={`absolute inset-0 bg-(--color-overlay-dark-45) transition-opacity ${
            isSheetOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute right-0 bottom-0 left-0 rounded-t-3xl bg-(--white-white) px-5 pt-4 pb-6 text-black shadow-2xl transition-transform duration-300 ease-out ${
            isSheetOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-(--color-grey-02)" />
          <h3 className="text-[1.15rem] font-bold">{sheetTitle}</h3>

          <div className="mt-4 space-y-2">
            {sheetOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => selectFromSheet(item.value)}
                className="w-full rounded-xl border border-(--color-grey-02) bg-(--color-surface) px-4 py-3 text-left text-[1rem] font-semibold"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4.5 w-4.5"
      aria-hidden="true"
    >
      <path d="M4.7 13.2h14.6l-1-3.3a2 2 0 0 0-1.9-1.4H7.6a2 2 0 0 0-1.9 1.4l-1 3.3Zm-.7 1.5A2 2 0 0 1 6 13h12a2 2 0 0 1 2 1.7l.4 2.8a.75.75 0 0 1-.75.85h-1.4a.75.75 0 0 1-.75-.75V17H6.5v.55a.75.75 0 0 1-.75.75H4.35a.75.75 0 0 1-.75-.85L4 14.7Z" />
      <circle cx="7.6" cy="15.5" r="1" />
      <circle cx="16.4" cy="15.5" r="1" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4.5 w-4.5"
      aria-hidden="true"
    >
      <path d="M3.5 6.25A1.75 1.75 0 0 1 5.25 4.5h13.5a1.75 1.75 0 0 1 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V6.25Zm1.5 2v2h14v-2H5Zm0 4v5.5h14v-5.5H5Z" />
    </svg>
  );
}
