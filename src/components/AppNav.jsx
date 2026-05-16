"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  MapPin,
  User,
  Menu,
  X,
  Car,
  CreditCard,
  BadgeCheck,
  LifeBuoy,
  ChevronRight,
} from "lucide-react";

export default function AppNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const subMenuItems = [
    { label: "Biler", href: "/biler", icon: Car },
    { label: "Betalingsmetode", href: "/betaling", icon: CreditCard },
    { label: "Abonnement", href: "/abonnement", icon: BadgeCheck },
    { label: "Hjælp", href: "/hjaelp", icon: LifeBuoy },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`absolute inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Lodret sidebar */}
      <div
        className={`absolute inset-y-0 right-0 z-50 w-64 bg-(--color-black) shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-8 pb-5 border-b border-white/10">
          <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Menu-punkter */}
        <nav className="flex flex-col px-3 pt-3 gap-0.5">
          {subMenuItems.map(({ label, href, icon: Icon }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all group"
              style={{
                transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms",
                transform: menuOpen ? "translateX(0)" : "translateX(16px)",
                opacity: menuOpen ? 1 : 0,
                transition: `color 0.2s, background 0.2s, transform 0.3s ease ${
                  80 + i * 50
                }ms, opacity 0.3s ease ${80 + i * 50}ms`,
              }}
            >
              <Icon size={18} className="text-white/50 group-hover:text-white transition-colors" />
              <span className="text-[0.95rem] font-semibold">{label}</span>
              <ChevronRight
                size={14}
                className="ml-auto text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          ))}
        </nav>
      </div>

      {/* Bundnavigation */}
      <nav className="flex h-28 w-full shrink-0 items-center justify-around bg-(--color-black) text-white">
        <NavItem href="/dashboard" label="Hjem" active={pathname === "/dashboard"}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xl font-extrabold">
            W
          </div>
        </NavItem>

        <NavItem href="/map" label="Kort" active={pathname === "/map"}>
          <MapPin size={36} />
        </NavItem>

        <NavItem href="/profile" label="Profil" active={pathname === "/profile"}>
          <User size={36} />
        </NavItem>

        {/* Burgermenu-knap */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`flex flex-col items-center transition ${
            menuOpen ? "opacity-100" : "opacity-80"
          }`}
        >
          <div className="flex h-9 w-9 items-center justify-center">
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </div>
          <span
            className={`mt-1 text-[0.9rem] font-bold ${
              menuOpen ? "text-(--brand-green-01)" : "text-white"
            }`}
          >
            Menu
          </span>
        </button>
      </nav>
    </>
  );
}

function NavItem({ href, label, active, children }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center transition ${
        active ? "opacity-100" : "opacity-80"
      }`}
    >
      {children}
      <span
        className={`mt-1 text-[0.9rem] font-bold ${
          active ? "text-(--brand-green-01)" : "text-white"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}