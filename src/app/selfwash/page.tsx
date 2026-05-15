"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ScreenLayout from "@/components/ScreenLayout";
import AssistanceButton from "@/components/buttons/AssistanceButton";
import Button from "@/components/buttons/Button";

const PRICE_PER_MINUTE = 6;
const START_PRICE = 0;
const SESSION_ID = 1043;

export default function ActiveWashPage() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secsIntoMin = totalSeconds % 60;
  const secsUntilNext = secsIntoMin === 0 ? 60 : 60 - secsIntoMin;
  const currentPrice = START_PRICE + minutes * PRICE_PER_MINUTE;
  const progressPercent = (secsIntoMin / 60) * 100;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <ScreenLayout>
        {/* Assistance button */}
        <div className="flex justify-center px-8 pt-8">
          <AssistanceButton />
        </div>

        {/* Session info */}
        <div className="mt-5 flex flex-col items-center gap-1 px-8">
          <p className="text-sm text-(--white-white)/60">ID : {SESSION_ID}</p>
          <p className="text-sm font-bold text-(--white-white)">
            {PRICE_PER_MINUTE} kr / min
          </p>
          <p className="mt-2 text-2xl font-bold text-(--white-white)">
            Vasken er i gang.
          </p>
        </div>

        {/* Timer */}
        <p
          className="mt-6 text-center font-bold tabular-nums text-(--white-white)"
          style={{ fontSize: "clamp(64px, 20vw, 88px)", lineHeight: 1 }}
          aria-live="polite"
          aria-label={`Tid: ${pad(minutes)} minutter og ${pad(seconds)} sekunder`}
        >
          {pad(minutes)}:{pad(seconds)}
        </p>

        {/* Divider */}
        <div className="mx-8 mt-8 border-t border-(--color-grey-02)" />

        {/* Price */}
        <div className="mt-6 flex flex-col items-center gap-1 px-8">
          <p className="text-base text-(--white-white)/60">Nuværende pris</p>
          <p className="text-4xl font-bold text-(--white-white)">{currentPrice} kr</p>
        </div>

        {/* Next increase + progress bar */}
        <div className="mt-3 flex flex-col items-center gap-2 px-8">
          <p className="text-sm text-(--white-white)/60">
            {secsIntoMin === 0
              ? "Prisen steg netop nu!"
              : `næste stigning om ${secsUntilNext} sek`}
          </p>

          <div className="h-1 w-full overflow-hidden rounded-full bg-(--color-grey-02)">
            <div
              className="h-full rounded-full bg-(--color-primary) transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* End wash button */}
        <div className="mt-8 flex justify-center px-8">
          <Button
          
            variant="trapezoid"
            size="lg"
            onClick={() => router.push("/dashboard")}
            style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))" }}
          >
            Afslut vask
          </Button>
        </div>
      </ScreenLayout>

      <BottomNav />
    </div>
  );
}