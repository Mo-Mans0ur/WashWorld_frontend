"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={className}
    >
      {children}
    </button>
  );
}
