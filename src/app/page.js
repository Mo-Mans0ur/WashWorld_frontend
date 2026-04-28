import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between gap-[var(--space-lg)] bg-[var(--color-surface)] px-[var(--space-lg)] py-[calc(var(--space-lg)*4)] sm:items-start">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-[var(--space-md)] text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-[var(--color-text)]">
            To get started, edit the page.js file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-[var(--color-text-muted)]">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-[var(--space-sm)] text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-md)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-secondary)] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-[var(--radius-md)] border border-solid border-[var(--color-border)] px-[var(--space-md)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
