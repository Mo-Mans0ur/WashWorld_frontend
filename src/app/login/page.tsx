"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginButton } from "@/components/buttons";

const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

// TODO: Fjern når PHP backend er klar
const MOCK_USER = {
  username: "test@washworld.dk",
  password: "123456",
};

function getInputStyle(value: string, minLength: number) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < minLength) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = async () => {
    setError(null);
    setIsLoading(true);

    // TODO: Fjern mock login og erstat med fetch til PHP backend
    // når den er klar
    await new Promise((resolve) => setTimeout(resolve, 500)); // simulerer netværksforsinkelse

    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      localStorage.setItem("mock_user", JSON.stringify({ username }));
      router.push("/dashboard");
    } else {
      setError("Ugyldigt brugernavn eller kodeord");
    }

    setIsLoading(false);

    // TODO: Erstat ovenstående med dette når PHP backend er klar:
    // try {
    //   const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/login.php", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ user_email: username, user_password: password }),
    //   });
    //   if (!res.ok) {
    //     const data = await res.json();
    //     setError(data.message ?? "Ugyldigt brugernavn eller kodeord");
    //     return;
    //   }
    //   const { token } = await res.json();
    //   localStorage.setItem("token", token);
    //   router.push("/dashboard");
    // } catch {
    //   setError("Noget gik galt. Prøv igen.");
    // } finally {
    //   setIsLoading(false);
    // }
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

          {/* TODO: Fjern denne boks når PHP backend er klar */}
          <div className="w-72 bg-yellow-400/20 border border-yellow-400/50 p-3 text-yellow-200 text-xs rounded">
            <p className="font-bold mb-1">Midlertidig testbruger:</p>
            <p>Brugernavn: {MOCK_USER.username}</p>
            <p>Kodeord: {MOCK_USER.password}</p>
          </div>

          <div className="flex w-72 flex-col gap-1">
            <input
              placeholder="Brugernavn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 bg-(--color-surface) outline-none transition-colors ${getInputStyle(username, MIN_USERNAME_LENGTH)}`}
            />
            <p className="min-h-4 text-red-400 text-xs">
              {username.length > 0 && username.length < MIN_USERNAME_LENGTH
                ? `Min. ${MIN_USERNAME_LENGTH} tegn (${username.length}/${MIN_USERNAME_LENGTH})`
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