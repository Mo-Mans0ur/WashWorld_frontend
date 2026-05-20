"use client";
import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  UserRound,
} from "lucide-react";

import PageInfo from "@/components/PageInfo";
import {
  profileUpdateInitialValues,
  profileUpdatePageContent,
  profileUser,
} from "@/data/profileData";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  newPassword: string;
  confirmPassword: string;
};

export default function UpdateProfilePage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    firstName: profileUpdateInitialValues.firstName,
    lastName: profileUpdateInitialValues.lastName,
    email: profileUpdateInitialValues.email,
    phoneNumber: profileUpdateInitialValues.phoneNumber,
    newPassword: profileUpdateInitialValues.newPassword,
    confirmPassword: profileUpdateInitialValues.confirmPassword,
  });

  function handleInputChange(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
  }

  function handleSave() {
    router.push("/profile?updated=1");
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <div className="min-h-full">
      <PageInfo
        text={profileUpdatePageContent.pageInfoTitle}
        userName={profileUser.userName}
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
                  {profileUser.memberSince}
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
              <InputField
                label={profileUpdatePageContent.fields.phoneNumber.label}
                type="tel"
                placeholder={profileUpdatePageContent.fields.phoneNumber.placeholder}
                value={formState.phoneNumber}
                onChange={(value) => handleInputChange("phoneNumber", value)}
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
          <button
            type="button"
            onClick={handleSave}
            className="flex h-12 w-full items-center justify-center gap-2 bg-(--brand-green-01) font-semibold text-white [clip-path:polygon(0_0,100%_0,96%_100%,0_100%)]"
          >
            <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
            {profileUpdatePageContent.buttons.save}
          </button>

          <button
            type="button"
            onClick={handleLogout}
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
