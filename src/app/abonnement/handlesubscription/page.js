"use client";

import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader.jsx";
import BottomNav from "@/components/BottomNav.jsx";

export default function HandleSubscriptionPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "guld";

  return (
    <>
      <AppHeader />
      <section
        className="min-h-[calc(100dvh-88px-112px)]"
        style={{
          background: "linear-gradient(90deg, #75cfa0 0%, #8f9994 100%)",
        }}
      ></section>
      <BottomNav />
    </>
  );
}
