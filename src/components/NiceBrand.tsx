"use client";

import { useState } from "react";

export function NiceBrand({ dark = true }: { dark?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <div className="mb-8 inline-flex items-center rounded-lg bg-white px-3 py-2 self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nice/logo.png"
          alt="NICE – Network of Insurance & Claims Expert"
          className="h-11 w-auto object-contain"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        style={{ fontFamily: "var(--font-display)" }}
        className={dark ? "text-white text-[19px] mb-1" : "text-[#0F2A2E] text-[19px] mb-1"}
      >
        NICE
      </div>
      <div
        className={
          dark
            ? "text-white/70 text-[10px] tracking-[0.12em] uppercase leading-tight"
            : "text-[#7A979D] text-[10px] tracking-[0.12em] uppercase leading-tight"
        }
      >
        Network of Insurance &amp; Claims Expert
      </div>
    </div>
  );
}
