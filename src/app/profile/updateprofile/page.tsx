"use client";

// UpdateProfilePage – redigér navn, email, telefonnummer og kodeord.
// Formularen forudfyldes med data fra AuthContext når siden indlæses.
// Telefonnummeret splittes i landekode + lokalt nummer (parsePhone) og
// samles igen til ét felt ("+45 12345678") når der gemmes.
// Efter en vellykket gem opdateres AuthContext med det nye bruger-objekt
// og brugeren sendes til /profile?updated=1 som viser en toast-bekræftelse.

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  KeyRound,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import PageInfo from "@/components/PageInfo";
import { Button } from "@/components/buttons";
import { profileUpdatePageContent } from "@/data/profileData";
import { useAuth } from "@/hooks";
import { updateAuthUser, deleteAuthUser } from "@/lib/api/auth";
import { ROUTES } from "@/lib/routes";
import { EUROPEAN_COUNTRIES, PHONE_DIAL_CODES } from "@/components/CountrySelector";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  dialCode: string;
  localPhone: string;
};

// Splitter et gemt telefonnummer som "+45 12345678" i landekode og lokalnummer.
// Sorterer koderne længst-først så "+358" matches før "+35" ved overlap.
// Falder tilbage til +45/dansk nummer hvis ingen kode genkendes.
function parsePhone(stored: string): { dialCode: string; localPhone: string } {
  const sorted = Object.values(PHONE_DIAL_CODES).sort((a, b) => b.length - a.length);
  for (const code of sorted) {
    if (stored.startsWith(code)) {
      return { dialCode: code, localPhone: stored.slice(code.length).trim() };
    }
  }
  return { dialCode: "+45", localPhone: stored.replace(/^\+\d+\s*/, "") };
}

// Forventede længder (antal cifre) for lokale numre per landekode.
// Lande med ét gyldigt antal angives som [n, n], ellers [min, max].
const PHONE_LENGTH_BY_DIAL_CODE: Record<string, [number, number]> = {
  "+45": [8, 8],   // Danmark
  "+46": [7, 10],  // Sverige
  "+47": [8, 8],   // Norge
  "+358": [5, 12], // Finland
  "+354": [7, 7],  // Island
  "+44": [7, 10],  // UK
  "+49": [3, 12],  // Tyskland
  "+33": [9, 9],   // Frankrig
  "+34": [9, 9],   // Spanien
  "+39": [6, 11],  // Italien
  "+31": [9, 9],   // Holland
  "+32": [8, 9],   // Belgien
  "+41": [9, 9],   // Schweiz
  "+43": [4, 13],  // Østrig
  "+48": [9, 9],   // Polen
};

// Validerer selve nummeret uden landekode ud fra dialCode.
// Brugeren kan frit taste "12 34 56 78" eller "12-34-56-78" — mellemrum og
// bindestreger strippes inden tjekket.
function validateLocalPhone(local: string, dialCode: string): string | null {
  const digits = local.replace(/[\s\-]/g, "");
  if (!digits) return "Telefonnummer er påkrævet";
  if (!/^\d+$/.test(digits)) return "Kun cifre, mellemrum og bindestreger er tilladt";
  const [min, max] = PHONE_LENGTH_BY_DIAL_CODE[dialCode] ?? [6, 12];
  if (digits.length < min || digits.length > max) {
    return min === max
      ? `${dialCode}-numre skal være præcis ${min} cifre (du har ${digits.length})`
      : `${dialCode}-numre skal være ${min}–${max} cifre (du har ${digits.length})`;
  }
  return null;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, login, logout, token, displayFullName } = useAuth();
  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    dialCode: "+45",
    localPhone: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Forudfyld formularen med brugerens nuværende data fra AuthContext.
  // Kodeordfelterne efterlades tomme – udfyldes kun hvis brugeren ønsker at skifte kodeord.
  useEffect(() => {
    if (!user) return;
    const { dialCode, localPhone } = parsePhone(user.user_phone ?? "");
    setFormState({
      firstName: user.user_firstname,
      lastName: user.user_lastname,
      email: user.user_email,
      dialCode,
      localPhone,
    });
  }, [user]);

  function handleInputChange(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    if (field === "localPhone") setPhoneError(null);
  }

  async function handleSave() {
    if (!user || !token) return;

    const phoneValidation = validateLocalPhone(formState.localPhone, formState.dialCode);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
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
      });
      // Opdater AuthContext med de nye brugerdata så resten af appen ser de nye værdier
      login(token, updated);
      router.push(ROUTES.profileUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke gemme ændringer");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user || !token) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAuthUser(user.user_id);
      logout();
      router.push(ROUTES.login);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette konto");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-full">
      <PageInfo
        text={profileUpdatePageContent.pageInfoTitle}
        userName={displayFullName}
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
            icon={<KeyRound className="h-4 w-4" strokeWidth={2.4} />}
            title={profileUpdatePageContent.passwordSectionTitle}
          />
          <p className="mt-3 text-sm text-neutral-500">
            Vi sender et link til din email, som du kan bruge til at vælge en ny adgangskode.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            <Link
              href={ROUTES.resetPassword}
              className="font-semibold text-(--color-secondary) hover:underline"
            >
              Nulstil din adgangskode her
            </Link>
          </p>
        </article>

        <div className="space-y-3">
          {error && (
            <p className="text-center text-sm font-semibold text-red-500">{error}</p>
          )}
          <Button
            variant="primary"
            size="lg"
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 font-semibold disabled:opacity-60"
          >
            <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
            {isSaving ? "Gemmer..." : profileUpdatePageContent.buttons.save}
          </Button>

          {!showDeleteConfirm ? (
            <Button
              variant="danger"
              size="lg"
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 font-semibold disabled:opacity-60"
            >
              Slet konto
            </Button>
          ) : (
            <div className="rounded-[3px] border border-red-200 bg-red-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-red-700 text-center">
                Er du sikker? Denne handling kan ikke fortrydes.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 font-semibold disabled:opacity-60"
                >
                  Annuller
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 font-semibold disabled:opacity-60"
                >
                  {isDeleting ? "Sletter..." : "Ja, slet konto"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// PhoneInput – kombineret landekode-dropdown og telefonnummer-felt med inline fejlbesked.
// Klikkes der uden for dropdownen lukkes den automatisk via en mousedown-listener.
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
  type?: "text" | "email" | "tel";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

function InputField({ label, type = "text", placeholder, value, onChange }: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-600">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full border border-neutral-300 bg-(--white-white) px-3 text-sm font-semibold text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-(--brand-green-01)"
      />
    </label>
  );
}
