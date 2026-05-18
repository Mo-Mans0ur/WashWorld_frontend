"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginButton } from "@/components/buttons";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";

const MIN_EMAIL_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 6;

function getInputStyle(value: string, minLength: number) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < minLength) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const { token, user } = await loginUser(email, password); // sender som user_email + user_password
      login(token, user);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ugyldigt brugernavn eller kodeord");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <>
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
        <Image
          src="/background/washworld-background.png"
          alt="Baggrund"
          fill
          priority
        />

        <div className="absolute inset-0 bg-(--color-overlay-dark-40) z-20" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full gap-4">
          <h2 className="-mt-4 text-white text-3xl font-bold">
            Velkommen til
          </h2>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 bg-(--color-surface) outline-none transition-colors ${getInputStyle(email, MIN_EMAIL_LENGTH)}`}
            />
            <p className="min-h-4 text-red-400 text-xs">
              {email.length > 0 && email.length < MIN_EMAIL_LENGTH
                ? `Min. ${MIN_EMAIL_LENGTH} tegn (${email.length}/${MIN_EMAIL_LENGTH})`
                : ""}
            </p>
          </div>

          <div className="flex w-72 flex-col gap-1">
            <input
              placeholder="Kodeord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 bg-(--color-surface) outline-none transition-colors ${getInputStyle(password, MIN_PASSWORD_LENGTH)}`}
            />
            <p className="min-h-4 text-red-400 text-xs">
              {password.length > 0 && password.length < MIN_PASSWORD_LENGTH
                ? `Min. ${MIN_PASSWORD_LENGTH} tegn (${password.length}/${MIN_PASSWORD_LENGTH})`
                : ""}
            </p>
          </div>

          <div className="min-h-4 mb-7">
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          <LoginButton
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            disabled={isLoading}
          />

          <p className="text-white/70 text-sm mt-2">
            Glemt kodeord?{" "}
            <button
              onClick={() => router.push("/reset-password")}
              className="text-(--color-secondary) font-semibold hover:underline"
            >
              Nulstil det her
            </button>
          </p>
        </div>
      </div>
    </>
  );
}