const STATUS_CONFIG = {
  Ledig: {
    disabled: false,
    label: "Start vask",
    gradient: "bg-[linear-gradient(60deg,var(--brand-green-02)_0%,var(--brand-green-02)_52%,var(--color-grey-01)_52%,var(--color-grey-01)_100%)]",
    hint: null,
  },
  Optaget: {
    disabled: true,
    label: "Optaget",
    gradient: "bg-[linear-gradient(60deg,#f59e0b_0%,#f59e0b_52%,#d1d5db_52%,#d1d5db_100%)]",
    hint: "Vælg en ledig maskine for at starte vask",
  },
  "Ud af drift": {
    disabled: true,
    label: "Ud af drift",
    gradient: "bg-[linear-gradient(60deg,#ef4444_0%,#ef4444_52%,#d1d5db_52%,#d1d5db_100%)]",
    hint: "Denne maskine er ikke tilgængelig",
  },
};

const DEFAULT_CONFIG = STATUS_CONFIG.Ledig;

export default function StartWashButton({ onClick, status }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_CONFIG;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-102.5 gap-2">
      <button
        type="button"
        onClick={config.disabled ? undefined : onClick}
        disabled={config.disabled}
        className="relative flex h-16 w-full max-w-80 items-center justify-center overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.18)] disabled:opacity-80 disabled:cursor-not-allowed"
      >
        <div className={`absolute inset-0 ${config.gradient}`} />
        <span className="relative z-10 text-[1.35rem] font-bold tracking-tight text-(--color-grey-03)">
          {config.label}
        </span>
      </button>
      {config.hint && (
        <p className="text-xs text-neutral-500">{config.hint}</p>
      )}
    </div>
  );
}
