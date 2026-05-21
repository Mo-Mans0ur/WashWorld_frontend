"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleHelp, Lock } from "lucide-react";

import PageInfo from "@/components/PageInfo";
import { paymentPageContent } from "@/data/paymentData";
import { SAVED_PAYMENT_CARD_STORAGE_KEY } from "@/data/profileData";
import {
  getSubscriptionPlanBySlug,
  subscriptionPaymentPageContent,
} from "@/data/subscriptionData";
import ContinueButton from "@/components/ContinueButton";

type StoredPaymentCard = {
  cardNumber: string;
  expiry: string;
  name: string;
};

function getStoredPaymentCard(): StoredPaymentCard | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredPaymentCard;
  } catch {
    window.localStorage.removeItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
    return null;
  }
}

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
  const storedPaymentCard = getStoredPaymentCard();
  const [showCvcHelp, setShowCvcHelp] = useState(false);
  const [cardNumber, setCardNumber] = useState(
    storedPaymentCard?.cardNumber ?? "",
  );
  const [expiry, setExpiry] = useState(storedPaymentCard?.expiry ?? "");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState(
    storedPaymentCard?.name ?? "",
  );
  const [rememberCard, setRememberCard] = useState(storedPaymentCard !== null);

  const activePlan = getSubscriptionPlanBySlug(selectedPlanSlug);
  const firstPaymentAmount = getFirstPaymentAmount(
    activePlan.firstMonth,
    activePlan.price,
  );
  const recurringAmount = activePlan.price.replace("kr./ md.", " kr/md.");

  useEffect(() => {
    if (!storedPaymentCard) {
      return;
    }

    router.replace(`/abonnement/handlesubscription?plan=${selectedPlanSlug}`);
  }, [router, selectedPlanSlug, storedPaymentCard]);

  function handleContinue() {
    if (rememberCard) {
      window.localStorage.setItem(
        SAVED_PAYMENT_CARD_STORAGE_KEY,
        JSON.stringify({
          cardNumber,
          expiry,
          name: cardholderName,
        } satisfies StoredPaymentCard),
      );
    } else {
      window.localStorage.removeItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
    }

    console.log("create subscription", {
      plan: selectedPlanSlug,
      payment: "card",
    });

    router.push(`/abonnement/handlesubscription?plan=${selectedPlanSlug}`);
  }

  return (
    <div className="flex min-h-full flex-col">
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
              value={cardNumber}
              onChange={(event) => setCardNumber(event.target.value)}
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
                  value={expiry}
                  onChange={(event) => setExpiry(event.target.value)}
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
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--brand-green-01)">
                        Kortsikkerhed
                      </div>
                      <p>{paymentPageContent.card.cvcHelpText}</p>
                      <span className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-r border-b border-white/20 bg-[rgb(234,240,246)]" />
                    </div>
                  ) : null}

                  <input
                    type="text"
                    placeholder={paymentPageContent.card.cvcPlaceholder}
                    value={cvc}
                    onChange={(event) => setCvc(event.target.value)}
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
              value={cardholderName}
              onChange={(event) => setCardholderName(event.target.value)}
              className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
            />

            <label className="mt-1 flex items-center gap-3 rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-white">
              <input
                type="checkbox"
                checked={rememberCard}
                onChange={(event) => setRememberCard(event.target.checked)}
                className="h-4 w-4 rounded border-white/40 accent-(--brand-green-01)"
              />
              <span className="text-sm font-bold leading-none">
                {paymentPageContent.card.rememberCardLabel}
              </span>
            </label>
          </div>
        </div>

        <div className="mt-auto pb-5 pt-4">
          <ContinueButton onClick={handleContinue}>
            {subscriptionPaymentPageContent.buttons.continue}
          </ContinueButton>
        </div>
      </section>
    </div>
  );
}
