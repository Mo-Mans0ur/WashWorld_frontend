"use client";

// ProfilePage – brugerens profilside.
// Viser abonnementskort, brugerkort, klippekort, badges og genvejsmenupunkter.
//
// Abonnementer hentes fra API'et ved mount (kun aktive vises, eller første hvis ingen er "aktiv").
// Toast-besked vises kortvarigt når brugeren vender tilbage fra updateprofile med ?updated=1.
// Opsigelsesbekræftelse håndteres med en inline modal der kalder deleteSubscription().

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import Image from "next/image";
import {
  Ticket,
  Star,
  MoreVertical,
  ArrowLeftRight,
  XCircle,
  CreditCard,
} from "lucide-react";
import {
  profileBadges,
  profilePageNames,
  profileStamps,
  SAVED_PAYMENT_CARD_STORAGE_KEY,
} from "@/data/profileData";
import { useAuth } from "@/hooks";
import { fetchSubscriptions, deleteSubscription } from "@/lib/subscriptionsApi";
import type { Subscription } from "@/types/api";
import { ROUTES } from "@/lib/routes";

// Formaterer en ISO-dato til dansk månedsnavn + årstal, fx "maj 2024"
function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("da-DK", { month: "long", year: "numeric" });
}

// Formaterer en ISO-dato til kort dansk datoformat, fx "14.05.2025"
function formatRenewalDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("da-DK");
}

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, displayFullName } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showBadges, setShowBadges] = useState(false);
  const [activeBadgeId, setActiveBadgeId] = useState<number | null>(null);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
  const [updatedMessagePhase, setUpdatedMessagePhase] = useState<
    "idle" | "pre-enter" | "enter" | "exit"
  >("idle");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [savedCardNumber, setSavedCardNumber] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
      if (!raw) return null;
      return (JSON.parse(raw) as { cardNumber: string }).cardNumber ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) return;
    fetchSubscriptions()
      .then((subs) => setSubscriptions(subs))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!openMenuId) return;
    function handleClickOutside() { setOpenMenuId(null); }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const revealBadges = () => setShowBadges(true);
  const badges = profileBadges;
  const activeBadge =
    badges.find((badge) => badge.id === activeBadgeId) || null;
  // ?updated=1 sættes af updateprofile-siden efter en vellykket gem.
  // ?updated=preferences bruges hvis det er præferencer der er opdateret.
  const updatedParam = searchParams.get("updated");
  const updatedMessage =
    updatedParam === "preferences"
      ? profilePageNames.preferencesUpdatedMessage
      : profilePageNames.updatedMessage;

  // Viser en kortvarig toast-besked øverst til højre og fjerner ?updated fra URL'en bagefter
  // så beskeden ikke dukker op igen ved en genindlæsning.
  useEffect(() => {
    if (updatedParam !== "1" && updatedParam !== "preferences") {
      return;
    }

    setShowUpdatedMessage(true);
    setUpdatedMessagePhase("pre-enter");

    const enterTimeoutId = window.setTimeout(() => {
      setUpdatedMessagePhase("enter");
    }, 40);

    const closeTimeoutId = window.setTimeout(() => {
      setUpdatedMessagePhase("exit");
    }, 1900);

    const clearTimeoutId = window.setTimeout(() => {
      setShowUpdatedMessage(false);
      setUpdatedMessagePhase("idle");
      router.replace(ROUTES.profile);
    }, 2350);

    return () => {
      window.clearTimeout(enterTimeoutId);
      window.clearTimeout(closeTimeoutId);
      window.clearTimeout(clearTimeoutId);
    };
  }, [router, updatedParam]);

  return (
    <div className="flex h-full flex-col overflow-hidden">

      <main className="relative flex flex-1 flex-col overflow-y-auto pb-4 scrollbar-hide">
        {showUpdatedMessage ? (
          <div
            className={`profile-update-toast pointer-events-none absolute right-4 top-4 z-20 max-w-52 rounded-xl bg-white/96 px-4 py-2 text-right text-[0.82rem] font-bold text-(--brand-green-01) shadow-[0_12px_24px_rgba(0,0,0,0.16)] ${updatedMessagePhase === "enter" ? "profile-update-toast-enter" : ""} ${updatedMessagePhase === "exit" ? "profile-update-toast-exit" : ""}`}
          >
            {updatedMessage}
          </div>
        ) : null}

        <PageInfo
          text={profilePageNames.title}
          userName={displayFullName}
        />

        <section className="space-y-4 p-4 pt-4">
          {/* Abonnementer */}
          <article className="relative rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <p className="text-sm font-semibold text-neutral-600">Abonnementer</p>
              <Link
                href={ROUTES.subscription}
                className="flex h-8 min-w-24 items-center justify-center bg-(--brand-green-01) px-3 text-sm font-bold text-white [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]"
              >
                Tilføj
              </Link>
            </div>

            {subscriptions.length === 0 ? (
              <p className="px-4 py-3 text-sm font-semibold text-neutral-400">Intet abonnement</p>
            ) : (
              <div className="divide-y divide-neutral-200">
                {subscriptions.map((sub) => (
                  <div key={sub.subscription_id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-base font-bold text-neutral-800">{sub.subscriptions_name}</p>
                      {sub.subscriptions_next_billing_date && (
                        <p className="mt-0.5 text-xs font-semibold text-neutral-500">
                          Fornyes d. {formatRenewalDate(sub.subscriptions_next_billing_date)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${sub.subscriptions_status === "aktiv" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"}`}>
                        {sub.subscriptions_status === "aktiv" ? "Aktiv" : sub.subscriptions_status}
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          aria-label="Abonnement muligheder"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === sub.subscription_id ? null : sub.subscription_id); }}
                          className="flex h-8 w-8 items-center justify-center text-neutral-500"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {openMenuId === sub.subscription_id && (
                          <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/10">
                            <Link
                              href={ROUTES.subscription}
                              onClick={() => setOpenMenuId(null)}
                              className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                            >
                              <ArrowLeftRight size={15} className="text-(--brand-green-01)" />
                              Skift abonnement
                            </Link>
                            <div className="h-px bg-neutral-200" />
                            <button
                              type="button"
                              onClick={() => { setOpenMenuId(null); setCancelTarget(sub); }}
                              className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                              <XCircle size={15} />
                              Opsig abonnement
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          {/* Bruger-kort */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--brand-green-01) text-3xl text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.01-8 4.5V21h16v-2.5c0-2.49-3.58-4.5-8-4.5Z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl font-bold text-natural-800">
                  {user ? displayFullName : "—"}
                </h2>
                <p className="mt-0.5 text-sm font-semibold text-neutral-600">
                  {user?.user_email ?? "—"}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-600">
                  {user?.user_phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200">
              <p className="flex px-4 py-3 text-xs font-semibold items-center text-neutral-600">
                {profilePageNames.memberSinceLabel} {user?.user_created_at ? formatMemberSince(user.user_created_at) : "—"}
              </p>
              <Link
                href={ROUTES.updateProfile}
                className="flex h-11 min-w-45 items-center justify-center bg-(--brand-green-01) px-5 text-xl font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
              >
                {profilePageNames.editProfile}
              </Link>
            </div>
          </article>

          {/* Betalingskort */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                  <CreditCard size={16} />
                </span>
                <p className="text-sm font-semibold text-neutral-600">Betalingskort</p>
              </div>
              <Link
                href={ROUTES.savePaymentCard}
                className="flex h-8 min-w-24 items-center justify-center bg-(--brand-green-01) px-3 text-sm font-bold text-white [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]"
              >
                {savedCardNumber ? "Rediger" : "Tilføj"}
              </Link>
            </div>
            {savedCardNumber ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-neutral-400 shrink-0" />
                  <p className="text-sm font-semibold text-neutral-700">
                    **** **** **** {savedCardNumber.replace(/\s/g, "").slice(-4)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.removeItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
                    setSavedCardNumber(null);
                  }}
                  className="text-xs font-bold text-red-500"
                >
                  Fjern
                </button>
              </div>
            ) : (
              <p className="px-4 py-3 text-sm font-semibold text-neutral-400">Intet gemt kort</p>
            )}
          </article>

          {/* Klippekort */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                  <Ticket size={16} />
                </span>
                <h2 className="text-2xl font-bold text-natural-800">
                  {profilePageNames.clipCardTitle}
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                {profileStamps.map((stamp, index) => (
                  <Stamp
                    key={`${stamp.label}-${stamp.filled}-${index}`}
                    filled={stamp.filled}
                  >
                    {stamp.label}
                  </Stamp>
                ))}
              </div>
            </div>
            <div className="flex justify-end border-t border-neutral-200">
              <p className="px-4 py-3 text-xs font-semibold text-neutral-600">
                {profilePageNames.clipCardProgress}
              </p>
            </div>
          </article>

          {/* Badges */}
          <article className="rounded-[3px] bg-(--white-white) px-4 py-3 shadow-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                <Star size={16} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-natural-800">
                  {profilePageNames.badgesTitle}
                </h2>
                <p className="text-xs font-semibold text-neutral-600">
                  {profilePageNames.badgesSubtitle}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-start gap-2">
              {(showBadges ? badges : badges.slice(0, 4)).map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setActiveBadgeId(badge.id)}
                  className="w-14 shrink-0 text-center touch-manipulation"
                  aria-label={`Badge: ${badge.label}`}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center">
                    <Image
                      src={
                        badge.achieved
                          ? badge.image
                          : badge.lockedImage || badge.image
                      }
                      alt={badge.label}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </button>
              ))}
              {!showBadges && badges.length > 4 && (
                <button
                  type="button"
                  onClick={revealBadges}
                  onPointerUp={revealBadges}
                  aria-label={`Vis ${badges.length - 4} flere badges`}
                  className="relative z-10 flex h-20 w-14 shrink-0 touch-manipulation flex-col items-center justify-start"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-xs font-bold text-(--brand-green-01)">
                    +{badges.length - 4}
                  </div>
                  <p className="mt-1 text-[10px] leading-tight font-semibold text-neutral-700">
                    {profilePageNames.showAll}
                  </p>
                </button>
              )}
            </div>
            <div className="mt-2 min-h-11 rounded-md bg-neutral-100 px-2 py-1.5 text-center">
              {activeBadge ? (
                <>
                  <p className="text-xs font-bold text-neutral-800">
                    {activeBadge.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug font-semibold text-neutral-600">
                    {activeBadge.description}
                  </p>
                </>
              ) : (
                <p className="text-xs font-semibold text-neutral-700">
                  {profilePageNames.activeBadgeHint}
                </p>
              )}
            </div>
          </article>

          {/* Knapper */}
          <button
            type="button"
            onClick={logout}
            className="mx-auto block w-[78%] rounded-[3px] bg-white py-2.5 text-xl font-bold text-red-500 shadow-md"
          >
            {profilePageNames.logout}
          </button>


        </section>
      </main>

      {cancelTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-[3px] bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-neutral-800">Opsig abonnement?</h2>
            <p className="mt-2 text-sm font-semibold text-neutral-600">
              Er du sikker på, at du vil opsige <span className="font-bold text-neutral-800">{cancelTarget.subscriptions_name}</span>? Det udløber ved næste fornyelsesdato.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-sm font-bold text-neutral-700"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteSubscription(cancelTarget.subscription_id).catch(() => {});
                  setSubscriptions((prev) => prev.filter((s) => s.subscription_id !== cancelTarget.subscription_id));
                  setCancelTarget(null);
                }}
                className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white"
              >
                Opsig
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stamp({
  filled = false,
  children,
}: {
  filled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg text-white font-bold ${
        filled
          ? "border-emerald-400 bg-emerald-500 text-white"
          : "border-neutral-500 bg-neutral-400 text-neutral-700 border-dashed"
      }`}
    >
      {children}
    </div>
  );
}
