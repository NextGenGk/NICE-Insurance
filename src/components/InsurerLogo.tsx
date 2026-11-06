"use client";

import { useState } from "react";
import Image from "next/image";
import type { InsurerRef } from "@/lib/insurers";

export function InsurerLogo({
  name,
  color,
  insurerRef,
  size = 56,
}: {
  name: string;
  color: string;
  insurerRef?: InsurerRef;
  size?: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const src = insurerRef?.logoFile ? `/logos/${insurerRef.logoFile}` : undefined;

  if (src && !imgErr) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-white rounded-xl border border-[#D3E6EA] shrink-0 overflow-hidden"
      >
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          sizes={`${size}px`}
          className="w-full h-full object-contain p-1"
          onError={() => setImgErr(true)}
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: insurerRef?.color ?? color,
        fontSize: Math.round(size * 0.34),
      }}
      className="flex items-center justify-center rounded-xl text-white font-bold shrink-0"
    >
      {initials}
    </div>
  );
}
