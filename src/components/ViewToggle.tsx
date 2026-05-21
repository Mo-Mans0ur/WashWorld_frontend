"use client";

import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const isMap = pathname === ROUTES.map;

  return (
    <div className="flex h-9 items-stretch drop-shadow-md">
      <button
        type="button"
        onClick={() => router.push(ROUTES.map)}
        className={`relative z-10 flex items-center justify-center pl-4 pr-6 text-sm font-bold transition-colors [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] ${
          isMap
            ? "bg-(--brand-green-01) text-white"
            : "bg-white text-neutral-600"
        }`}
      >
        Kort
      </button>
      <button
        type="button"
        onClick={() => router.push(ROUTES.locationList)}
        className={`relative -ml-2 flex items-center justify-center pl-5 pr-4 text-sm font-bold transition-colors [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)] ${
          !isMap
            ? "bg-(--brand-green-01) text-white"
            : "bg-white text-neutral-600"
        }`}
      >
        Liste
      </button>
    </div>
  );
}
