"use client";

import React from "react";
import Image from "next/image";
import AppHeader from '@/components/AppHeader';
import { 
    VaskselvDetails,
    StovsugerDetails,
    VaskehallDetails
} from "@/data/detailsPageData";
import "./page.css";
import AngleButton from "@/components/buttons/AngleButton";



export default function DetailsPage() {
  return (

            <div className="flex h-full flex-col">
              <AppHeader />
        
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
                  Vaskehaller
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

                <section className="mt-12">
                  <h2 className="mb-5 px-8 text-2xl font-bold text-black">
                  Vask selv
                  </h2>
        
                  <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
                    {VaskselvDetails.map((Vaskselv) => (
                      <VaskselvCard
                        key={Vaskselv.id}
                        image={Vaskselv.image}
                        title={Vaskselv.title}
                        status={Vaskselv.status}
                      />
                    ))} 
                  </div>

                </section>

                 <section className="mt-12">
                  <h2 className="mb-5 px-8 text-2xl font-bold text-black">
                  Støvsugere
                  </h2>
        
                  <div className="carousel-scroll flex gap-4 overflow-x-auto px-8 pb-3">
                    {StovsugerDetails.map((Stovsuger) => (
                      <StovsugerCard
                        key={Stovsuger.id}
                        image={Stovsuger.image}
                        title={Stovsuger.title}
                        status={Stovsuger.status}
                      />
                    ))} 
                  </div>

                </section>
</div>
)
}

     
function VaskehallCard({ 
    image, 
    title, 
    status 
}) {
  return (
    <button className=" h-min-75 shrink-0 overflow-hidden board-white/90 bg-white font-bold shadow-md flex items-end">
        <div className="flex flex-row items-center justify-start gap-2 p-1 min-w-50">
      <Image
        src={image}
        alt={title}
        className=""
        width={67}
        height={67}
      />
      {title}
    </div>
    <AngleButton text={"Ledig"} />
    </button>
  );
}

function VaskselvCard({ 
    image, 
    title, 
    status 
}) {
  return (
    <button className=" h-min-75 shrink-0 overflow-hidden board-white/90 bg-white font-bold shadow-md flex items-end">
        <div className="flex flex-row items-center justify-start gap-2 p-1 min-w-50">
      <Image
        src={image}
        alt={title}
        className=""
        width={67}
        height={67}
      />
      {title}
    </div>
    <AngleButton text={"Ledig"} />
    </button>
  );
}

function StovsugerCard({ 
    image, 
    title, 
    status 
}) {
  return (
    <button className=" h-min-75 shrink-0 overflow-hidden board-white/90 bg-white font-bold shadow-md flex items-end">
        <div className="flex flex-row items-center justify-start gap-2 p-3 min-w-50">
      <Image
        src={image}
        alt={title}
        className=""
        width={67}
        height={80}
      />
      {title}
    </div>
    <AngleButton text={"Ledig"} />
    </button>
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

