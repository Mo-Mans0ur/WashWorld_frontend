"use client";
import Image from "next/image";
import { useState } from "react";

const plans = [
  {
    name: "Guld",
    price: "139kr./ md.",
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
    name: "Premium",
    price: "169kr./ md.",
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
    name: "Brilliant",
    price: "199kr./ md.",
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

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState("Guld");

  const currentPlan = plans.find((plan) => plan.name === selectedPlan);

  return (
    <main className="app-shell">
      <section
        className="app-screen flex min-h-dvh flex-col pb-28"
        style={{
          background: "linear-gradient(90deg, #75cfa0 0%, #8f9994 100%)",
        }}
      >
        <header className="h-22 bg-[linear-gradient(90deg,var(--brand-green-01)_0%,#00130c_100%)] border-b-[3px] border-(--brand-green-01) px-7 py-5">
          <div className="flex items-start justify-between">
            <Image
              src="/logos/washworld-white.png"
              alt="Wash World logo"
              width={110}
              height={50}
              priority
            />

            <button
              type="button"
              aria-label="Åbn menu"
              className="flex flex-col gap-1.5 pt-1"
            >
              <span className="block h-0.75 w-8 bg-white" />
              <span className="block h-0.75 w-8 bg-white" />
              <span className="block h-0.75 w-8 bg-white" />
            </button>
          </div>
        </header>
        <section className="px-7 pt-6 text-center text-white">
          <h2 className="text-[1.9rem] font-bold leading-tight">
            Opret
            <br />
            vaskeabonnement
          </h2>

          <p className="mx-auto mt-2 max-w-67.5 text-[0.9rem] font-bold leading-tight">
            Hold din bil ren med et vaskeabonnement og spar penge
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
        </section>

        <section className="mx-auto mt-7 w-[82%] overflow-hidden bg-(--white-white) shadow-lg">
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

            <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-[0.75rem] font-medium text-black">
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
            className="ml-auto flex h-10.5 w-[85%] items-center justify-center bg-(--brand-green-01) text-[0.95rem] font-extrabold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
          >
            Opret vaskeabonnement
          </button>
        </section>
        <nav className="absolute bottom-0 left-0 flex h-28 w-full items-center justify-around bg-black text-white">
          <button type="button" className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xl font-extrabold">
              W
            </div>
            <span className="mt-1 text-[0.9rem] font-bold">Hjem</span>
          </button>

          <button type="button" className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.218-4.398 3.218-6.761 0-4.304-3.478-7.8-7.503-7.8-4.026 0-7.503 3.496-7.503 7.8 0 2.363 1.274 4.678 3.218 6.76a19.58 19.58 0 002.682 2.283 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-1 text-[0.9rem] font-bold">Kort</span>
          </button>

          <button type="button" className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-1 text-[0.9rem] font-bold">Profil</span>
          </button>
        </nav>
      </section>
    </main>
  );
}

function PlanButton({ name, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7.5 flex-1 rounded-full text-[0.85rem] font-extrabold text-black transition ${
        active
          ? "bg-white"
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
          isIncluded
            ? "bg-[var(--brand-green-01)]"
            : "bg-[var(--color-grey-02)]"
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


