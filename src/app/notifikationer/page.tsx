"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";

import AppHeader from "@/components/AppHeader";
import PageInfo from "@/components/PageInfo";
import {
  notificationPageContent,
  notificationSettings,
} from "@/data/notificationData";

type SettingsState = Record<string, boolean>;

export default function NotifikationerPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>(() =>
    Object.fromEntries(
      notificationSettings.map((item) => [item.id, item.enabled]),
    ),
  );

  const allEnabled = useMemo(
    () => Object.values(settings).every(Boolean),
    [settings],
  );

  function toggleSetting(settingId: string) {
    setSettings((current) => ({
      ...current,
      [settingId]: !current[settingId],
    }));
  }

  function toggleAll() {
    const nextValue = !allEnabled;

    setSettings(
      Object.fromEntries(
        notificationSettings.map((item) => [item.id, nextValue]),
      ),
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[linear-gradient(135deg,#8ed7bb_0%,#909694_100%)]">
      <AppHeader />
      <PageInfo text={notificationPageContent.pageInfoTitle} userName="" />

      <main className="flex-1 overflow-y-auto scrollbar-hide bg-[linear-gradient(135deg,#8ed7bb_0%,#909694_100%)] px-5 pb-6 pt-4">
        <section className="rounded-2xl bg-white px-4 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
              <Bell className="h-6 w-6" strokeWidth={2.5} />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-[1.15rem] font-bold text-[#101010]">
                {notificationPageContent.title}
              </h1>
              <p className="mt-1 text-[0.85rem] leading-snug text-[#6c6c6c]">
                {notificationPageContent.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#f6f8f7] px-4 py-3">
            <div>
              <p className="text-[0.92rem] font-bold text-[#1d1d1d]">
                {notificationPageContent.masterToggleLabel}
              </p>
              <p className="mt-0.5 text-[0.78rem] leading-snug text-[#7a7a7a]">
                {notificationPageContent.masterToggleDescription}
              </p>
            </div>

            <ToggleSwitch
              enabled={allEnabled}
              onToggle={toggleAll}
              label={notificationPageContent.masterToggleLabel}
            />
          </div>
        </section>

        <section className="mt-4 space-y-3">
          {notificationSettings.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white px-4 py-3 shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.accent === "orange" ? "bg-[#ff8a00]" : "bg-(--brand-green-01)"}`}
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-[1rem] font-bold text-[#111]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-[0.8rem] leading-snug text-[#747474]">
                    {item.description}
                  </p>
                </div>

                <ToggleSwitch
                  enabled={settings[item.id]}
                  onToggle={() => toggleSetting(item.id)}
                  label={item.title}
                />
              </div>
            </article>
          ))}
        </section>

        <button
          type="button"
          onClick={() => router.push("/profile?updated=preferences")}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 bg-(--brand-green-01) text-[1rem] font-bold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]"
        >
          <Check className="h-4.5 w-4.5" strokeWidth={3} />
          {notificationPageContent.saveButton}
        </button>
      </main>
    </div>
  );
}

function ToggleSwitch({
  enabled,
  onToggle,
  label = "Notifikation",
}: {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative flex h-7 w-12 shrink-0 items-center rounded-full px-1 transition ${enabled ? "bg-(--brand-green-01)" : "bg-[#d0d5d2]"}`}
      title={label}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
