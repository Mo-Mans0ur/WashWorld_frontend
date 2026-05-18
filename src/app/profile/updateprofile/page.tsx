"use client";
import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
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

  function handleCancel() {
    router.back();
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <div className="min-h-full bg-[linear-gradient(135deg,#f6fbf7_0%,#ebf6ef_24%,#34a853_100%)]">
        <PageInfo
          text={profileUpdatePageContent.pageInfoTitle}
          userName={profileUser.userName}
          className="bg-transparent"
        />

        <section className="px-4 pb-6 pt-3">
          <section className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <SectionTitle
              icon={<UserRound className="h-4 w-4" strokeWidth={2.4} />}
              title={profileUpdatePageContent.profileSectionTitle}
            />

            <div className="mt-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2ab36a_0%,#1d8a52_100%)] text-white shadow-[0_10px_20px_rgba(41,179,106,0.25)]">
                  <UserRound className="h-10 w-10" strokeWidth={2.2} />
                </div>

                <div className="mt-3">
                  <p className="text-[0.72rem] font-semibold text-[#5e6b63]">
                    {profileUpdatePageContent.memberSinceLabel}
                  </p>
                  <p className="text-[0.9rem] font-bold text-[#3d4b42]">
                    {profileUser.memberSince}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <InputField
                    label={profileUpdatePageContent.fields.firstName.label}
                    placeholder={
                      profileUpdatePageContent.fields.firstName.placeholder
                    }
                    value={formState.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                  />
                  <InputField
                    label={profileUpdatePageContent.fields.lastName.label}
                    placeholder={
                      profileUpdatePageContent.fields.lastName.placeholder
                    }
                    value={formState.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                  />
                </div>

                <InputField
                  label={profileUpdatePageContent.fields.email.label}
                  type="email"
                  placeholder={
                    profileUpdatePageContent.fields.email.placeholder
                  }
                  value={formState.email}
                  onChange={(value) => handleInputChange("email", value)}
                />

                <InputField
                  label={profileUpdatePageContent.fields.phoneNumber.label}
                  type="tel"
                  placeholder={
                    profileUpdatePageContent.fields.phoneNumber.placeholder
                  }
                  value={formState.phoneNumber}
                  onChange={(value) => handleInputChange("phoneNumber", value)}
                />
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <SectionTitle
              icon={<Lock className="h-4 w-4" strokeWidth={2.4} />}
              title={profileUpdatePageContent.passwordSectionTitle}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InputField
                label={profileUpdatePageContent.fields.newPassword.label}
                type="password"
                placeholder={
                  profileUpdatePageContent.fields.newPassword.placeholder
                }
                value={formState.newPassword}
                onChange={(value) => handleInputChange("newPassword", value)}
                hasTrailingIcon
                placeholderClassName="placeholder:text-[0.68rem] placeholder:text-[#a2a9a4]"
              />
              <InputField
                label={profileUpdatePageContent.fields.confirmPassword.label}
                type="password"
                placeholder={
                  profileUpdatePageContent.fields.confirmPassword.placeholder
                }
                value={formState.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                hasTrailingIcon
                placeholderClassName="placeholder:text-[0.68rem] placeholder:text-[#a2a9a4]"
              />
            </div>

            <p className="mt-4 text-[0.78rem] font-medium text-[#7d8782]">
              {profileUpdatePageContent.passwordHint}
            </p>
          </section>

          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-(--brand-green-01) text-[1rem] font-extrabold text-white shadow-[0_10px_20px_rgba(31,140,78,0.22)] [clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)]"
            >
              <Check className="h-4.5 w-4.5" strokeWidth={3} />
              {profileUpdatePageContent.buttons.save}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e6e6e6] bg-white text-[1rem] font-extrabold text-[#3f3f3f] shadow-[0_6px_14px_rgba(0,0,0,0.04)]"
            >
              <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2.8} />
              {profileUpdatePageContent.buttons.cancel}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#ff4d4f] bg-white text-[1rem] font-extrabold text-[#ff3b30]"
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
    <div className="flex items-center gap-2 text-(--brand-green-01)">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef8f1]">
        {icon}
      </span>
      <h2 className="text-[1.2rem] font-extrabold text-[#187847]">{title}</h2>
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
  placeholderClassName?: string;
};

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  hasTrailingIcon = false,
  placeholderClassName = "placeholder:text-[#a2a9a4]",
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType =
    hasTrailingIcon && isPasswordField && showPassword ? "text" : type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.74rem] font-extrabold text-[#5d615f]">
        {label}
      </span>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 w-full rounded-lg border border-[#d9dfdb] bg-white px-3 text-[0.92rem] font-medium text-black outline-none ${placeholderClassName}`}
        />

        {hasTrailingIcon ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f9692]"
            aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" strokeWidth={2.2} />
            ) : (
              <Eye className="h-4.5 w-4.5" strokeWidth={2.2} />
            )}
          </button>
        ) : null}
      </div>
    </label>
  );
}
