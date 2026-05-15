"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";
import {
  subscriptionPageNames,
  subscriptionPlans,
} from "@/data/subscriptionData";
import Page from "../locations/list/page";
import PageInfo from "@/components/PageInfo.jsx";

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState("Guld");

  const currentPlan = subscriptionPlans.find(
    (plan) => plan.name === selectedPlan,
  );

  const router = useRouter();

  function handleCreateSubscription() {
    router.push(
      `/abonnement/handlesubscription?plan=${selectedPlan.toLowerCase()}`,
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      <PageInfo
        text={subscriptionPageNames.listTitle}
        userName=""
        className="bg-[linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />
      <main
        className="flex-1 overflow-y-auto px-7 pt-6 pb-6 text-center text-white scrollbar-hide"
        style={{
          background:
            "linear-gradient(90deg, var(--color-dashboard-gradient-start) 0%, var(--color-dashboard-gradient-end) 100%)",
        }}
      >
        <h2 className="text-[1.9rem] font-bold leading-tight ">
          {subscriptionPageNames.createTitleLineOne}
          <br />
          {subscriptionPageNames.createTitleLineTwo}
        </h2>

        <p className="mx-auto mt-5 max-w-67.5 text-[0.9rem] font-bold leading-tight">
          {subscriptionPageNames.createDescription}
        </p>

        <div className="mt-5 flex items-center justify-between gap-5">
          <PlanButton
            name="Guld"
            active={selectedPlan === "Guld"}
            onClick={() => setSelectedPlan("Guld")}
          />

          <PlanButton
            name="Premium"
            active={selectedPlan === "Premium"}
            onClick={() => setSelectedPlan("Premium")}
          />

          <PlanButton
            name="Brilliant"
            active={selectedPlan === "Brilliant"}
            onClick={() => setSelectedPlan("Brilliant")}
          />
        </div>
        {currentPlan && (
          <section className="mx-auto mt-7 w-[82%] overflow-hidden bg-(--white-white) shadow-lg ">
            <div className="bg-(--brand-green-01) px-6 py-5 text-center text-white">
              <h2 className="text-[2rem] font-extrabold leading-none">
                {currentPlan.name}
              </h2>

              <p className="mt-2 text-[1.35rem] font-extrabold">
                {currentPlan.price}
              </p>
            </div>

            <div className="px-5 py-4">
              <h3 className="mb-4 text-center text-[1.15rem] font-extrabold text-black">
                {currentPlan.description}
              </h3>

              <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-[0.75rem] font-medium text-black ">
                {currentPlan.features.map((feature) => (
                  <Feature
                    key={feature.text}
                    text={feature.text}
                    level={feature.level}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateSubscription}
              className="ml-auto flex h-10.5 w-[85%] items-center justify-center bg-(--brand-green-01) text-[0.95rem] font-extrabold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
            >
              {subscriptionPageNames.createButton}
            </button>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function PlanButton({ name, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7.5 flex-1 rounded-full text-[0.85rem] font-extrabold text-black transition ${
        active
          ? "bg-(--color-surface)"
          : "bg-(--color-grey-03) ring-2 ring-(--brand-green-01)"
      }`}
    >
      {name}
    </button>
  );
}
function Feature({ text, level = 0 }) {
  const isIncluded = level > 0;
  const isDouble = level === 2;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`relative flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-extrabold text-white ${
          isIncluded ? "bg-(--brand-green-01)" : "bg-(--color-grey-02)"
        }`}
      >
        {isIncluded ? (
          <>
            <span className={isDouble ? "absolute -left-0.5" : ""}>✓</span>
            {isDouble && <span className="absolute left-1.25">✓</span>}
          </>
        ) : (
          "−"
        )}
      </span>

      <span>{text}</span>
    </div>
  );
}
