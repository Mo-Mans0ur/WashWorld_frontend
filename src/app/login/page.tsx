"use client";

// LoginPage – appens indgangsside.
// Brugeren indtaster email og kodeord. Ved succes gemmes token + brugerdata
// i AuthContext (og localStorage), og brugeren sendes til /dashboard.
// Fejlbeskeder kommer direkte fra API-svaret og vises under formularen.

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useEffect } from "react";
import { AuthButton } from "@/components/buttons";
import { useAuth } from "@/hooks";
import { loginUser } from "@/lib/api/auth";
import { ROUTES } from "@/lib/routes";

const MIN_EMAIL_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 6;

// Returnerer en Tailwind border-klasse baseret på feltets nuværende længde.
// Ingen farve mens feltet er tomt, rød hvis for kort, grøn når det ser ud til at være gyldigt.
function getInputStyle(value: string, minLength: number) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < minLength) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(ROUTES.dashboard);
    }
  }, [authLoading, isAuthenticated, router]);

  // Login-knappen er deaktiveret mens AuthContext stadig tjekker et gemt token (authLoading),
  // eller mens et login-kald allerede er i gang (isSubmitting).
  const canSubmit =
    email.length >= MIN_EMAIL_LENGTH &&
    password.length >= MIN_PASSWORD_LENGTH &&
    !isSubmitting &&
    !authLoading;

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await loginUser(
        email.trim().toLowerCase(),
        password,
      );
      login(token, user);
      router.push(ROUTES.dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ugyldigt brugernavn eller kodeord",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-10 h-full w-full overflow-hidden">
        <Image
          src="/background/washworld-background.png"
          alt="Baggrund"
          fill
          priority
        />

        <div className="absolute inset-0 z-20 bg-(--color-overlay-dark-40)" />
        <form
          onSubmit={handleSubmit}
          className="relative z-20 flex h-full flex-col items-center justify-center gap-4"
        >
          <h2 className="-mt-4 text-3xl font-bold text-white">Velkommen til</h2>

          <Image
            src="/logos/washworld-white.png"
            alt="Wash World logo"
            width={234}
            height={102}
            priority
            style={{ width: "auto" }}
            className="mb-18"
          />

          <div className="flex w-72 flex-col gap-1">
            <input
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${getInputStyle(email, MIN_EMAIL_LENGTH)}`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {email.length > 0 && email.length < MIN_EMAIL_LENGTH
                ? `Min. ${MIN_EMAIL_LENGTH} tegn (${email.length}/${MIN_EMAIL_LENGTH})`
                : ""}
            </p>
          </div>

          <div className="flex w-72 flex-col gap-1">
            <input
              placeholder="Kodeord"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${getInputStyle(password, MIN_PASSWORD_LENGTH)}`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {password.length > 0 && password.length < MIN_PASSWORD_LENGTH
                ? `Min. ${MIN_PASSWORD_LENGTH} tegn (${password.length}/${MIN_PASSWORD_LENGTH})`
                : ""}
            </p>
          </div>

          <div className="mb-7 min-h-4">
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>

          <AuthButton
            mode="login"
            onLoginClick={() => void handleSubmit()}
            onSignupClick={() => router.push(ROUTES.signup)}
            disabled={!canSubmit}
          />

          <p className="mt-2 text-sm text-white/70">
            Glemt kodeord?{" "}
            <button
              type="button"
              onClick={() => router.push(ROUTES.resetPassword)}
              className="font-semibold text-(--color-secondary) hover:underline"
            >
              Nulstil det her
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
