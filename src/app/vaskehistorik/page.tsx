"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PageInfo from "@/components/PageInfo";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/solid";
import {
  getReceiptHistoryItems,
  receiptHistory,
  receiptPageNames,
} from "@/data/receiptHistory";
import { ROUTES } from "@/lib/routes";

export default function Vaskehistorik() {
  const [receipts, setReceipts] = useState(receiptHistory);

  useEffect(() => {
    setReceipts(getReceiptHistoryItems());
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.historyTitle} userName={""} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-3 px-5 py-4">
          {receipts.map((receipt) => (
            <article
              key={receipt.id}
              className="relative w-full overflow-hidden rounded-[3px] bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start gap-3 px-3 pb-2 pt-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white">
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
                    <div className="min-w-0 pr-2">
                      <h3 className="text-[15px] font-bold text-neutral-950">
                        {receipt.title}
                      </h3>

                      <div className="mt-1.5 space-y-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-600">
                          <MapPinIcon className="h-3 w-3 shrink-0 text-neutral-500" />
                          <span className="truncate">{receipt.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-600">
                          <CalendarDaysIcon className="h-3 w-3 shrink-0 text-neutral-500" />
                          <span>
                            {receipt.date} · {receipt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${receipt.statusClass}`}
                      >
                        {receipt.status}
                      </span>
                      <p className="text-[18px] font-bold text-neutral-950">
                        {receipt.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-neutral-200" />

              <div className="flex items-end justify-between gap-3 px-3 pb-3 pt-3 pr-36">
                <div className="flex h-10 overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
                  <span className="flex w-6 items-center justify-center bg-[#327fc2]" />
                  <span className="flex items-center px-3 text-[15px] font-bold tracking-[0.08em]">
                    {receipt.plate}
                  </span>
                </div>
              </div>

              <Link
                href={`${ROUTES.washHistoryDetails}?id=${receipt.id}`}
                className="absolute bottom-0 right-0 inline-flex h-10 items-center bg-(--brand-green-01) px-4 text-sm font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
              >
                {receiptPageNames.detailButton}
              </Link>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
