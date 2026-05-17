"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppNav from "@/components/Appnav";

export default function ScreenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavRoutes = new Set(["/login", "/signup", "/505", "/not-found"]);
  const showNav = !hideNavRoutes.has(pathname);

  return (
    <main
      className="relative flex min-h-dvh w-full flex-col overflow-hidden"
      style={{
        background: `
          linear-gradient(to right, #31854e 0%, rgba(0, 0, 0, 0) 60%),
          linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
          linear-gradient(90deg, var(--color-dashboard-gradient-start) 0%, var(--color-dashboard-gradient-end) 100%)
        `,
      }}
    >
      {children}
      {showNav ? <AppNav /> : null}
    </main>
  );
}
