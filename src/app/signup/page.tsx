"use client";
import React, { useState } from 'react';
import Image from "next/image";
import SignUpButton from "@/components/buttons/SignUpButton";
import router from 'next/router';




export default function LoginPage() {
const [acceptedTerms, setAcceptedTerms] = useState(false);


const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/dashboard");
  };


return(
<>
<div className="absolute inset-0 w-full h-full overflow-hidden z-10 ">
    <Image src="/background/washworld-background.png" 
    alt="Baggrund"
    fill
    priority
    />

    <div className="absolute inset-0 bg-black/40 z-20" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full gap-4">

            <h2 className="-mt-4 text-white text-3xl font-bold">Velkommen til</h2>

            <Image
            src="/logos/washworld-white.png"
            alt="Wash World logo"
            width={234}
            height={102}
            priority
            className="mb-18 "
            />

            <input placeholder="Fornavn" className="w-72 p-3 bg-white"/>
            <input placeholder="Efternavn" className="w-72 p-3 bg-white"/>
            <input placeholder="Email" className="w-72 p-3 bg-white"/>
            <input placeholder="Kodeord" className="w-72 p-3 bg-white"/>
            <input placeholder="Gentag kodeord" type="password" className="w-72 p-3 bg-white"/>
        
            <label className="mx-auto mt-2.5 flex w-full max-w-72 items-center justify-center gap-2 text-[0.95rem] font-semibold text-(--white-white)">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 accent-(--brand-green-01)"
            />
            <span>
              Jeg accepterer{" "}
              <a href="#" className="text-(--color-secondary)">
                abonnementsvilkår
              </a>
            </span>
          </label>
           <SignUpButton onLoginClick={handleLoginClick} onSignupClick={handleSignupClick}/>
        </div>
    </div>
</>
)
}
