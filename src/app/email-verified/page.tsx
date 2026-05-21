"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  // Success is the normal path, so keep it as the default copy.
  let title = "Email Bekræftet";
  let message =
    "Din email er blevet bekræftet. Du kan nu logge ind på din konto.";

  // The API sends a status query param when the confirmation link needs a different message.
  if (status === "ALREADY_VERIFIED") {
    title = "Email Allerede Bekræftet";
    message = "Din email er allerede bekræftet. Du kan logge ind på din konto.";
  }

  if (status === "INVALID") {
    title = "Ugyldig Link";
    message =
      "Dit link er ugyldigt eller udløbet. Prøv at anmode om en ny bekræftelsesemail.";
  }

  if (status === "MISSING_KEY") {
    title = "Manglende Nøgle";
    message =
      "Der mangler en nøgle i dit link. Prøv at anmode om en ny bekræftelsesemail.";
  }

  if (status === "DELETED") {
    title = "Konto Slettet";
    message =
      "Din konto er blevet slettet. Hvis dette var en fejl, kontakt venligst support.";
  }

  if (status === "EXPIRED") {
    title = "Link Udløbet";
    message =
      "Dit link er udløbet. Prøv at anmode om en ny bekræftelsesemail.";
  }

  if (status === "ERROR") {
    title = "Fejl";
    message =
      "Der opstod en fejl under bekræftelsen. Prøv igen senere eller kontakt support.";
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Uses the same centered card feel as the other app screens, just without extra page chrome. */}
      <section className="flex flex-1 flex-col items-center justify-center px-7 pb-10 pt-6 text-center">
        <article className="mx-auto w-[82%] rounded-[3px] bg-(--white-white) px-5 py-7 shadow-lg">
          <h1 className="text-[1.7rem] font-bold leading-tight text-black">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-67.5 text-[0.9rem] font-bold leading-tight text-neutral-600">
            {message}
          </p>

          <Link
            href="/login"
            className="mx-auto mt-7 flex h-10.5 w-[85%] items-center justify-center bg-(--brand-green-01) text-[0.95rem] font-bold text-white transition hover:bg-(--brand-green-02)"
          >
            Gå til login
          </Link>
        </article>
      </section>
    </div>
  );
}
