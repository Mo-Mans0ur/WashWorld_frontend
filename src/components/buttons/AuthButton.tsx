interface AuthButtonProps {
  mode: "login" | "signup";
  onLoginClick: () => void;
  onSignupClick: () => void;
  disabled?: boolean;
}

export default function AuthButton({
  mode,
  onLoginClick,
  onSignupClick,
  disabled,
}: AuthButtonProps) {
  const isPrimaryLogin = mode === "login";

  return (
    <div className="flex w-full max-w-60.5">
      <button
        type="button"
        onClick={isPrimaryLogin ? onLoginClick : onSignupClick}
        disabled={disabled}
        className="z-10 flex h-12.5 flex-[1.02] items-center justify-center bg-(--brand-green-01) [clip-path:polygon(0_0,100%_0,83%_100%,0_100%)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-xl font-bold tracking-tight text-white">
          {isPrimaryLogin
            ? disabled ? "Logger ind..." : "Log ind"
            : disabled ? "Opretter..." : "Opret"}
        </span>
      </button>

      <button
        type="button"
        onClick={isPrimaryLogin ? onSignupClick : onLoginClick}
        disabled={disabled}
        className="-ml-5 flex h-12.5 flex-1 items-center justify-center bg-(--color-grey-01) px-3 [clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="whitespace-nowrap text-[0.97rem] font-medium tracking-tight text-white">
          {isPrimaryLogin ? "Ny bruger" : "Login"}
        </span>
      </button>
    </div>
  );
}
