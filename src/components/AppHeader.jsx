import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="h-22 bg-[linear-gradient(90deg,var(--brand-green-01)_0%,var(--color-header-dark)_100%)] border-b-[3px] border-(--brand-green-01) px-7 py-5">
      <div className="flex items-start justify-between">
        <Image
          src="/logos/washworld-white.png"
          alt="Wash World logo"
          width={110}
          height={50}
          priority
        />

        <button
          type="button"
          aria-label="Åbn menu"
          className="flex flex-col gap-1.5 pt-1"
        >
          <span className="block h-0.75 w-8 bg-(--color-surface)" />
          <span className="block h-0.75 w-8 bg-(--color-surface)" />
          <span className="block h-0.75 w-8 bg-(--color-surface)" />
        </button>
      </div>
    </header>
  );
}
