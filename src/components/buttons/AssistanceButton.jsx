export default function AssistanceButton({}) {
  return (
    <button
      type="button"
      onClick={""}
      className="flex h-11.75 w-full max-w-143.75 items-center justify-center gap-4 bg-(--color-danger) px-8 [clip-path:polygon(10%_0,100%_0,90%_100%,0_100%)]"
    >
      <span className="text-xl font-bold tracking-widest text-white">
        HJÆLP
      </span>

      <span className="text-xl text-white">📞</span>
    </button>
  );
}
