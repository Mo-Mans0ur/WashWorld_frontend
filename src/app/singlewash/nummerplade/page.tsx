"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppHeader from "@/components/AppHeader";
import PageInfo from "@/components/PageInfo";
import ScreenLayout from "@/components/ScreenLayout";
import SingleWashAdviceInfo from "../../../components/SingleWashAdviceInfo";
import { singleWashPlatePageContent } from "@/data/singleWashData";

export default function SingleWashPlatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plateNumber, setPlateNumber] = useState("DB 43 234");

  const selectedPlan = searchParams.get("plan") ?? "guld";
  const selectedPayment = searchParams.get("payment") ?? "card";
  const scanningTitle = singleWashPlatePageContent.title.replace(/\.\.\.$/, "");

  function handleContinue() {
    router.push(
      `/singlewash/startvask?plan=${selectedPlan}&payment=${selectedPayment}&plate=${encodeURIComponent(plateNumber)}`,
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      <PageInfo
        text={singleWashPlatePageContent.pageInfoTitle}
        userName=""
        className="bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />

      <ScreenLayout>
        <section className="relative flex flex-1 flex-col px-7 pt-8 pb-5 text-white">
          <SingleWashAdviceInfo />

          <h1
            className="mt-20 text-center text-[2.1rem] font-extrabold leading-tight"
            aria-label={singleWashPlatePageContent.title}
          >
            {scanningTitle}
            <span className="inline-flex w-[1.2em] justify-start text-left">
              <span className="scanning-dot">.</span>
              <span className="scanning-dot">.</span>
              <span className="scanning-dot">.</span>
            </span>
          </h1>

          <div className="mx-auto mt-10 w-full max-w-93">
            <Image
              src="/icons/ScanningPlate.png"
              alt={singleWashPlatePageContent.illustrationAlt}
              width={372}
              height={245}
              className="h-auto w-full object-contain"
              priority
            />
          </div>

          <div className="mx-auto mt-12 w-full max-w-81.5">
            <label className="mb-2 block text-center text-[1.1rem] font-extrabold text-white">
              {singleWashPlatePageContent.manualLabel}
            </label>

            <input
              type="text"
              value={plateNumber}
              onChange={(event) =>
                setPlateNumber(event.target.value.toUpperCase())
              }
              placeholder={singleWashPlatePageContent.manualPlaceholder}
              className="h-14 w-full border-[3px] border-white bg-[#d9ddda]/85 px-4 text-[1.05rem] font-extrabold uppercase tracking-[0.02em] text-[#8d9892] outline-none placeholder:text-[#8d9892]"
            />
          </div>

          <div className="mt-auto flex pt-12">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-(--color-grey-01) px-4 py-1 font-bold text-2xl text-white shadow-[0_6px_12px_rgba(0,0,0,0.18)] transition active:scale-[0.99] [clip-path:polygon(0_0,100%_0,83%_100%,0_100%)]"
            >
              {singleWashPlatePageContent.buttons.back}
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!plateNumber.trim()}
              className="flex-1 bg-(--brand-green-01) px-4 py-1 font-bold text-2xl text-white shadow-[0_6px_12px_rgba(0,0,0,0.18)] transition disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99] [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]"
            >
              {singleWashPlatePageContent.buttons.continue}
            </button>
          </div>
        </section>
      </ScreenLayout>
    </div>
  );
}
