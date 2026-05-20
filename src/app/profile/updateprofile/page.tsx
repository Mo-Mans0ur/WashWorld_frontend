"use client";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  UserRound,
} from "lucide-react";

import PageInfo from "@/components/PageInfo";
import { profileUpdatePageContent } from "@/data/profileData";
import { useAuth } from "@/context/AuthContext";
import { updateAuthUser } from "@/lib/api/auth";
import { EUROPEAN_COUNTRIES, PHONE_DIAL_CODES } from "@/components/CountrySelector";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  dialCode: string;
  localPhone: string;
  newPassword: string;
  confirmPassword: string;
};

function parsePhone(stored: string): { dialCode: string; localPhone: string } {
  const sorted = Object.values(PHONE_DIAL_CODES).sort((a, b) => b.length - a.length);
  for (const code of sorted) {
    if (stored.startsWith(code)) {
      return { dialCode: code, localPhone: stored.slice(code.length).trim() };
    }
  }
  return { dialCode: "+45", localPhone: stored.replace(/^\+\d+\s*/, "") };
}

function validateLocalPhone(local: string): string | null {
  const digits = local.replace(/[\s\-]/g, "");
  if (!digits) return "Telefonnummer er påkrævet";
  if (!/^\d+$/.test(digits)) return "Kun tal er tilladt";
  if (digits.length < 6) return "For kort (min. 6 cifre)";
  if (digits.length > 12) return "For langt (max. 12 cifre)";
  return null;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, login, logout, token } = useAuth();
  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    dialCode: "+45",
    localPhone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const { dialCode, localPhone } = parsePhone(user.user_phone ?? "");
    setFormState({
      firstName: user.user_firstname,
      lastName: user.user_lastname,
      email: user.user_email,
      dialCode,
      localPhone,
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  function handleInputChange(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    if (field === "localPhone") setPhoneError(null);
  }

  async function handleSave() {
    if (!user || !token) return;

    const phoneValidation = validateLocalPhone(formState.localPhone);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }
    if (formState.newPassword && formState.newPassword !== formState.confirmPassword) {
      setError("Kodeordene matcher ikke");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const fullPhone = `${formState.dialCode} ${formState.localPhone.replace(/[\s\-]/g, "")}`;
      const updated = await updateAuthUser(user.user_id, {
        user_firstname: formState.firstName,
        user_lastname: formState.lastName,
        user_email: formState.email,
        user_phone: fullPhone,
        ...(formState.newPassword ? { user_password: formState.newPassword } : {}),
      });
      login(token, updated);
      router.push("/profile?updated=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke gemme ændringer");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-full">
      <PageInfo
        text={profileUpdatePageContent.pageInfoTitle}
        userName={user ? `${user.user_firstname} ${user.user_lastname}` : ""}
      />

      <section className="space-y-4 px-4 pb-6 pt-3">
        <article className="rounded-[3px] bg-(--white-white) shadow-2xl p-5">
          <SectionTitle
            icon={<UserRound className="h-4 w-4" strokeWidth={2.4} />}
            title={profileUpdatePageContent.profileSectionTitle}
          />

          <div className="mt-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                <UserRound className="h-9 w-9" strokeWidth={2.2} />
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-neutral-500">
                  {profileUpdatePageContent.memberSinceLabel}
                </p>
                <p className="text-sm font-bold text-neutral-700">
                  {user?.user_created_at ? new Date(user.user_created_at).toLocaleDateString("da-DK", { month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label={profileUpdatePageContent.fields.firstName.label}
                  placeholder={profileUpdatePageContent.fields.firstName.placeholder}
                  value={formState.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                />
                <InputField
                  label={profileUpdatePageContent.fields.lastName.label}
                  placeholder={profileUpdatePageContent.fields.lastName.placeholder}
                  value={formState.lastName}
                  onChange={(value) => handleInputChange("lastName", value)}
                />
              </div>
              <InputField
                label={profileUpdatePageContent.fields.email.label}
                type="email"
                placeholder={profileUpdatePageContent.fields.email.placeholder}
                value={formState.email}
                onChange={(value) => handleInputChange("email", value)}
              />
              <PhoneInput
                label={profileUpdatePageContent.fields.phoneNumber.label}
                dialCode={formState.dialCode}
                localPhone={formState.localPhone}
                error={phoneError}
                onDialCodeChange={(code) => handleInputChange("dialCode", code)}
                onLocalPhoneChange={(val) => handleInputChange("localPhone", val)}
              />
            </div>
          </div>
        </article>

        <article className="rounded-[3px] bg-(--white-white) shadow-2xl p-5">
          <SectionTitle
            icon={<Lock className="h-4 w-4" strokeWidth={2.4} />}
            title={profileUpdatePageContent.passwordSectionTitle}
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <InputField
              label={profileUpdatePageContent.fields.newPassword.label}
              type="password"
              placeholder={profileUpdatePageContent.fields.newPassword.placeholder}
              value={formState.newPassword}
              onChange={(value) => handleInputChange("newPassword", value)}
              hasTrailingIcon
            />
            <InputField
              label={profileUpdatePageContent.fields.confirmPassword.label}
              type="password"
              placeholder={profileUpdatePageContent.fields.confirmPassword.placeholder}
              value={formState.confirmPassword}
              onChange={(value) => handleInputChange("confirmPassword", value)}
              hasTrailingIcon
            />
          </div>
          <p className="mt-3 text-xs font-semibold text-neutral-500">
            {profileUpdatePageContent.passwordHint}
          </p>
        </article>

        <div className="space-y-3">
          {error && (
            <p className="text-center text-sm font-semibold text-red-500">{error}</p>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex h-12 w-full items-center justify-center gap-2 bg-(--brand-green-01) font-semibold text-white [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)] disabled:opacity-60"
          >
            <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
            {isSaving ? "Gemmer..." : profileUpdatePageContent.buttons.save}
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex h-12 w-full items-center justify-center gap-2 bg-red-600 font-semibold text-white [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
          >
            <LogOut className="h-4.5 w-4.5" strokeWidth={2.5} />
            {profileUpdatePageContent.buttons.logout}
          </button>
        </div>
      </section>
    </div>
  );
}

function PhoneInput({
  label,
  dialCode,
  localPhone,
  error,
  onDialCodeChange,
  onLocalPhoneChange,
}: {
  label: string;
  dialCode: string;
  localPhone: string;
  error: string | null;
  onDialCodeChange: (code: string) => void;
  onLocalPhoneChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedCountry = EUROPEAN_COUNTRIES.find(
    (c) => PHONE_DIAL_CODES[c.code] === dialCode,
  );

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-600">{label}</span>
      <div className="flex gap-2" ref={ref}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 items-center gap-1 border border-neutral-300 bg-(--white-white) px-3 text-sm font-bold text-neutral-700 focus:border-(--brand-green-01)"
          >
            <span>{dialCode}</span>
            <ChevronDown size={13} className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-44 overflow-y-auto rounded-[3px] bg-white shadow-xl ring-1 ring-black/10">
              {EUROPEAN_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onDialCodeChange(PHONE_DIAL_CODES[c.code]); setOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100 ${
                    c.code === selectedCountry?.code ? "text-(--brand-green-01)" : "text-neutral-700"
                  }`}
                >
                  <span className="font-bold">{PHONE_DIAL_CODES[c.code]}</span>
                  <span className="text-xs text-neutral-500">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="tel"
            placeholder="12 34 56 78"
            value={localPhone}
            onChange={(e) => onLocalPhoneChange(e.target.value)}
            className={`h-11 w-full border bg-(--white-white) px-3 text-sm font-semibold text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-(--brand-green-01) ${
              error ? "border-red-400" : "border-neutral-300"
            }`}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </label>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-(--brand-green-01)">
        {icon}
      </span>
      <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  type?: "text" | "email" | "tel" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  hasTrailingIcon?: boolean;
};

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  hasTrailingIcon = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = hasTrailingIcon && isPasswordField && showPassword ? "text" : type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-600">
        {label}
      </span>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full border border-neutral-300 bg-(--white-white) px-3 text-sm font-semibold text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-(--brand-green-01)"
        />
        {hasTrailingIcon && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" strokeWidth={2.2} />
            ) : (
              <Eye className="h-4.5 w-4.5" strokeWidth={2.2} />
            )}
          </button>
        )}
      </div>
    </label>
  );
}
