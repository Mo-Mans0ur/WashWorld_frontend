"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/buttons/LoginButton";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10  ">
        <Image
          src="/background/washworld-background.png"
          alt="Baggrund"
          fill
          priority
        />
       
        <div className="absolute inset-0 bg-(--color-overlay-dark-40) z-20" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full gap-4 ">
          <h2 className="-mt-4 text-white text-3xl font-bold ">Velkommen til</h2>

          <Image
            src="/logos/washworld-white.png"
            alt="Wash World logo"
            width={234}
            height={102}
            priority
            className="mb-18 "
          />

         

          <input
            placeholder="Brugernavn"
            className="w-72 p-3 bg-(--color-surface)"
          />
          <input
            placeholder="Kodeord"
            type="password"
            className="w-72 p-3 bg-(--color-surface) mb-7"
          />
          
          <LoginButton onLoginClick={handleLoginClick} />
        </div>
      </div>
    </>
  );
}
