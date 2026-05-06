export default function StartWashButton() {
  return (
    <div className="flex w-full max-w-102.5">
      <button
        type="button"
        className="relative flex h-16 w-full max-w-97.5 items-center justify-center overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--color-black)_0%,var(--color-black)_52%,var(--color-grey-01)_52%,var(--color-grey-01)_100%)]" />

        <span className="relative z-10 text-[1.35rem] font-extrabold tracking-tight text-(--color-grey-03)">
          Start vask
        </span>
      </button>
    </div>
  );
}
