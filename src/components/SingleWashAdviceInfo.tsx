"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

import { singleWashAdviceContent } from "@/data/singleWashData";

export default function SingleWashAdviceInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  const activeItem = singleWashAdviceContent.items[activeIndex];
  const isLastItem = activeIndex === singleWashAdviceContent.items.length - 1;

  useEffect(() => {
    setModalRoot(document.querySelector(".app-screen"));
  }, []);

  function handleClose() {
    setIsOpen(false);
    setActiveIndex(0);
  }

  function handleContinue() {
    if (isLastItem) {
      handleClose();
      return;
    }

    setActiveIndex((current) => current + 1);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={singleWashAdviceContent.openLabel}
        className="absolute right-7 top-9 flex h-12 w-12 items-center justify-center rounded-full bg-[#59da25] text-[#6f7680] shadow-[0_10px_20px_rgba(0,0,0,0.18)] transition active:scale-95"
      >
        <Info className="h-7 w-7" strokeWidth={3} />
      </button>

      {isOpen && modalRoot
        ? createPortal(
            <>
              <div
                className="wash-advice-backdrop absolute inset-0 z-40 bg-black/55"
                onClick={handleClose}
              />

              <div className="absolute inset-0 z-50 flex items-center justify-center px-5">
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="wash-advice-title"
                  className="wash-advice-card relative w-full max-w-85 rounded-3xl bg-white px-5 pt-3 pb-5 text-center text-black shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label={singleWashAdviceContent.closeLabel}
                    className="absolute right-3 top-3 text-[#ff5b31] transition active:scale-95"
                  >
                    <X className="h-6 w-6" strokeWidth={2.75} />
                  </button>

                  <div className="space-y-0.5 pt-1">
                    <h2
                      id="wash-advice-title"
                      className="text-[1.05rem] font-extrabold leading-none"
                    >
                      {singleWashAdviceContent.title}
                    </h2>
                    <p className="text-[1rem] font-extrabold leading-none">
                      {singleWashAdviceContent.rememberLabel}
                    </p>
                  </div>

                  <div className="relative mx-auto mt-3 w-full max-w-45 border-2 border-black/55 bg-white">
                    <Image
                      src={activeItem.image}
                      alt={activeItem.alt}
                      width={180}
                      height={104}
                      className="h-auto w-full object-cover"
                      priority
                    />
                  </div>

                  <p className="mt-3 text-[0.95rem] font-extrabold leading-tight">
                    {activeItem.title}
                  </p>

                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="min-w-31 bg-(--brand-green-01) px-6 py-1.5 text-[1.05rem] font-extrabold text-white shadow-[0_6px_12px_rgba(0,0,0,0.16)] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
                    >
                      {isLastItem
                        ? singleWashAdviceContent.closeLabel
                        : singleWashAdviceContent.continueLabel}
                    </button>
                  </div>
                </div>
              </div>
            </>,
            modalRoot,
          )
        : null}
    </>
  );
}
