interface PageInfoProps {
  text?: string;
  userName?: string;
  className?: string;
}

export default function PageInfo({ text = "", userName, className = "" }: PageInfoProps) {
  const content = text || (userName ? `Hej ${userName}` : "");

  return (
    <section className={`relative h-12 ${className}`}>
      <div className="relative inline-flex h-full min-w-45 items-center bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
        <p className="whitespace-nowrap text-2xl font-bold text-white">
          {content}
        </p>
      </div>
    </section>
  );
}
