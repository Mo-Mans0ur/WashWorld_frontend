export default function FindWashButton() {
  return (
    <button type="button" className="flex h-19.5 w-full max-w-80 items-center">
      <div className="-mr-2 flex h-full w-[74%] items-center justify-between rounded-l-full bg-(--brand-green-01) pl-4.5 pr-7.5 [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]">
        <div className="leading-[1.05]">
          <p className="text-[0.72rem] font-bold text-white">
            Gunnar Clausens Vej 2A
          </p>
          <p className="text-[0.72rem] font-bold text-white">8260 Viby</p>
        </div>

        <span className="whitespace-nowrap text-[0.72rem] font-extrabold text-black">
          9.6 km
        </span>
      </div>

      <div className="flex h-full w-[44%] items-center justify-center rounded-r-full bg-white pl-6 pr-3.5 [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]">
        <span className="whitespace-nowrap text-[0.95rem] font-extrabold tracking-tight text-black">
          Find vask
        </span>
      </div>
    </button>
  );
}
