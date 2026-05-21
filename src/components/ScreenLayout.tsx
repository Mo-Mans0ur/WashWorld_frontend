"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import AppNav from "@/components/Appnav";
import AppHeader from "@/components/AppHeader";

const NavVisibilityContext = createContext({
  setHideNav: (_: boolean) => {},
});

export function useNavVisibility() {
  return useContext(NavVisibilityContext);
}

export default function ScreenLayout({ children }: { children: ReactNode }) {
  const [forcedHideNav, setForcedHideNav] = useState(false);
  const pathname = usePathname();
  const hideNavRoutes = new Set(["/login", "/signup", "/505", "/under-construction", "/"]);
  const showNav = !hideNavRoutes.has(pathname) && !forcedHideNav;

  return (
    <NavVisibilityContext.Provider value={{ setHideNav: setForcedHideNav }}>
      <main className="app-shell">
        <section className="app-screen relative flex min-h-0 flex-col overflow-hidden">
          {showNav && <AppHeader />}
          <div className={`min-h-0 flex-1 overflow-y-auto ${showNav ? "pb-22" : ""}`}>
            {children}
          </div>
          {showNav && <AppNav />}
        </section>
      </main>
    </NavVisibilityContext.Provider>
  );
}
