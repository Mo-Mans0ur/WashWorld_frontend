"use client";

// ProfilePage – brugerens profilside.
// Viser abonnementskort, brugerkort, klippekort, badges og genvejsmenupunkter.
//
// Abonnementer hentes fra API'et ved mount (kun aktive vises, eller første hvis ingen er "aktiv").
// Toast-besked vises kortvarigt når brugeren vender tilbage fra updateprofile med ?updated=1.
// Opsigelsesbekræftelse håndteres med en inline modal der kalder deleteSubscription().

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import Image from "next/image";
import {
  Sparkles,
  Calendar,
  CreditCard,
  Bell,
  HelpCircle,
  Ticket,
  Star,
  ChevronRight,
  MoreVertical,
  ArrowLeftRight,
  XCircle,
} from "lucide-react";
import {
  profileBadges,
  profileMenuItems,
  profilePageNames,
  profileStamps,
} from "@/data/profileData";
import { useAuth } from "@/context/AuthContext";
import { fetchSubscriptions, deleteSubscription } from "@/lib/subscriptionsApi";
import type { Subscription } from "@/types/api";

const menuItemIcons = {
  sparkles: <Sparkles size={20} />,
  calendar: <Calendar size={20} />,
  "credit-card": <CreditCard size={20} />,
  bell: <Bell size={20} />,
  "question-mark": <HelpCircle size={20} />,
};

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
  const { user, logout } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const [activeBadgeId, setActiveBadgeId] = useState<number | null>(null);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
  const [updatedMessagePhase, setUpdatedMessagePhase] = useState<
    "idle" | "pre-enter" | "enter" | "exit"
  >("idle");
  const [subscriptionMenuOpen, setSubscriptionMenuOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const subscriptionMenuRef = useRef<HTMLDivElement>(null);

  // Hent abonnementer når brugeren er klar. Vi viser det aktive abonnement,
  // eller det første i listen hvis ingen har status "aktiv".
  useEffect(() => {
    if (!user) return;
    fetchSubscriptions()
      .then((subs) => setSubscription(subs.find((s) => s.subscriptions_status === "aktiv") ?? subs[0] ?? null))
      .catch(() => {});
  }, [user]);

  // Luk abonnements-dropdown-menuen når brugeren klikker uden for den
  useEffect(() => {
    if (!subscriptionMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        subscriptionMenuRef.current &&
        !subscriptionMenuRef.current.contains(e.target as Node)
      ) {
        setSubscriptionMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [subscriptionMenuOpen]);
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
      router.replace("/profile");
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
          userName={user ? `${user.user_firstname} ${user.user_lastname}` : ""}
        />

        <section className="space-y-4 p-4 pt-4">
          {/* Abonnement — øverst, ingen titel, alt inde i kortet */}
          <article className="relative rounded-[3px] bg-(--white-white) shadow-2xl">
            {subscription ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-600">
                    Nuværende plan
                  </p>
                  <p className="text-lg font-bold text-natural-800">
                    {subscription.subscriptions_name}
                  </p>
                  {subscription.subscriptions_next_billing_date && (
                    <p className="mt-0.5 text-xs font-semibold text-neutral-600">
                      Fornyes d. {formatRenewalDate(subscription.subscriptions_next_billing_date)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    Aktiv
                  </span>
                  <div ref={subscriptionMenuRef} className="relative">
                    <button
                      type="button"
                      aria-label="Abonnement muligheder"
                      onClick={() => setSubscriptionMenuOpen((v) => !v)}
                      className="flex h-8 w-8 items-center justify-center text-neutral-500"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {subscriptionMenuOpen && (
                      <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/10">
                        <button
                          type="button"
                          onClick={() => {
                            setSubscriptionMenuOpen(false);
                            router.push("/abonnement");
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                        >
                          <ArrowLeftRight size={15} className="text-(--brand-green-01)" />
                          Skift abonnement
                        </button>
                        <div className="h-px bg-neutral-200" />
                        <button
                          type="button"
                          onClick={() => {
                            setSubscriptionMenuOpen(false);
                            setShowCancelConfirm(true);
                          }}
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
            ) : (
              <>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-neutral-600">Nuværende plan</p>
                  <p className="text-lg font-bold text-neutral-400">Intet abonnement</p>
                </div>
                <div className="flex items-center justify-end border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => router.push("/abonnement")}
                    className="h-11 min-w-45 bg-(--brand-green-01) px-5 text-xl font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
                  >
                    Tilføj
                  </button>
                </div>
              </>
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
                  {user ? `${user.user_firstname} ${user.user_lastname}` : "—"}
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
              <button
                type="button"
                onClick={() => router.push("/profile/updateprofile")}
                className="h-11 min-w-45 bg-(--brand-green-01) px-5 text-xl font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
              >
                {profilePageNames.editProfile}
              </button>
            </div>
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

          {/* Menu-punkter */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-md">
            {profileMenuItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => router.push(item.href)}
                className="flex w-full items-center border-b border-neutral-200 px-4 py-2.5 text-left last:border-b-0"
              >
                <span className="flex items-center gap-2.5 text-sm font-bold text-neutral-800">
                  <span className="text-(--brand-green-01)">
                    {menuItemIcons[item.iconKey]}
                  </span>
                  {item.label}
                </span>
                <span className="ml-auto text-(--brand-green-01)">
                  <ChevronRight size={20} />
                </span>
              </button>
            ))}
          </article>

          {/* Knapper */}
          <button
            type="button"
            onClick={logout}
            className="mx-auto block w-[78%] rounded-[3px] bg-white py-2.5 text-xl font-bold text-red-500 shadow-md"
          >
            {profilePageNames.logout}
          </button>

          <button
            type="button"
            className="mx-auto block w-[78%] rounded-[3px] bg-red-600 py-2.5 text-xl font-bold text-white shadow-md"
          >
            {profilePageNames.deleteAccount}
          </button>
        </section>
      </main>

      {showCancelConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm rounded-[3px] bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-neutral-800">Opsig abonnement?</h2>
            <p className="mt-2 text-sm font-semibold text-neutral-600">
              Er du sikker på, at du vil opsige dit abonnement? Det udløber ved
              næste fornyelsesdato.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-sm font-bold text-neutral-700"
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (subscription) {
                    await deleteSubscription(subscription.subscription_id).catch(() => {});
                    setSubscription(null);
                  }
                  setShowCancelConfirm(false);
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
