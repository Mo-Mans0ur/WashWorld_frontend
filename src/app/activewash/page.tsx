"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AssistanceButton, Button } from "@/components/buttons";
import { saveLatestSingleWashReceipt } from "@/data/receiptHistory";
import { paymentPlans } from "@/data/singleWashData";

// ─── Constants ────────────────────────────────────────────────────────────────
const SESSION_ID = 1042;

// ─── Types ───────────────────────────────────────────────────────────────────
type WashStage = "forbereder" | "sæbe" | "skyl" | "tørring" | "færdig";

function getStage(p: number): WashStage {
  if (p < 10) return "forbereder";
  if (p < 40) return "sæbe";
  if (p < 70) return "skyl";
  if (p < 90) return "tørring";
  return "færdig";
}

const STAGE_LABEL: Record<WashStage, string> = {
  forbereder: "Vasken forberedes… sæt dig godt\ntil rette og nyd din pause.",
  sæbe: "Vasken er i gang, sæt dig godt\ntil rette og nyd din pause.",
  skyl: "Skylning er i gang – næsten\nhelt ren!",
  tørring: "Tørring er i gang, snart\nklar til afhentning.",
  færdig: "Din bil er ren og klar!\nVelkommen tilbage.",
};

// ─── Animation data ───────────────────────────────────────────────────────────
const DROPS = [
  { x: "16%", delay: 0.0, dur: 0.7, w: 3.5, h: 9 },
  { x: "22%", delay: 0.24, dur: 0.62, w: 3.0, h: 7 },
  { x: "29%", delay: 0.09, dur: 0.74, w: 4.0, h: 10 },
  { x: "36%", delay: 0.38, dur: 0.66, w: 3.5, h: 8 },
  { x: "43%", delay: 0.15, dur: 0.71, w: 3.0, h: 7 },
  { x: "50%", delay: 0.46, dur: 0.64, w: 5.0, h: 11 },
  { x: "57%", delay: 0.05, dur: 0.75, w: 3.5, h: 9 },
  { x: "64%", delay: 0.3, dur: 0.68, w: 3.0, h: 7 },
  { x: "71%", delay: 0.54, dur: 0.62, w: 4.0, h: 10 },
  { x: "77%", delay: 0.18, dur: 0.72, w: 3.5, h: 8 },
  { x: "84%", delay: 0.42, dur: 0.65, w: 3.0, h: 7 },
] as const;

const BUBBLES = [
  { x: "13%", y: 52, size: 22, delay: 0.0, dur: 2.4 },
  { x: "27%", y: 32, size: 16, delay: 0.7, dur: 2.0 },
  { x: "50%", y: 22, size: 20, delay: 1.3, dur: 2.6 },
  { x: "67%", y: 35, size: 15, delay: 0.4, dur: 2.1 },
  { x: "81%", y: 52, size: 18, delay: 1.0, dur: 2.3 },
  { x: "20%", y: 86, size: 14, delay: 1.6, dur: 2.0 },
  { x: "45%", y: 80, size: 18, delay: 0.8, dur: 2.5 },
  { x: "73%", y: 78, size: 13, delay: 1.2, dur: 1.9 },
  { x: "37%", y: 120, size: 16, delay: 0.3, dur: 2.2 },
  { x: "63%", y: 112, size: 14, delay: 1.1, dur: 2.4 },
  { x: "10%", y: 115, size: 11, delay: 0.6, dur: 1.8 },
  { x: "88%", y: 108, size: 12, delay: 1.8, dur: 2.0 },
] as const;

const RIVULETS = [
  { x: "19%", y: 18, len: 65, delay: 0.0, dur: 0.9 },
  { x: "33%", y: 12, len: 55, delay: 0.35, dur: 0.82 },
  { x: "50%", y: 10, len: 72, delay: 0.68, dur: 1.0 },
  { x: "67%", y: 14, len: 58, delay: 0.18, dur: 0.88 },
  { x: "81%", y: 20, len: 48, delay: 0.5, dur: 0.94 },
  { x: "26%", y: 70, len: 45, delay: 0.8, dur: 0.85 },
  { x: "74%", y: 68, len: 42, delay: 0.42, dur: 0.92 },
] as const;

const WIND_GUSTS = [
  { y: 78, wPrimary: 4.0, wShadow: 1.8, dur: 0.9, delay: 0.0 },
  { y: 96, wPrimary: 3.4, wShadow: 1.5, dur: 0.82, delay: 0.22 },
  { y: 114, wPrimary: 3.8, wShadow: 1.7, dur: 0.96, delay: 0.44 },
  { y: 131, wPrimary: 3.0, wShadow: 1.3, dur: 0.88, delay: 0.14 },
  { y: 148, wPrimary: 2.6, wShadow: 1.1, dur: 0.78, delay: 0.36 },
] as const;

