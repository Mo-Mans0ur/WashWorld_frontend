"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import AppHeader from "@/components/AppHeader";
import PageInfo from "@/components/PageInfo";
import ScreenLayout from "@/components/ScreenLayout";
import SingleWashAdviceInfo from "../../../components/SingleWashAdviceInfo";
import StartWashButton from "@/components/buttons/StartWashButton";
import { singleWashReadyPageContent } from "@/data/singleWashData";

export default function SingleWashStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPlan = searchParams.get("plan") ?? "guld";
  const selectedPayment = searchParams.get("payment") ?? "card";
  const plateNumber = searchParams.get("plate") ?? "";
  const pageTitle = singleWashReadyPageContent.title.replace(/\.\.\.$/, "");

  function handleStartWash() {
    router.push(
      `/activewash?plan=${selectedPlan}&payment=${selectedPayment}&plate=${encodeURIComponent(plateNumber)}`,
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      <PageInfo
        text={singleWashReadyPageContent.pageInfoTitle}
        userName=""
        className="bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />

      <ScreenLayout>
        <section className="relative flex flex-1 flex-col px-7 pt-8 pb-8 text-white">
          <SingleWashAdviceInfo />

          <h1 className="mx-auto mt-20 max-w-66 text-[2.1rem] font-extrabold leading-tight">
            {pageTitle}
          </h1>

          <div className="mx-auto mt-13 w-full max-w-76">
            <div className="driving-scene relative h-44 overflow-hidden px-2 py-6">
              <div className="driving-car-wrap relative z-10 mx-auto mt-2 w-fit">
                <div className="driving-car-shadow absolute inset-x-7 bottom-3 h-5 rounded-full" />
                <Image
                  src="/icons/drivingCar.png"
                  alt={singleWashReadyPageContent.illustrationAlt}
                  width={214}
                  height={123}
                  className="driving-car-image h-auto w-52 object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col items-center pt-14 text-center">
            <p className="text-[1rem] font-extrabold text-white">
              {singleWashReadyPageContent.ctaLabel}
            </p>

            <div className="mt-3 flex w-full justify-center">
              <StartWashButton onClick={handleStartWash} />
            </div>
          </div>
        </section>
      </ScreenLayout>
    </div>
  );
}
