"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppNav from "@/components/Appnav";
import AppHeader from "@/components/AppHeader";

export default function ScreenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavRoutes = new Set(["/login", "/signup", "/505", "/not-found"]);
  const showNav = !hideNavRoutes.has(pathname);

  return (
    <main className="app-shell">
      <section className="app-screen relative flex min-h-0 flex-col overflow-hidden">
        {showNav && <AppHeader />}
        <div className={`min-h-0 flex-1 overflow-y-auto ${showNav ? "pb-16" : ""}`}>
          {children}
        </div>
        {showNav && <AppNav />}
      </section>
    </main>
  );
}
