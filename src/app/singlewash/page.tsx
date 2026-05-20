"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import PageInfo from "@/components/PageInfo";
import { paymentPageContent } from "@/data/paymentData";
import { singleWashPageContent, paymentPlans } from "@/data/singleWashData";

export default function SingleWashPage() {
  const [selectedPlan, setSelectedPlan] = useState("Guld");

  const currentPlan = paymentPlans.find((plan) => plan.name === selectedPlan);

  const router = useRouter();

  function handleContinue() {
    router.push(
      `/betaling?plan=${currentPlan?.slug ?? selectedPlan.toLowerCase()}`,
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageInfo
        text={singleWashPageContent.pageInfoTitle}
        userName=""
      />
      <main className="flex-1 overflow-y-auto px-7 pt-6 pb-6 text-center text-white scrollbar-hide">
        <h2 className="text-[1.9rem] font-bold leading-tight ">
          {singleWashPageContent.pageTitleLineOne}
          <br />
          {singleWashPageContent.pageTitleLineTwo}
        </h2>

        <p className="mx-auto mt-5 max-w-67.5 text-[0.9rem] font-bold leading-tight">
          {singleWashPageContent.description}
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
          <div className="flex h-full flex-col">
            <section className="mx-auto mt-7 w-[82%] overflow-hidden rounded-[3px] bg-(--white-white) shadow-lg">
              <div className="bg-(--brand-green-01) px-6 py-5 text-center text-white">
                <h2 className="text-[2rem] font-bold leading-none">
                  {currentPlan.name}
                </h2>

                <p className="mt-2 text-[1.35rem] font-bold">
                  {currentPlan.price}
                </p>
              </div>

              <div className="px-5 py-4">
                <h3 className="mb-4 text-center text-[1.15rem] font-bold text-black">
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
            </section>

            <div className="mt-18 flex pb-5 ">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-(--color-grey-01) px-4 py-1 font-bold text-2xl text-white transition hover:opacity-90 [clip-path:polygon(0_0,100%_0,83%_100%,0_100%)]"
              >
                {paymentPageContent.buttons.back}
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 bg-(--brand-green-01) px-4 py-1 font-bold text-2xl text-white transition disabled:cursor-not-allowed disabled:opacity-50 [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]"
              >
                {singleWashPageContent.buttons.continue}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PlanButton({ name, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7.5 flex-1 rounded-full text-[0.85rem] font-bold text-black transition ${
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
        className={`relative flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold text-white ${
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
