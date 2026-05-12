"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";
import HeaderThing from "@/components/PageInfo.jsx";
import {
  getSubscriptionPlanBySlug,
  subscriptionPageNames,
  subscriptionPaymentMethods,
  subscriptionVehicles,
} from "@/data/subscriptionData";

export default function HandleSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planKey = (searchParams.get("plan") || "guld").toLowerCase();
  const activePlan = useMemo(
    () => getSubscriptionPlanBySlug(planKey),
    [planKey],
  );

  const [vehicle, setVehicle] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);

  // Payment comes later, for now we just simulate a successful subscription creation
  const canSubmit = Boolean(vehicle) && acceptedTerms;

  function handleSubmit() {
    if (!canSubmit) return;
    // Simulate subscription creation and redirect to confirmation page
    console.log("create subscription", {
      plan: planKey,
      vehicle,
      acceptedTerms,
    });
  }

  const isSheetOpen = activeSheet !== null;
  const sheetTitle =
    activeSheet === "vehicle"
      ? subscriptionPageNames.vehicleSheetTitle
      : subscriptionPageNames.paymentSheetTitle;
  const sheetOptions =
    activeSheet === "vehicle"
      ? subscriptionVehicles.filter((item) => item.value)
      : subscriptionPaymentMethods;

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
    <>
      <AppHeader />
      <HeaderThing
        text={subscriptionPageNames.createTitle}
        className="bg-[linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />
      <section
        className="flex min-h-[calc(120dvh-88px-48px-112px)] flex-col px-6 pt-3.5 pb-4 text-white"
        style={{
          background:
            "linear-gradient(90deg, var(--color-dashboard-gradient-start) 0%, var(--color-dashboard-gradient-end) 100%)",
        }}
      >
        <h1 className="text-center text-[2rem] font-bold leading-tight">
          {subscriptionPageNames.createTitleLineOne}
          <br />
          {subscriptionPageNames.createTitleLineTwo}
        </h1>
        <p className="mx-auto mt-1 max-w-64 text-center text-[1rem] font-semibold leading-tight">
          {subscriptionPageNames.createDescription}
        </p>

        <div className="mx-auto mt-3.5 w-full max-w-74 bg-(--brand-green-01) px-4 py-6 text-center shadow-lg">
          <h2 className="text-[2rem] font-extrabold leading-none">
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
            <div className="relative flex h-9.5 items-center overflow border border-(--color-grey-02) bg-(--white-white) text-black">
              <span className="pl-2 pr-1 text-(--color-grey-01)">
                <CarIcon />
              </span>
              <span className="flex-1 truncate pr-20 text-[1rem] font-semibold text-(--color-grey-01)">
                {vehicle
                  ? subscriptionVehicles.find(
                      (option) => option.value === vehicle,
                    )?.label
                  : subscriptionPageNames.vehiclePlaceholder}
              </span>
              <button
                type="button"
                onClick={() => setActiveSheet("vehicle")}
                className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
              >
                {subscriptionPageNames.selectButton}
              </button>
            </div>

            <div className="relative flex h-9.5 items-center overflow border border-(--color-grey-02) bg-(--white-white) text-black">
              <span className="pl-2 pr-1 text-(--color-grey-01)">
                <CardIcon />
              </span>
              <span className="flex-1 pr-20 text-[1rem] font-semibold text-(--color-grey-01)">
                {paymentMethod
                  ? subscriptionPaymentMethods.find(
                      (item) => item.value === paymentMethod,
                    )?.label
                  : subscriptionPageNames.paymentPlaceholder}
              </span>
              <button
                type="button"
                onClick={() => setActiveSheet("payment")}
                className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
              >
                {subscriptionPageNames.selectButton}
              </button>
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

          <div className="mx-auto mt-5.5 flex w-full max-w-69 items-center gap-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-8.5 flex-1 bg-(--color-grey-01) text-[1.45rem] font-extrabold text-white [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
            >
              {subscriptionPageNames.backButton}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="-ml-3.5 h-8.5 flex-1 bg-(--brand-green-01) text-[1.45rem] font-extrabold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
            >
              {subscriptionPageNames.submitButton}
            </button>
          </div>
        </div>
      </section>
      <BottomNav />

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
    </>
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
