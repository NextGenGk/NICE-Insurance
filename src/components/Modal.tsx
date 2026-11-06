"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#01718B]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#D3E6EA] sticky top-0 bg-white rounded-t-xl">
          <div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-lg text-[#0F2A2E]">
              {title}
            </h2>
            {subtitle && <p className="text-[13px] text-[#3F5D63] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#7A979D] hover:text-[#0F2A2E] hover:bg-[#E6F4F6] rounded-md p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
