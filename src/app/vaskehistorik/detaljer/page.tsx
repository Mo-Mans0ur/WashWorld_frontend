"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import PageInfo from "@/components/PageInfo";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  LifebuoyIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
  getReceiptById,
  receiptHistory,
  receiptActionNames,
  receiptDetailFieldNames,
  receiptPageNames,
} from "@/data/receiptHistory";

const receiptActionIcons = {
  "Download Kvittering": <ArrowDownTrayIcon className="h-5 w-5" />,
  "Send til email": <EnvelopeIcon className="h-5 w-5" />,
  "Kontakt support": <LifebuoyIcon className="h-5 w-5" />,
};

export default function VaskehistorikDetaljer() {
  const searchParams = useSearchParams();
  const receiptId = Number(searchParams.get("id"));
  const [receipt, setReceipt] = useState(
    getReceiptById(receiptId || receiptHistory[0].id),
  );

  useEffect(() => {
    setReceipt(getReceiptById(receiptId || receiptHistory[0].id));
  }, [receiptId]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-4 px-5 py-4">
          <article className="rounded-[3px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-neutral-400 bg-white">
                <Image
                  src={receipt.image}
                  alt={receipt.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-[15px] font-bold text-neutral-950">
                    {receipt.title}
                  </h1>
                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${receipt.statusClass}`}
                  >
                    {receipt.status}
                  </span>
                </div>

                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <MapPinIcon className="h-3 w-3 shrink-0 text-neutral-300" />
                    <span className="truncate">{receipt.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <CalendarDaysIcon className="h-3 w-3 shrink-0 text-neutral-300" />
                    <span>{receipt.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <ClockIcon className="h-3 w-3 shrink-0 text-neutral-300" />
                    <span>{receipt.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 h-px bg-neutral-200" />

            <div className="mt-4 flex h-10 w-fit overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
              <span className="flex w-6 items-center justify-center bg-[#327fc2]" />
              <span className="flex items-center px-3 text-[15px] font-bold tracking-[0.08em]">
                {receipt.plate}
              </span>
            </div>

            <section className="mt-5">
              <h2 className="text-[13px] font-bold text-neutral-900">
                {receiptPageNames.detailsSection}
              </h2>
              <div className="mt-2 h-px bg-neutral-200" />

              <dl className="space-y-2 pt-4 text-[13px] text-neutral-600">
                {receiptDetailFieldNames.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt>{field.name}</dt>
                    <dd className="text-right text-neutral-700">
                      {receipt[field.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-5">
              <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
                <CurrencyDollarIcon className="h-4 w-4 text-(--brand-green-01)" />
                <h2>{receiptPageNames.priceOverview}</h2>
              </div>
              <div className="mt-2 h-px bg-neutral-200" />

              <div className="flex items-center justify-between gap-3 py-4 text-[13px] text-neutral-700">
                <p>{receiptPageNames.washLine}</p>
                <p>{receipt.summaryLabel}</p>
                <p>{receipt.summaryValue}</p>
              </div>
            </section>

            <div className="mt-16 h-px bg-neutral-200" />

            <div className="flex items-center justify-between pt-4">
              <p className="text-2xl font-bold text-neutral-950">
                {receiptPageNames.totalLabel}
              </p>
              <p className="text-2xl font-bold text-(--brand-green-01)">
                {receipt.amount}
              </p>
            </div>
          </article>

          <article className="rounded-[3px] bg-white px-4 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            {receiptActionNames.map((action, index) => (
              <button
                key={action}
                type="button"
                className={`flex w-full items-center gap-3 py-3 text-left text-[13px] font-bold text-neutral-950 ${
                  index < receiptActionNames.length - 1
                    ? "border-b border-neutral-100"
                    : ""
                }`}
              >
                <span className="text-(--brand-green-01)">
                  {receiptActionIcons[action]}
                </span>
                <span>{action}</span>
                <span className="ml-auto text-(--brand-green-01)">
                  <ChevronRightIcon className="h-5 w-5" />
                </span>
              </button>
            ))}
          </article>
        </main>
      </div>
    </div>
  );
}
