import Link from "next/link";

type ErrorPageButtonProps = {
  href: string;
  className: string;
  children: React.ReactNode;
};

export default function ErrorPageButton({
  href,
  className,
  children,
}: ErrorPageButtonProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
