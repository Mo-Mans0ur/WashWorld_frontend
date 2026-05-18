"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import PageInfo from "@/components/PageInfo";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import { paymentOptions, paymentPageContent } from "@/data/paymentData";
import { paymentPlans } from "@/data/singleWashData";
import { CircleAlert, CircleHelp, Lock } from "lucide-react";

function getPaymentId(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("mobilepay")) return "mobilepay";
  if (normalized.includes("wallet") || normalized.includes("apple pay")) {
    return "wallet";
  }
  if (normalized.includes("kontakt")) return "contactless";
  return "card";
}

const paymentMethods = paymentOptions.map((option, index) => ({
  id: getPaymentId(option.title),
  title: option.title,
  description: option.description,
  image: option.icon || `/payment/${index}.png`,
}));

export default function BetalingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [walletMethod, setWalletMethod] = useState<"apple" | "google">("apple");
  const [showCvcHelp, setShowCvcHelp] = useState(false);
  const selectedPlan = searchParams.get("plan") ?? "guld";
  const selectedPlanDetails =
    paymentPlans.find((plan) => plan.slug === selectedPlan) ?? paymentPlans[0];
  const selectedPlanAmount = selectedPlanDetails.price.replace("kr.", " kr");
  const selectedWalletMethod = paymentPageContent.wallet.methods.find(
    (method) => method.value === walletMethod,
  );
  const hasSelectedRoute =
    selectedPayment !== null && selectedPayment !== "contactless";
  const showPaymentDetails =
    selectedPayment !== null && selectedPayment !== "contactless";

  function handleSelectPayment(paymentId: string) {
    setSelectedPayment(paymentId);
    if (paymentId !== "card") {
      setShowCvcHelp(false);
    }
  }

  function handleContinue() {
    if (!selectedPayment || selectedPayment === "contactless") return;

    router.push(
      `/singlewash/nummerplade?plan=${selectedPlan}&payment=${selectedPayment}`,
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader />
      <PageInfo
        text={paymentPageContent.pageInfoTitle}
        userName={""}
        className="bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />

      <section className="flex flex-1 flex-col px-6 pt-8 pb-6">
          <h1 className="mb-6 text-2xl font-bold text-white">
            {paymentPageContent.pageTitle}
          </h1>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                selected={selectedPayment === method.id}
                onClick={() => handleSelectPayment(method.id)}
              />
            ))}
          </div>

          {showPaymentDetails && (
            <div key={selectedPayment} className="payment-reveal">
              <div className="mt-6 flex items-center gap-4 text-white">
                <div className="h-1 w-20 bg-[rgba(0,19,12,0.65)]" />
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-[#7CFF45]" strokeWidth={3} />
                  <span className="text-sm font-bold leading-none">
                    {paymentPageContent.secureMessage}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-black/40 p-4">
                {selectedPayment === "card" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-white">
                      {paymentPageContent.card.cardNumberLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        paymentPageContent.card.cardNumberPlaceholder
                      }
                      className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-white">
                          {paymentPageContent.card.expiryLabel}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            paymentPageContent.card.expiryPlaceholder
                          }
                          className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white">
                          {paymentPageContent.card.cvcLabel}
                        </label>
                        <div className="relative">
                          {showCvcHelp && (
                            <div className="absolute -top-20 right-0 z-10 w-48 rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(228,236,245,0.92)_100%)] px-3 py-2.5 text-xs font-semibold leading-relaxed text-slate-700 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                              <div className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-(--brand-green-01)">
                                Kortsikkerhed
                              </div>
                              <p>{paymentPageContent.card.cvcHelpText}</p>
                              <span className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-r border-b border-white/20 bg-[rgb(234,240,246)]" />
                            </div>
                          )}
                          <input
                            type="text"
                            placeholder={paymentPageContent.card.cvcPlaceholder}
                            className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 pr-10 text-white placeholder-white/60"
                          />
                          <button
                            type="button"
                            aria-label={paymentPageContent.card.cvcHelpLabel}
                            onClick={() =>
                              setShowCvcHelp((current) => !current)
                            }
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
                )}

                {selectedPayment === "mobilepay" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-white">
                      {paymentPageContent.mobilePay.phoneLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={
                          paymentPageContent.mobilePay.countryCodePlaceholder
                        }
                        className="w-16 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                      />
                      <input
                        type="text"
                        placeholder={
                          paymentPageContent.mobilePay.phonePlaceholder
                        }
                        className="flex-1 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                      />
                    </div>
                    <div className="flex items-start gap-3 rounded bg-[#4a52a8] px-4 py-3 text-white">
                      <CircleAlert
                        className="mt-0.5 h-5 w-5 shrink-0 text-sky-300"
                        strokeWidth={2.5}
                      />
                      <p className="text-xs font-semibold leading-relaxed">
                        {paymentPageContent.mobilePay.infoText}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                    >
                      <Image
                        src={paymentPageContent.mobilePay.payButtonIcon}
                        alt="MobilePay"
                        width={22}
                        height={22}
                        className="h-5 w-5 object-contain"
                      />
                      {paymentPageContent.mobilePay.payButton}
                    </button>
                  </div>
                )}

                {selectedPayment === "wallet" && (
                  <div className="rounded-md bg-white/8 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-white">
                        {paymentPageContent.wallet.title}
                      </h3>
                    </div>

                    <p className="mb-3 text-[11px] font-semibold leading-tight text-white/80">
                      {paymentPageContent.wallet.description}
                    </p>

                    <label
                      htmlFor="wallet-method"
                      className="mb-1 block text-xs font-bold text-white"
                    >
                      {paymentPageContent.wallet.methodLabel}
                    </label>
                    <div className="relative mb-3">
                      <select
                        id="wallet-method"
                        value={walletMethod}
                        onChange={(event) =>
                          setWalletMethod(
                            event.target.value as "apple" | "google",
                          )
                        }
                        className="h-10 w-full appearance-none rounded border border-white/25 bg-white/8 px-2.5 pr-8 text-base font-bold text-white"
                      >
                        {paymentPageContent.wallet.methods.map((method) => (
                          <option
                            key={method.value}
                            value={method.value}
                            className="text-black"
                          >
                            {method.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg font-bold text-white">
                        ▾
                      </span>
                    </div>

                    <label className="mb-1 block text-xs font-bold text-white">
                      {paymentPageContent.wallet.amountLabel}
                    </label>
                    <div className="mb-3 flex h-10 items-center justify-end rounded border border-white/25 bg-white/8 px-3">
                      <span className="text-[30px] font-bold text-(--brand-green-01)">
                        {selectedPlanAmount}
                      </span>
                    </div>

                    <p className="mb-3 flex items-start gap-1.5 text-[10px] font-semibold leading-tight text-white/70">
                      <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
                      {paymentPageContent.wallet.consentText}
                    </p>

                    <button
                      type="button"
                      className="flex h-10 w-full items-center justify-center overflow-hidden rounded border border-sky-500 bg-white px-3 text-lg font-bold text-black"
                    >
                      {selectedWalletMethod && (
                        <Image
                          src={selectedWalletMethod.logo}
                          alt={selectedWalletMethod.label}
                          width={260}
                          height={260}
                          className={selectedWalletMethod.imageClassName}
                        />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto flex pb-5 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-(--color-grey-01) px-4 py-1 font-bold text-2xl text-white transition hover:opacity-90 [clip-path:polygon(0_0,100%_0,83%_100%,0_100%)]"
            >
              {paymentPageContent.buttons.back}
            </button>

            <button
              type="button"
              disabled={!hasSelectedRoute}
              onClick={handleContinue}
              className="flex-1 bg-(--brand-green-01) px-4 py-1 font-bold text-2xl text-white transition disabled:cursor-not-allowed disabled:opacity-50 [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]"
            >
              {paymentPageContent.buttons.continue}
            </button>
          </div>
        </section>
    </div>
  );
}