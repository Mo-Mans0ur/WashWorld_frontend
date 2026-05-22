"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import { paymentOptions, paymentPageContent } from "@/data/paymentData";
import { paymentPlans } from "@/data/singleWashData";
import { SAVED_PAYMENT_CARD_STORAGE_KEY } from "@/data/profileData";
import ContinueButton from "@/components/ContinueButton";
import { CircleAlert, CircleHelp, Lock } from "lucide-react";
import { ROUTES } from "@/lib/routes";

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
  const storedPaymentCard = getStoredPaymentCard();
  const saveCardOnly = searchParams.get("saveCard") === "true";
  const [selectedPayment, setSelectedPayment] = useState<string | null>(
    saveCardOnly ? "card" : null,
  );
  const [walletMethod, setWalletMethod] = useState<"apple" | "google">("apple");
  const [showCvcHelp, setShowCvcHelp] = useState(false);
  const [cardNumber, setCardNumber] = useState(
    storedPaymentCard?.cardNumber ?? "",
  );
  const [expiry, setExpiry] = useState(storedPaymentCard?.expiry ?? "");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState(
    storedPaymentCard?.name ?? "",
  );
  const [rememberCard, setRememberCard] = useState(
    saveCardOnly || storedPaymentCard !== null,
  );
  const selectedPlan = searchParams.get("plan") ?? "guld";
  const prefilledPlate = searchParams.get("plate") ?? undefined;
  const carId = searchParams.get("carId") ?? undefined;
  const locationId = searchParams.get("location") ?? undefined;
  const equipmentId = searchParams.get("equipment") ?? undefined;
  const selectedPlanDetails =
    paymentPlans.find((plan) => plan.slug === selectedPlan) ?? paymentPlans[0];
  const selectedPlanAmount = selectedPlanDetails.price.replace("kr.", " kr");
  const selectedWalletMethod = paymentPageContent.wallet.methods.find(
    (method) => method.value === walletMethod,
  );
  const cardIsValid =
    selectedPayment === "card" &&
    cardNumber.replace(/\s/g, "").length >= 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvc.length >= 3 &&
    cardholderName.trim().length > 0;
  const hasSelectedRoute =
    selectedPayment !== null &&
    selectedPayment !== "contactless" &&
    (selectedPayment !== "card" || cardIsValid);
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

    if (selectedPayment === "card") {
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
    }

    if (saveCardOnly) {
      router.push(ROUTES.profile);
      return;
    }

    router.push(ROUTES.startWash(selectedPlan, selectedPayment, prefilledPlate ?? "", carId, locationId, equipmentId));
  }

  return (
    <div className="flex min-h-full flex-col">
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
          {(saveCardOnly ? paymentMethods.filter((m) => m.id !== "contactless") : paymentMethods).map((method) => (
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
                    inputMode="numeric"
                    placeholder={paymentPageContent.card.cardNumberPlaceholder}
                    value={cardNumber}
                    maxLength={19}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-white">
                        {paymentPageContent.card.expiryLabel}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={paymentPageContent.card.expiryPlaceholder}
                        value={expiry}
                        maxLength={5}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                          setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                        }}
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
                            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--brand-green-01)">
                              Kortsikkerhed
                            </div>
                            <p>{paymentPageContent.card.cvcHelpText}</p>
                            <span className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-r border-b border-white/20 bg-[rgb(234,240,246)]" />
                          </div>
                        )}
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder={paymentPageContent.card.cvcPlaceholder}
                          value={cvc}
                          maxLength={4}
                          onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
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
                      onChange={(event) =>
                        setRememberCard(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-white/40 accent-(--brand-green-01)"
                    />
                    <span className="text-sm font-bold leading-none">
                      {paymentPageContent.card.rememberCardLabel}
                    </span>
                  </label>
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
                    <h3 className="text-xl font-bold text-white">
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

        <div className="mt-auto pb-5 pt-4">
          <ContinueButton onClick={handleContinue} disabled={!hasSelectedRoute}>
            {saveCardOnly
              ? selectedPayment === "card"
                ? "Gem kort"
                : "Vælg metode"
              : paymentPageContent.buttons.continue}
          </ContinueButton>
        </div>
      </section>
    </div>
  );
}
