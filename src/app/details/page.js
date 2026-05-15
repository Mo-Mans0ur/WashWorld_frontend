"use client";

import React from "react";
import Image from "next/image";
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav'; 

import "./page.css";



export default function DetailsPage() {
  return (
    <>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/background/washworld-background.png"
          alt="Baggrund"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[var(--color-overlay-dark-40)]" />
      </div>


      <main className="mapDetailsPage">
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

        {/* VASKEHALLER */}
        <MachineSection title="Vaskehaller">
          <MachineCard
            title="Vaskehal 01"
            status="Ledig"
            type="free"
            label="WASH"
          />

          <MachineCard
            title="Vaskehal 02"
            status="Optaget"
            type="busy"
            label="WASH"
          />

          <MachineCard
            title="Vaskehal 03"
            status="Ledig"
            type="free"
            label="WASH"
          />
        </MachineSection>

        {/* VASK SELV */}
        <MachineSection title="Vask selv">
          <MachineCard
            title="Vaskehal 01"
            status="Optaget"
            type="busy"
            label="WASH SELV"
          />

          <MachineCard
            title="Vaskehal 02"
            status="Ude af drift"
            type="offline"
            label="WASH SELV"
          />

          <MachineCard
            title="Vaskehal 03"
            status="Ledig"
            type="free"
            label="WASH SELV"
          />
        </MachineSection>

        {/* STØVSUGERE */}
        <MachineSection title="Støvsugere">
          <MachineCard
            title="Støvsuger 01"
            status="Ledig"
            type="free"
            vacuum
          />

          <MachineCard
            title="Støvsuger 02"
            status="Ledig"
            type="free"
            vacuum
          />

          <MachineCard
            title="Støvsuger 03"
            status="Optaget"
            type="busy"
            vacuum
          />
        </MachineSection>

        <button className="startWashButton">
          Start vask
        </button>
      </main>
    </>
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

function MachineSection({
  title,
  children,
}) {
  return (
    <section className="machineSection">
      <h2>
        {title} <span className="infoIcon">i</span>
      </h2>

      <div className="machineCarousel">
        {children}
      </div>
    </section>
  );
}

function MachineCard({
  title,
  status,
  type,
  label,
  vacuum,
}) {
  return (
    <div className="machineCard">
      <div className="machineImage">
        {vacuum ? (
          <span className="vacuumEmoji">
            🚘〰️
          </span>
        ) : (
          <>
            <div className="machineImageTop">
              {label}
            </div>

            <span className="carEmoji">
              🚗
            </span>
          </>
        )}
      </div>

      <div className="machineTitle">
        {title}
      </div>

      <div className={`machineStatus ${type}`}>
        {status}
      </div>
    </div>
  );
}