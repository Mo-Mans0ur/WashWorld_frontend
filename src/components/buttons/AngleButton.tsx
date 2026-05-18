interface AngleButtonProps {
  text: string;
  className?: string;
}

export default function AngleButton({ text, className = "bg-(--brand-green-01)" }: AngleButtonProps) {
  return (
    <div className="-right-px -bottom-px h-6">
      <span className={`flex h-full items-center justify-end rounded-none border-0 pl-6 pr-2 text-xs leading-none font-bold text-white [clip-path:polygon(24%_0,101%_0,101%_101%,0_101%)] ${className}`}>
        {text}
      </span>
    </div>
  );
}
