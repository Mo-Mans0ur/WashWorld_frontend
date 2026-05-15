"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-28 w-full shrink-0 items-center justify-around bg-(--color-black) text-white">
      <NavItem href="/dashboard" label="Hjem" active={pathname === "/dashboard"}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xl font-extrabold">
          W
        </div>
      </NavItem>

      <NavItem href="/map" label="Kort" active={pathname === "/map"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.218-4.398 3.218-6.761 0-4.304-3.478-7.8-7.503-7.8-4.026 0-7.503 3.496-7.503 7.8 0 2.363 1.274 4.678 3.218 6.76a19.58 19.58 0 002.682 2.283 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </NavItem>

      <NavItem href="/profile" label="Profil" active={pathname === "/profile"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-9"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </NavItem>
    </nav>
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