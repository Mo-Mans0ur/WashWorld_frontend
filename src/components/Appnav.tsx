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

      {/* Sidebar */}
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

        {/* Menu items */}
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
              <Icon
                size={18}
                className="text-white/50 group-hover:text-white transition-colors"
              />
              <span className="text-[0.95rem] font-semibold">{label}</span>
              <ChevronRight size={18} />
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom nav — fills the container, no manual centering needed */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 flex h-16 w-full items-center justify-around bg-(--color-black) pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <Link
          href="/dashboard"
          className="flex flex-col items-center text-white/70 hover:text-white"
        >
          <Home size={26} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/locations/map"
          className="flex flex-col items-center text-white/70 hover:text-white"
        >
          <MapPin size={26} />
          <span className="text-xs">Kort</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center text-white/70 hover:text-white"
        >
          <User size={26} />
          <span className="text-xs">Profil</span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-col items-center text-white/70 hover:text-white focus:outline-none"
        >
          <Menu size={26} />
          <span className="text-xs">Menu</span>
        </button>
      </nav>
    </>
  );
}