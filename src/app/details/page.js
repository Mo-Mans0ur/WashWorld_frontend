"use client";

import React from "react";
import Image from "next/image";
import AppHeader from '@/components/AppHeader';
import ScreenLayout from "@/components/ScreenLayout";
import { 
    VaskselvDetails,
    StovsugerDetails,
    VaskehallDetails
} from "@/data/detailsPageData";
import "./page.css";



export default function DetailsPage() {
  return (

            <div className="flex h-full flex-col">
              <AppHeader />
        
              <ScreenLayout>
        <HeaderThing text="Herlev" className="mb-6" />


        <section className="locationInfo">
          <div>
            <h1>Herlev</h1>
            <p>Dynamovej 4, 2860 Søborg</p>
            <p>Miljøvenlig bilvask</p>
            <p>ID: 1040</p>
          </div>

          <div className="openingCircle">7-22</div>
        </section>


        <section className="statusSection">
          <h2>Live Status</h2>

          <div className="statusBox">
            <div>
              🚗 <span>1 / 3</span>
            </div>

            <div>
              🚿 <span>2 / 3</span>
            </div>

            <div>
              🧹 <span>0 / 5</span>
            </div>
          </div>
        </section>

        <section className="mt-12">
                  <h2 className="mb-5 px-8 text-2xl font-bold text-black">
                    {VaskehallDetails[0].title}
                  </h2>
        
                  <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
                    {VaskehallDetails.map((Vaskehall) => (
                      <VaskehallCard
                        key={Vaskehall.id}
                        image={Vaskehall.image}
                        title={Vaskehall.title}
                        status={Vaskehall.status}
                      />
                    ))}
                  </div>
                </section>

        </ScreenLayout>
</div>
)
}

     
function VaskehallCard({ 
    image, 
    title, 
    status 
}) {
  return (
    <article className="w-46 shrink-0 overflow-hidden board-white/90 bg-white shadow-md">
      <Image
        src={image}
        alt={title}
        className="w-full h-20 object-cover"
        width={184}
        height={80}
      />
        <p className="px-2 pt-2 text-sm font-bold leading-tight text-neutral-600">
          {status}
        </p>
    </article>
  );
}


function HeaderThing({
  text,
  userName,
  className = "",
}) {
  const content =
    text ?? (userName ? `Hej ${userName}` : "");

  return (
    <section
      className={`relative h-12 overflow-hidden ${className}`}
    >
      <div
        className="
          relative inline-flex h-full
          min-w-[180px]
          items-center
          bg-[var(--brand-green-01)]
          pl-6
          pr-10
          [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]
        "
      >
        <p className="whitespace-nowrap text-2xl font-bold text-white">
          {content}
        </p>
      </div>
    </section>
  );
}