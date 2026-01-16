"use client";

import type { CSSProperties } from "react";

type ConfettiPiece = {
  left: string;
  width: string;
  height: string;
  background: string;
  rotate: string;
  duration: string;
  delay: string;
};

const CONFETTI: ConfettiPiece[] = [
  { left: "6%", width: "10px", height: "4px", background: "rgba(56, 189, 248, 0.65)", rotate: "12deg", duration: "12s", delay: "-3s" },
  { left: "12%", width: "7px", height: "7px", background: "rgba(34, 197, 94, 0.55)", rotate: "28deg", duration: "10.5s", delay: "-7s" },
  { left: "18%", width: "11px", height: "5px", background: "rgba(99, 102, 241, 0.55)", rotate: "44deg", duration: "13.5s", delay: "-1s" },
  { left: "24%", width: "8px", height: "8px", background: "rgba(16, 185, 129, 0.55)", rotate: "18deg", duration: "11.5s", delay: "-9s" },
  { left: "30%", width: "12px", height: "4px", background: "rgba(244, 114, 182, 0.42)", rotate: "65deg", duration: "14s", delay: "-5s" },
  { left: "36%", width: "9px", height: "9px", background: "rgba(59, 130, 246, 0.45)", rotate: "35deg", duration: "12.5s", delay: "-11s" },
  { left: "42%", width: "12px", height: "5px", background: "rgba(34, 197, 94, 0.5)", rotate: "8deg", duration: "10.8s", delay: "-2s" },
  { left: "48%", width: "8px", height: "4px", background: "rgba(99, 102, 241, 0.5)", rotate: "52deg", duration: "13s", delay: "-8s" },
  { left: "54%", width: "10px", height: "6px", background: "rgba(56, 189, 248, 0.55)", rotate: "22deg", duration: "12.2s", delay: "-6s" },
  { left: "60%", width: "9px", height: "9px", background: "rgba(16, 185, 129, 0.5)", rotate: "41deg", duration: "11.2s", delay: "-10s" },
  { left: "66%", width: "12px", height: "4px", background: "rgba(234, 179, 8, 0.38)", rotate: "70deg", duration: "14.2s", delay: "-4s" },
  { left: "72%", width: "8px", height: "4px", background: "rgba(59, 130, 246, 0.42)", rotate: "30deg", duration: "12.8s", delay: "-12s" },
  { left: "78%", width: "10px", height: "6px", background: "rgba(34, 197, 94, 0.5)", rotate: "16deg", duration: "13.8s", delay: "-7.5s" },
  { left: "84%", width: "7px", height: "7px", background: "rgba(56, 189, 248, 0.52)", rotate: "58deg", duration: "11s", delay: "-9.5s" },
  { left: "90%", width: "12px", height: "5px", background: "rgba(99, 102, 241, 0.5)", rotate: "26deg", duration: "14.5s", delay: "-2.5s" },
  { left: "95%", width: "9px", height: "4px", background: "rgba(16, 185, 129, 0.48)", rotate: "64deg", duration: "12s", delay: "-5.5s" }
];

export default function BirthdayBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="birthday-sparkles absolute inset-0" />

      <div className="birthday-blob birthday-blob--blue absolute -left-24 top-12 h-[360px] w-[520px] rounded-full blur-3xl" />
      <div className="birthday-blob birthday-blob--green absolute -right-32 top-28 h-[380px] w-[520px] rounded-full blur-3xl" />
      <div className="birthday-blob birthday-blob--indigo absolute left-1/2 top-[-120px] h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-3xl" />

      <div className="absolute inset-0">
        {CONFETTI.map((piece, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="birthday-confetti-piece"
            style={
              {
                ["--left" as never]: piece.left,
                ["--w" as never]: piece.width,
                ["--h" as never]: piece.height,
                ["--bg" as never]: piece.background,
                ["--r" as never]: piece.rotate,
                ["--d" as never]: piece.duration,
                ["--delay" as never]: piece.delay
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
