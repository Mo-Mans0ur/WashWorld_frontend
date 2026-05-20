"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";

export default function AssistanceButton({ iconColor = "white", washId }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="flex h-11.75 w-full max-w-143.75 items-center justify-center gap-4 bg-(--color-danger) px-8 [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)]"
      >
        <span className="text-xl font-bold tracking-widest text-white">
          HJÆLP
        </span>
        <Phone size={22} color={iconColor} strokeWidth={2.5} />
      </button>

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative mx-5 w-full max-w-sm rounded-[3px] bg-white px-6 py-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
              aria-label="Luk"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Phone size={22} className="text-(--color-danger)" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Ring til hjælp?</h2>
              <p className="text-sm text-neutral-500">
                Du er ved at ringe til WashWorld support
              </p>
              {washId && (
                <span className="mt-1 rounded-[3px] bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                  ID: {washId}
                </span>
              )}
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="flex flex-1 h-12 items-center justify-center bg-neutral-500 font-bold text-white text-sm [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
              >
                Annuller
              </button>
              <a
                href="tel:+4570707070"
                className="flex flex-1 h-12 items-center justify-center bg-(--color-danger) font-bold text-white text-sm [clip-path:polygon(12%_0,100%_0,100%_100%,0%_100%)]"
              >
                Ring til hjælp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
