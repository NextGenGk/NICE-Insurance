"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavButtons({
  backHref,
  onNext,
  nextHref,
  nextLabel = "Continue",
  nextDisabled,
}: {
  backHref?: string;
  onNext?: () => void;
  nextHref?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-2">
      {backHref ? (
        <Link
          href={backHref}
          className="flex items-center gap-1 text-[#3F5D63] text-sm font-medium hover:text-[#0F2A2E] transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </Link>
      ) : (
        <span />
      )}

      {nextHref && !onNext && (
        <Link
          href={nextDisabled ? "#" : nextHref}
          aria-disabled={nextDisabled}
          className={
            "flex items-center gap-1 bg-[#009FAF] text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#01718B] transition-colors " +
            (nextDisabled ? "opacity-40 pointer-events-none" : "")
          }
        >
          {nextLabel} <ChevronRight size={16} />
        </Link>
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex items-center gap-1 bg-[#009FAF] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#01718B] transition-colors"
        >
          {nextLabel} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
