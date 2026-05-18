"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
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
} from "lucide-react";
import {
  profileBadges,
  profileMenuItems,
  profilePageNames,
  profileStamps,
  profileUser,
} from "@/data/profileData";

const menuItemIcons = {
  sparkles: <Sparkles size={20} />,
  calendar: <Calendar size={20} />,
  "credit-card": <CreditCard size={20} />,
  bell: <Bell size={20} />,
  "question-mark": <HelpCircle size={20} />,
};

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showBadges, setShowBadges] = useState(false);
  const [activeBadgeId, setActiveBadgeId] = useState<number | null>(null);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
  const [updatedMessagePhase, setUpdatedMessagePhase] = useState<
    "idle" | "pre-enter" | "enter" | "exit"
  >("idle");
  const revealBadges = () => setShowBadges(true);
  const badges = profileBadges;
  const activeBadge =
    badges.find((badge) => badge.id === activeBadgeId) || null;

  useEffect(() => {
    if (searchParams.get("updated") !== "1") {
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
  }, [router, searchParams]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]">
      <AppHeader />

      <main className="relative flex flex-1 flex-col overflow-y-auto pb-4 scrollbar-hide">
        {showUpdatedMessage ? (
          <div
            className={`profile-update-toast pointer-events-none absolute right-4 top-4 z-20 max-w-52 rounded-xl bg-white/96 px-4 py-2 text-right text-[0.82rem] font-extrabold text-(--brand-green-01) shadow-[0_12px_24px_rgba(0,0,0,0.16)] ${updatedMessagePhase === "enter" ? "profile-update-toast-enter" : ""} ${updatedMessagePhase === "exit" ? "profile-update-toast-exit" : ""}`}
          >
            {profilePageNames.updatedMessage}
          </div>
        ) : null}

        <PageInfo
          text={profilePageNames.title}
          userName={profileUser.userName}
        />

        <section className="space-y-4 p-4 pt-4">
          {/* Abonnement — øverst, ingen titel, alt inde i kortet */}
          <article className="overflow-hidden rounded bg-(--white-white) shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-500">
                  Nuværende plan
                </p>
                <p className="text-lg font-bold text-natural-800">
                  {profileUser.subscription ?? "Premium"}
                </p>
                {profileUser.subscriptionRenewal && (
                  <p className="mt-0.5 text-xs font-semibold text-neutral-400">
                    Fornyes d. {profileUser.subscriptionRenewal}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  Aktiv
                </span>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/abonnement")}
                  className="text-xs font-bold text-(--brand-green-01) underline underline-offset-2"
                >
                  Skift plan
                </button>
              </div>
            </div>
          </article>

          {/* Bruger-kort */}
          <article className="overflow-hidden rounded bg-(--white-white) shadow-2xl">
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
                  {profileUser.userName}
                </h2>
                <p className="mt-0.5 text-sm font-semibold text-natural-500">
                  {profileUser.email}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-natural-500">
                  {profileUser.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-200">
              <p className="flex px-4 py-3 text-xs font-semibold items-center text-neutral-500">
                {profilePageNames.memberSinceLabel} {profileUser.memberSince}
              </p>
              <button
                type="button"
                onClick={() =>
                  (window.location.href = "/profile/updateprofile")
                }
                className="h-11 min-w-45 bg-(--brand-green-01) px-5 text-xl font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
              >
                {profilePageNames.editProfile}
              </button>
            </div>
          </article>

          {/* Klippekort */}
          <article className="overflow-hidden rounded bg-(--white-white) shadow-2xl">
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
            <div className="flex justify-end">
              <div className="bg-(--brand-green-01) px-4 py-2 text-sm font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]">
                {profilePageNames.clipCardProgress}
              </div>
            </div>
          </article>

          {/* Badges */}
          <article className="rounded bg-(--white-white) px-4 py-3 shadow-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                <Star size={16} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-natural-800">
                  {profilePageNames.badgesTitle}
                </h2>
                <p className="text-xs font-semibold text-natural-500">
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
          <article className="overflow-hidden rounded bg-(--white-white) shadow-md">
            {profileMenuItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => (window.location.href = `${item.href}`)}
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
            onClick={() => (window.location.href = "/login")}
            className="mx-auto block w-[78%] rounded-lg bg-white py-2.5 text-xl font-bold text-red-500 shadow-md"
          >
            {profilePageNames.logout}
          </button>

          <button
            type="button"
            className="mx-auto block w-[78%] rounded-lg bg-red-600 py-2.5 text-xl font-bold text-white shadow-md"
          >
            {profilePageNames.deleteAccount}
          </button>
        </section>
      </main>
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