const SPARKLES = [
  { x: 22, y: 52, size: 13, delay: 0.0 },
  { x: 274, y: 48, size: 12, delay: 0.28 },
  { x: 150, y: 10, size: 14, delay: 0.56 },
  { x: 280, y: 148, size: 11, delay: 0.84 },
  { x: 14, y: 155, size: 12, delay: 0.42 },
  { x: 212, y: 8, size: 13, delay: 0.7 },
  { x: 52, y: 118, size: 10, delay: 0.18 },
  { x: 248, y: 112, size: 10, delay: 0.62 },
] as const;

// ─── Completion modal ─────────────────────────────────────────────────────────
interface CompletionModalProps {
  onClose: () => void;
  onReceipt: () => void;
}

function CompletionModal({ onClose, onReceipt }: CompletionModalProps) {
  return (
    <>
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.88); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes dropFloat {
          0%,100% { transform: translateY(0px) rotate(180deg); }
          50%     { transform: translateY(-6px) rotate(180deg); }
        }
        @keyframes bubbleFloat {
          0%,100% { transform: scale(1);    opacity: 0.5;  }
          50%     { transform: scale(1.08); opacity: 0.75; }
        }
        @keyframes sparkPop {
          0%,100% { transform: scale(0.7); opacity: 0.4; }
          50%     { transform: scale(1.1); opacity: 1;   }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 40,
          animation: "backdropIn 0.25s ease",
        }}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 40px)",
          maxWidth: 360,
          background: "white",
          borderRadius: 3,
          padding: "28px 24px 24px",
          zIndex: 50,
          animation: "cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
      >
        {/* Title */}
        <h2
          id="modal-title"
          style={{
            textAlign: "center",
            fontSize: 26,
            fontWeight: 800,
            color: "#111",
            margin: "0 0 20px",
            letterSpacing: "-0.01em",
          }}
        >
          Vask afsluttet
        </h2>

        {/* Icon area with decorative drops, bubbles and sparkles */}
        <div
          style={{
            position: "relative",
            height: 148,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {/* Top-right large drop */}
          <div
            style={{
              position: "absolute",
              top: 4,
              right: "22%",
              width: 18,
              height: 26,
              background: "linear-gradient(160deg, #66bb6a, #2e7d32)",
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              transform: "rotate(180deg)",
              animation: "dropFloat 2.2s ease-in-out 0s infinite",
            }}
          />
          {/* Bottom-left medium drop */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "18%",
              width: 14,
              height: 20,
              background: "linear-gradient(160deg, #81c784, #388e3c)",
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              transform: "rotate(180deg)",
              animation: "dropFloat 2.6s ease-in-out 0.4s infinite",
            }}
          />
          {/* Top-left small drop */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "24%",
              width: 10,
              height: 15,
              background: "linear-gradient(160deg, #a5d6a7, #43a047)",
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              transform: "rotate(180deg)",
              animation: "dropFloat 2.0s ease-in-out 0.8s infinite",
            }}
          />
          {/* Bottom-right small drop */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: "16%",
              width: 11,
              height: 17,
              background: "linear-gradient(160deg, #81c784, #2e7d32)",
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              transform: "rotate(180deg)",
              animation: "dropFloat 2.4s ease-in-out 0.6s infinite",
            }}
          />

          {/* Large bubble top-left */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "8%",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid rgba(100,180,100,0.45)",
              background: "rgba(150,220,150,0.08)",
              animation: "bubbleFloat 3s ease-in-out 0s infinite",
            }}
          />
          {/* Small bubble bottom-right */}
          <div
            style={{
              position: "absolute",
              bottom: 4,
              right: "8%",
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "2px solid rgba(100,180,100,0.35)",
              background: "rgba(150,220,150,0.06)",
              animation: "bubbleFloat 2.8s ease-in-out 0.5s infinite",
            }}
          />

          {/* Sparkle crosses */}
          {(
            [
              { top: 6, left: "42%", size: 10, delay: "0s" },
              { top: 18, right: "6%", size: 8, delay: "0.35s" },
              { bottom: 6, left: "6%", size: 9, delay: "0.7s" },
            ] as const
          ).map((pos, i) => (
            <svg
              key={i}
              width={pos.size * 2}
              height={pos.size * 2}
              viewBox={`0 0 ${pos.size * 2} ${pos.size * 2}`}
              style={{
                position: "absolute",
                ...pos,
                animation: `sparkPop 1.8s ease-in-out ${pos.delay} infinite`,
              }}
            >
              <line
                x1={pos.size}
                y1="0"
                x2={pos.size}
                y2={pos.size * 2}
                stroke="#4caf50"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1={pos.size}
                x2={pos.size * 2}
                y2={pos.size}
                stroke="#4caf50"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ))}

          {/* Main icon — rename to match your actual file */}
          <Image
            src="/icons/vaskafsluttet.png"
            alt="Vask afsluttet"
            width={120}
            height={120}
            style={{ position: "relative", zIndex: 1 }}
          />
        </div>

        {/* Thank you */}
        <p
          style={{
            textAlign: "center",
            fontSize: 17,
            fontWeight: 700,
            color: "#111",
            margin: "0 0 14px",
          }}
        >
          Tak for i dag!
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 14 }} />

        {/* Receipt info */}
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 1.55,
            margin: "0 0 24px",
            whiteSpace: "pre-line",
          }}
        >
          {"Du kan finde kvitteringen\ninde på din profil."}
        </p>

        {/* Buttons */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onReceipt}
            className="flex flex-1 h-12 items-center justify-center bg-(--brand-green-01) font-bold text-white text-sm [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
          >
            Se kvittering
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 h-12 items-center justify-center bg-neutral-500 font-bold text-white text-sm [clip-path:polygon(12%_0,100%_0,100%_100%,0%_100%)]"
          >
            Luk
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Nozzle ───────────────────────────────────────────────────────────────────
function Nozzle({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 280 34"
      style={{ display: "block", width: "100%" }}
      aria-hidden="true"
    >
      <rect
        x="112"
        y="4"
        width="56"
        height="20"
        rx="6"
        fill="white"
        opacity={active ? 0.88 : 0.2}
        style={{ transition: "opacity 0.5s" }}
      />
      {[123, 131, 140, 149, 157].map((x) => (
        <circle
          key={x}
          cx={x}
          cy="19"
          r="3.2"
          fill="rgba(0,26,8,0.62)"
          opacity={active ? 0.9 : 0.22}
          style={{ transition: "opacity 0.5s" }}
        />
      ))}
      <rect
        x="128"
        y="0"
        width="24"
        height="6"
        rx="3"
        fill="white"
        opacity={active ? 0.55 : 0.1}
        style={{ transition: "opacity 0.5s" }}
      />
    </svg>
  );
}

