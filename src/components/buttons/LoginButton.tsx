interface LoginButtonProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  disabled?: boolean;
}

export default function LoginButton({ onLoginClick, onSignupClick, disabled }: LoginButtonProps) {
  return (
    <div className="flex w-full max-w-60.5">
      <button
        type="button"
        onClick={onLoginClick}
        disabled={disabled}
        className="z-10 flex h-12.5 flex-[1.02] items-center justify-center bg-(--brand-green-01) [clip-path:polygon(0_0,100%_0,83%_100%,0_100%)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="text-xl font-bold tracking-tight text-white">
          {disabled ? "Logger ind..." : "Log ind"}
        </span>
      </button>

      <button
        type="button"
        onClick={onSignupClick}
        disabled={disabled}
        className="-ml-5 flex h-12.5 flex-1 items-center justify-center bg-(--color-grey-01) px-3 [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="whitespace-nowrap text-[0.95rem] font-medium tracking-tight text-white">
          Ny bruger
        </span>
      </button>
    </div>
  );
}