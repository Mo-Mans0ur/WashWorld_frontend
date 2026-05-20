"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const MIN_EMAIL_LENGTH = 5;

function getInputStyle(value: string) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < MIN_EMAIL_LENGTH) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.length >= MIN_EMAIL_LENGTH && !isSubmitting;

  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: kald API endpoint til password reset når det er klar
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
    } catch {
      setError("Noget gik galt. Prøv igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 z-10 h-full w-full overflow-hidden">
      <Image
        src="/background/washworld-background.png"
        alt="Baggrund"
        fill
        priority
      />

      <div className="absolute inset-0 z-20 bg-(--color-overlay-dark-40)" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center gap-4">
        <Image
          src="/logos/washworld-white.png"
          alt="Wash World logo"
          width={234}
          height={102}
          priority
          style={{ width: "auto" }}
          className="mb-10"
        />

        {submitted ? (
          <div className="flex w-72 flex-col items-center gap-6 text-center">
            <p className="text-lg font-bold text-white">Email sendt!</p>
            <p className="text-sm text-white/80">
              Hvis der findes en konto med denne email, modtager du snart et link til at nulstille dit kodeord.
            </p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="h-12 w-full bg-(--brand-green-01) font-bold text-white [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
            >
              Tilbage til login
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-72 flex-col gap-1"
          >
            <p className="mb-3 text-center text-sm font-semibold text-white/80">
              Indtast din email, så sender vi dig et link til at nulstille dit kodeord.
            </p>

            <input
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${getInputStyle(email)}`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {email.length > 0 && email.length < MIN_EMAIL_LENGTH
                ? `Min. ${MIN_EMAIL_LENGTH} tegn (${email.length}/${MIN_EMAIL_LENGTH})`
                : ""}
            </p>

            <div className="mb-2 min-h-4">
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="h-12 w-full bg-(--brand-green-01) font-bold text-white transition-opacity disabled:opacity-50 [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
            >
              {isSubmitting ? "Sender…" : "Nulstil adgangskode"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-3 text-sm text-white/70 hover:text-white"
            >
              Tilbage til login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
