"use client";

// SignUpPage – opretter en ny bruger.
// validate() tjekker alle felter lokalt før API-kaldet sendes.
// Ved succes returnerer API'et et JWT-token og brugerdata, som gemmes i AuthContext,
// og brugeren sendes direkte til /dashboard uden at skulle logge ind separat.

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthButton } from "@/components/buttons";
import { registerUser } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName) newErrors.firstName = "Fornavn er påkrævet";
    if (!form.lastName) newErrors.lastName = "Efternavn er påkrævet";
    if (!form.email.includes("@")) newErrors.email = "Ugyldig email";
    if (form.password.length < 6) newErrors.password = "Min. 6 tegn";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Kodeord matcher ikke";
    if (!acceptedTerms) newErrors.terms = "Du skal acceptere vilkårene";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupClick = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { token, user } = await registerUser({
        user_firstname: form.firstName,
        user_lastname: form.lastName,
        user_email: form.email,
        user_password: form.password,
      });
      login(token, user);
      router.push("/dashboard");
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Noget gik galt. Prøv igen." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
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
          <h2 className="-mt-4 text-white text-3xl font-bold">Velkommen til</h2>

          <Image
            src="/logos/washworld-white.png"
            alt="Wash World logo"
            width={234}
            height={102}
            priority
            style={{ width: "auto" }}
            className="mb-18"
          />

          <input
            name="firstName"
            placeholder="Fornavn"
            value={form.firstName}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.firstName ?? ""}
          </p>

          <input
            name="lastName"
            placeholder="Efternavn"
            value={form.lastName}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.lastName ?? ""}
          </p>

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.email ?? ""}
          </p>

          <input
            name="password"
            placeholder="Kodeord"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.password ?? ""}
          </p>

          <input
            name="confirmPassword"
            placeholder="Gentag kodeord"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.confirmPassword ?? ""}
          </p>

          <label className="mx-auto mt-2.5 flex w-full max-w-72 items-center justify-center gap-2 text-[0.95rem] font-semibold text-(--white-white)">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 accent-(--brand-green-01)"
            />
            <span>
              Jeg accepterer{" "}
              <button
                onClick={() => router.push("/terms")}
                className="text-(--color-secondary) font-semibold hover:underline"
              >
                abonnementsvilkår
              </button>
            </span>
          </label>
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.terms ?? ""}
          </p>

          <p className="min-h-4 text-red-400 text-sm">
            {errors.general ?? ""}
          </p>

          <AuthButton
            mode="signup"
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
}
