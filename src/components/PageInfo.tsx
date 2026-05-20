"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ROOT_ROUTES = new Set([
  "/dashboard",
  "/locations/map",
  "/profile",
]);

interface PageInfoProps {
  text?: string;
  userName?: string;
  className?: string;
}

export default function PageInfo({ text = "", userName, className = "" }: PageInfoProps) {
  const pathname = usePathname();
  const router = useRouter();
  const content = text || (userName ? `Hej ${userName}` : "");
  const showBack = !ROOT_ROUTES.has(pathname);

  return (
    <div>
      <section className={`relative h-12 ${className}`}>
        <div className="relative inline-flex h-full min-w-45 items-center bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
          <p className="whitespace-nowrap text-2xl font-bold text-white">
            {content}
          </p>
        </div>
      </section>
      {showBack && (
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white font-semibold"
          >
            <ArrowLeft size={20} />
            Tilbage
          </button>
        </div>
      )}
    </div>
  );
}