// ─── Car illustration ─────────────────────────────────────────────────────────
const NOZZLE_H = 34;

function CarIllustration({
  stage,
  progress,
}: {
  stage: WashStage;
  progress: number;
}) {
  const showSoap = stage === "sæbe";
  const showRinse = stage === "skyl";
  const showDry = stage === "tørring";
  const showClean = stage === "færdig";
  const showWater = showSoap || showRinse;

  const dirtOpacity = Math.max(0, 1 - progress / 28);
  const cleanOpacity = Math.max(0, (progress - 88) / 12);

  return (
    <>
      <style>{`
        @keyframes cwDrop {
          0%   { transform: translateY(0px);   opacity: 0;    }
          8%   {                               opacity: 0.90; }
          88%  {                               opacity: 0.90; }
          100% { transform: translateY(210px); opacity: 0;    }
        }
        @keyframes cwBubble {
          0%   { transform: scale(0)    translateY(0px);   opacity: 0;    }
          12%  { transform: scale(1.12) translateY(0px);   opacity: 0.95; }
          75%  { transform: scale(1)    translateY(-7px);  opacity: 0.75; }
          93%  { transform: scale(1.06) translateY(-10px); opacity: 0.22; }
          100% { transform: scale(0)    translateY(-13px); opacity: 0;    }
        }
        @keyframes cwRivulet {
          0%   { transform: translateY(-28px); opacity: 0;    }
          14%  {                               opacity: 0.60; }
          86%  {                               opacity: 0.60; }
          100% { transform: translateY(52px);  opacity: 0;    }
        }
        @keyframes cwWind {
          0%   { transform: translateX(14px);  opacity: 0;    }
          20%  { transform: translateX(0px);   opacity: 1;    }
          70%  { transform: translateX(-18px); opacity: 0.88; }
          100% { transform: translateX(-36px); opacity: 0;    }
        }
        @keyframes cwWindShadow {
          0%   { transform: translateX(20px);  opacity: 0;    }
          20%  { transform: translateX(6px);   opacity: 0.50; }
          70%  { transform: translateX(-12px); opacity: 0.42; }
          100% { transform: translateX(-30px); opacity: 0;    }
        }
        @keyframes cwSpark {
          0%   { transform: scale(0.0) rotate(0deg);  opacity: 0;    }
          18%  { transform: scale(1.4) rotate(15deg); opacity: 1;    }
          55%  { transform: scale(1.0) rotate(45deg); opacity: 0.92; }
          82%  { transform: scale(1.2) rotate(72deg); opacity: 0.80; }
          100% { transform: scale(0.0) rotate(90deg); opacity: 0;    }
        }
        @keyframes cwGlow {
          0%,100% { transform: scale(0.3); opacity: 0;    }
          30%,68% { transform: scale(1.0); opacity: 0.28; }
        }
      `}</style>

      <div className="relative mx-auto w-full" style={{ maxWidth: 300 }}>
        <Nozzle active={showWater} />

        <Image
          src="/icons/car.png"
          alt="Car being washed"
          width={560}
          height={330}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            mixBlendMode: "screen",
            filter: showClean
              ? `brightness(${1 + cleanOpacity * 0.2})`
              : dirtOpacity > 0
                ? `brightness(${1 - dirtOpacity * 0.16})`
                : "brightness(1)",
            transition: "filter 0.8s ease",
          }}
          priority
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Water droplets */}
          {showWater &&
            DROPS.map((d, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: d.x,
                  top: 14,
                  width: d.w,
                  height: d.h,
                  borderRadius: "50% 50% 40% 40% / 38% 38% 62% 62%",
                  background: "rgba(255,255,255,0.90)",
                  animation: `cwDrop ${d.dur}s ease-in ${d.delay}s infinite`,
                }}
              />
            ))}

          {/* Soap bubbles */}
          {showSoap &&
            BUBBLES.map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: b.x,
                  top: NOZZLE_H + b.y,
                  width: b.size,
                  height: b.size,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 34% 34%, rgba(255,255,255,0.88), rgba(255,255,255,0.06))",
                  border: "1.5px solid rgba(255,255,255,0.48)",
                  animation: `cwBubble ${b.dur}s ease-in-out ${b.delay}s infinite`,
                }}
              />
            ))}

          {/* Rivulets */}
          {showRinse &&
            RIVULETS.map((r, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: r.x,
                  top: NOZZLE_H + r.y,
                  width: 2.5,
                  height: r.len,
                  borderRadius: 3,
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.72) 30%, rgba(255,255,255,0.72) 70%, rgba(255,255,255,0))",
                  animation: `cwRivulet ${r.dur}s ease-in-out ${r.delay}s infinite`,
                }}
              />
            ))}

          {/* Wind gusts */}
          {showDry && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 300 230"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {WIND_GUSTS.map((g, i) => (
                <g key={i}>
                  <path
                    d={`M 278,${g.y} Q 238,${g.y + 12} 184,${g.y - 7}`}
                    stroke="white"
                    strokeWidth={g.wPrimary}
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      animation: `cwWind ${g.dur}s ease-in-out ${g.delay}s infinite`,
                    }}
                  />
                  <path
                    d={`M 270,${g.y + 8} Q 232,${g.y + 18} 180,${g.y + 3}`}
                    stroke="white"
                    strokeWidth={g.wShadow}
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      animation: `cwWindShadow ${g.dur}s ease-in-out ${g.delay + 0.07}s infinite`,
                    }}
                  />
                </g>
              ))}
            </svg>
          )}

          {/* Sparkles */}
          {showClean && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 300 230"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {SPARKLES.map((s, i) => (
                <g key={i} transform={`translate(${s.x},${s.y})`}>
                  <circle
                    r={s.size * 1.8}
                    fill="white"
                    style={{
                      animation: `cwGlow 1.8s ease-in-out ${s.delay}s infinite`,
                    }}
                  />
                  <g
                    style={{
                      animation: `cwSpark 1.8s ease-in-out ${s.delay}s infinite`,
                    }}
                  >
                    <line
                      x1={-s.size}
                      y1="0"
                      x2={s.size}
                      y2="0"
                      stroke="white"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="0"
                      y1={-s.size}
                      x2="0"
                      y2={s.size}
                      stroke="white"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={-s.size * 0.65}
                      y1={-s.size * 0.65}
                      x2={s.size * 0.65}
                      y2={s.size * 0.65}
                      stroke="white"
                      strokeWidth="2.0"
                      strokeLinecap="round"
                      opacity="0.78"
                    />
                    <line
                      x1={s.size * 0.65}
                      y1={-s.size * 0.65}
                      x2={-s.size * 0.65}
                      y2={s.size * 0.65}
                      stroke="white"
                      strokeWidth="2.0"
                      strokeLinecap="round"
                      opacity="0.78"
                    />
                  </g>
                </g>
              ))}
              <g opacity={cleanOpacity}>
                <path
                  d="M 17,96 L 0,78 L 0,114 Z"
                  fill="white"
                  opacity="0.20"
                />
                <path
                  d="M 283,96 L 300,78 L 300,114 Z"
                  fill="white"
                  opacity="0.20"
                />
              </g>
            </svg>
          )}

          {/* Dirt overlay */}
          {dirtOpacity > 0 && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 300 230"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <g opacity={dirtOpacity} style={{ transition: "opacity 0.7s" }}>
                <ellipse
                  cx="80"
                  cy="168"
                  rx="16"
                  ry="7"
                  fill="rgba(0,0,0,0.32)"
                />
                <ellipse
                  cx="220"
                  cy="165"
                  rx="14"
                  ry="6"
                  fill="rgba(0,0,0,0.28)"
                />
                <ellipse
                  cx="150"
                  cy="175"
                  rx="12"
                  ry="5"
                  fill="rgba(0,0,0,0.24)"
                />
                <path
                  d="M 120,90 Q 124,112 122,134"
                  stroke="rgba(0,0,0,0.22)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 178,88 Q 182,110 180,132"
                  stroke="rgba(0,0,0,0.20)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 112,72 Q 132,60 154,56"
                  stroke="rgba(0,0,0,0.18)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
interface ActiveAutoWashPageProps {
  progress?: number;
  washId?: string | number;
}

export default function ActiveAutoWashPage({
  progress: externalProgress,
  washId = SESSION_ID,
}: ActiveAutoWashPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(externalProgress ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const selectedPlanSlug = searchParams.get("plan") ?? "";
  const selectedPayment = searchParams.get("payment") ?? "card";
  const plate = searchParams.get("plate") ?? "DB 43 234";
  const selectedPlan = paymentPlans.find(
    (plan) => plan.slug === selectedPlanSlug,
  );

  // ─── Progress driver ───────────────────────────────────────────────────────
  // FIX: stop at 100 instead of cycling — without this the modal timeout gets
  // cancelled every 60 ms before it has a chance to fire.
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      return;
    }
    let p = 0;
    const iv = setInterval(() => {
      p += 0.35;
      if (p >= 100) {
        setProgress(100);
        clearInterval(iv); // stay at 100 so the modal effect below can fire
        return;
      }
      setProgress(p);
    }, 60);
    return () => clearInterval(iv);
  }, [externalProgress]);

  // ─── Show modal once wash is complete ─────────────────────────────────────
  useEffect(() => {
    if (progress >= 100 && !modalDismissed) {
      const t = setTimeout(() => setShowModal(true), 800);
      return () => clearTimeout(t);
    }
  }, [progress, modalDismissed]);

  useEffect(() => {
    if (!selectedPlan) return;

    const paymentLabelByMethod: Record<string, string> = {
      card: "Kortbetaling",
      mobilepay: "MobilePay",
      wallet: "Wallet",
    };

    saveLatestSingleWashReceipt({
      planName: selectedPlan.name,
      price: selectedPlan.price,
      plate,
      payment: paymentLabelByMethod[selectedPayment] ?? "Kortbetaling",
    });
  }, [plate, selectedPayment, selectedPlan]);

  const stage = getStage(progress);

  const handleClose = () => {
    setShowModal(false);
    setModalDismissed(true);
    router.push("/dashboard");
  };

  const handleReceipt = () => {
    setShowModal(false);
    router.push("/profile");
  };

  return (
    <div className="flex min-h-full flex-col">

      <div className="flex flex-1 min-h-0 flex-col justify-around px-8 py-6 pb-24">
        <div className="flex flex-col items-center justify-center">
          <AssistanceButton washId={washId} />
          <p className="p-3 text-sm text-(--white-white)/60">ID : {washId}</p>
        </div>

        <div className="px-2">
          <CarIllustration stage={stage} progress={progress} />
        </div>

        <p
          className="whitespace-pre-line px-2 text-center text-base text-(--white-white)"
          aria-live="polite"
        >
          {STAGE_LABEL[stage]}
        </p>

        <div>
          <div className="h-6 w-full overflow-hidden bg-(--color-grey-02)">
            <div
              className="h-full bg-(--color-primary) transition-all duration-300 ease-linear"
              style={{ width: `${Math.max(1, progress)}%` }}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <CompletionModal onClose={handleClose} onReceipt={handleReceipt} />
      )}
    </div>
  );
}
