"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleHelp, Lock } from "lucide-react";

import AppHeader from "@/components/AppHeader";
import PageInfo from "@/components/PageInfo";
import { paymentPageContent } from "@/data/paymentData";
import {
  getSubscriptionPlanBySlug,
  subscriptionPaymentPageContent,
} from "@/data/subscriptionData";

function getFirstPaymentAmount(firstMonth: string, fallback: string) {
  const match = firstMonth.match(/(\d+)\s*kr\./i);

  if (!match) {
    return fallback.replace("kr./ md.", " kr");
  }

  return `${match[1]} kr`;
}
export default function SubscriptionBetalingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlanSlug = (searchParams.get("plan") ?? "guld").toLowerCase();
  const [showCvcHelp, setShowCvcHelp] = useState(false);

  const activePlan = getSubscriptionPlanBySlug(selectedPlanSlug);
  const firstPaymentAmount = getFirstPaymentAmount(
    activePlan.firstMonth,
    activePlan.price,
  );
  const recurringAmount = activePlan.price.replace("kr./ md.", " kr/md.");

  function handleContinue() {
    console.log("create subscription", {
      plan: selectedPlanSlug,
      payment: "card",
    });

    router.push(`/abonnement/handlesubscription?plan=${selectedPlanSlug}`);
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <PageInfo
        text={subscriptionPaymentPageContent.pageInfoTitle}
        userName=""
        className="bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />

      <section className="flex flex-1 flex-col px-6 pt-8 pb-6">
        <h1 className="mb-4 text-2xl font-bold text-white">
          {subscriptionPaymentPageContent.pageTitle}
        </h1> 
        

        <div className="mt-6 rounded-lg bg-black/40 p-4">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-white">
              {paymentPageContent.card.cardNumberLabel}
            </label>
            <input
              type="text"
              placeholder={paymentPageContent.card.cardNumberPlaceholder}
              className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-white">
                  {paymentPageContent.card.expiryLabel}
                </label>
                <input
                  type="text"
                  placeholder={paymentPageContent.card.expiryPlaceholder}
                  className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white">
                  {paymentPageContent.card.cvcLabel}
                </label>
                <div className="relative">
                  {showCvcHelp ? (
                    <div className="absolute -top-20 right-0 z-10 w-48 rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(228,236,245,0.92)_100%)] px-3 py-2.5 text-xs font-semibold leading-relaxed text-slate-700 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                      <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-(--brand-green-01)">
                        Kortsikkerhed
                      </div>
                      <p>{paymentPageContent.card.cvcHelpText}</p>
                      <span className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-r border-b border-white/20 bg-[rgb(234,240,246)]" />
                    </div>
                  ) : null}

                  <input
                    type="text"
                    placeholder={paymentPageContent.card.cvcPlaceholder}
                    className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 pr-10 text-white placeholder-white/60"
                  />
                  <button
                    type="button"
                    aria-label={paymentPageContent.card.cvcHelpLabel}
                    onClick={() => setShowCvcHelp((current) => !current)}
                    className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/90 transition active:scale-95"
                  >
                    <CircleHelp className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>

            <label className="block text-sm font-bold text-white">
              {paymentPageContent.card.nameLabel}
            </label>
            <input
              type="text"
              placeholder={paymentPageContent.card.namePlaceholder}
              className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
            />
          </div>
        </div>

        <div className="mt-auto flex pb-5 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-(--color-grey-01) px-4 py-1 font-bold text-2xl text-white [clip-path:polygon(0_0,100%_0,83%_100%,0_100%)]"
          >
            {subscriptionPaymentPageContent.buttons.back}
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 bg-(--brand-green-01) px-4 py-1 font-bold text-2xl text-white [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]"
          >
            {subscriptionPaymentPageContent.buttons.continue}
          </button>
        </div>
      </section>
    </div>
  );
}
