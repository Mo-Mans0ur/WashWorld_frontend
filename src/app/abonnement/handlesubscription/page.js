"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";

const PLANT_DATA = {
  guld: {
    name: "Guld",
    monthly: "139kr./ md.",
    firstMonth: "Første måned 99kr.",
  },

  premium: {
    name: "Premium",
    monthly: "169kr./ md.",
    firstMonth: "Første måned 129kr.",
  },
  brilliant: {
    name: "Brilliant",
    monthly: "199kr./ md.",
    firstMonth: "Første måned 159kr.",
  },
};

const VEHICLES = [
  { value: "", label: "Vælg køretøj" },
  { value: "abc12345", label: "ABC12345 - Tesla Model 3" },
  { value: "def67890", label: "DEF67890 - Audi A4" },
];

export default function HandleSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planKey = (searchParams.get("plan") || "guld").toLowerCase();
  const activePlan = useMemo(
    () => PLANT_DATA[planKey] || PLANT_DATA.guld,
    [planKey],
  );

  const [vehicle, setVehicle] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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

  return (
    <>
      <AppHeader />
      <section
        className="flex min-h-[calc(120dvh-88px-112px)] flex-col px-6 pt-3.5 pb-4 text-white"
        style={{
          background: "linear-gradient(90deg, #75cfa0 0%, #8f9994 100%)",
        }}
      >
        <h1 className="text-center text-[2rem] font-bold leading-tight">
          Opret
          <br />
          vaskeabonnement
        </h1>
        <p className="mx-auto mt-1 max-w-64 text-center text-[1rem] font-semibold leading-tight">
          Hold din bil ren med et vaskeabonnement og spar penge
        </p>

        <div className="mx-auto mt-3.5 w-full max-w-74 bg-(--brand-green-01) px-4 py-6 text-center shadow-lg">
          <h2 className="text-[2rem] font-extrabold leading-none">
            {activePlan.name}
          </h2>
          <p className="mt-1.5 text-[1.6rem] font-extrabold leading-none">
            {activePlan.monthly}
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none">
            {activePlan.firstMonth}
          </p>
        </div>

        <p className="mx-auto mt-2 max-w-74 text-center text-[0.95rem] leading-tight">
          *Gælder kun nummerplader, der ikke før har haft et abonnement hos Wash
          world.
        </p>

        <div className="mt-auto">
          <p className="mx-auto max-w-68 text-center text-[1.2rem] font-bold leading-tight">
            Vælg bil og betalingsmiddel til dit vaskeabonnement
          </p>

          <div className="mx-auto mt-3.5 flex w-full max-w-72 flex-col gap-1.5">
            <div className="relative flex h-9.5 items-center overflow border border-(--color-grey-02) bg-(--white-white) text-black">
              <span className="pl-2 pr-1 text-(--color-grey-01)">
                <CarIcon />
              </span>
              <span className="flex-1 truncate pr-20 text-[1rem] font-semibold text-(--color-grey-01)">
                {vehicle
                  ? VEHICLES.find((option) => option.value === vehicle)?.label
                  : "Vælg køretøj"}
              </span>
              <button
                type="button"
                onClick={() => setVehicle(VEHICLES[1]?.value || "")}
                className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
              >
                Vælg
              </button>
            </div>

            <div className="relative flex h-9.5 items-center overflow border border-(--color-grey-02) bg-(--white-white) text-black">
              <span className="pl-2 pr-1 text-(--color-grey-01)">
                <CardIcon />
              </span>
              <span className="flex-1 pr-20 text-[1rem] font-semibold text-(--color-grey-01)">
                Vælg betalingsmetode
              </span>
              <button
                type="button"
                className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
              >
                Vælg
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
              Jeg accepterer{" "}
              <a href="#" className="text-(--color-secondary)">
                abonnementsvilkår
              </a>
            </span>
          </label>

          <div className="mx-auto mt-5.5 flex w-full max-w-69 items-center gap-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-8.5 flex-1 bg-(--color-grey-01) text-[1.45rem] font-extrabold text-white [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
            >
              Tilbage
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="-ml-3.5 h-8.5 flex-1 bg-(--brand-green-01) text-[1.45rem] font-extrabold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
            >
              Opret
            </button>
          </div>
        </div>
      </section>
      <BottomNav />
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
