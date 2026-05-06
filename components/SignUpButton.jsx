export default function SignUpButton() {
  return (
    <div className="flex w-full max-w-102.5">
      <button
        type="button"
        className="z-10 flex h-7.5 flex-[1.5] items-center justify-center bg-(--brand-green-01) [clip-path:polygon(0_0,100%_0,89%_100%,0_100%)]"
      >
        <span className="text-[0.72rem] font-bold tracking-tight text-white">
          Opret konto
        </span>
      </button>

      <button
        type="button"
        className="-ml-5 flex h-7.5 flex-[0.7] items-center justify-center bg-(--color-grey-01) px-3 [clip-path:polygon(19%_0,100%_0,100%_100%,0_100%)]"
      >
        <span className="whitespace-nowrap text-[0.62rem] font-medium tracking-tight text-white">
          Afbryd
        </span>
      </button>
    </div>
  );
}
