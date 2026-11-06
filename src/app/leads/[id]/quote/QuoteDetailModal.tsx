"use client";

import type { Quotation } from "@prisma/client";
import {
  BadgeCheck,
  FileText,
  HeartPulse,
  Truck,
  Car,
  Bike,
  Home,
  Building2,
  Store,
  Plane,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { InsurerLogo } from "@/components/InsurerLogo";
import { INSURERS, ProductType, isMotor, isProperty } from "@/lib/insurers";

function inr(n: number) {
  return "\u20B9" + n.toLocaleString("en-IN");
}

function productIcon(productType: ProductType) {
  switch (productType) {
    case "TRUCK":
      return <Truck size={13} />;
    case "CAR":
      return <Car size={13} />;
    case "BIKE":
      return <Bike size={13} />;
    case "HEALTH":
      return <HeartPulse size={13} />;
    case "HOME":
      return <Home size={13} />;
    case "OFFICE":
      return <Building2 size={13} />;
    case "SHOP":
      return <Store size={13} />;
    case "TRAVEL":
      return <Plane size={13} />;
    default:
      return <FileText size={13} />;
  }
}

function requiredDocuments(productType: ProductType): string[] {
  const docs = ["PAN card", "Aadhaar card (masked at storage)"];
  if (productType === "HEALTH") {
    docs.push("Family member ID proofs (if floater)");
    docs.push("Pre-existing condition declaration, if applicable");
  }
  if (isMotor(productType)) {
    docs.push("Vehicle RC copy");
    docs.push("Previous policy copy (for No Claim Bonus validation)");
    if (productType === "TRUCK") {
      docs.push("Goods carriage permit & fitness certificate");
    }
  }
  if (isProperty(productType)) {
    docs.push("Property address proof");
    docs.push("Previous policy copy, if renewing");
    if (productType !== "HOME") docs.push("Stock / contents inventory list");
  }
  if (productType === "TRAVEL") {
    docs.push("Passport copy");
    docs.push("Travel itinerary / ticket");
  }
  return docs;
}

export function QuoteDetailModal({
  open,
  onClose,
  quote,
  productType,
  onSelect,
  selecting,
}: {
  open: boolean;
  onClose: () => void;
  quote: Quotation | null;
  productType: ProductType;
  onSelect: (q: Quotation) => void;
  selecting: boolean;
}) {
  if (!quote) return null;
  const ref = INSURERS[productType].find((i) => i.code === quote.insurerCode);

  return (
    <Modal open={open} onClose={onClose} title={quote.planName} subtitle={quote.insurerName} maxWidth="max-w-xl">
      <div className="flex items-center gap-4 mb-5">
        <InsurerLogo name={quote.insurerName} color={ref?.color ?? "#0F2A2E"} insurerRef={ref} size={64} />
        <div>
          <div className="font-semibold text-[#0F2A2E]">{quote.insurerName}</div>
          <div className="text-[13px] text-[#3F5D63]">{quote.planName}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-[#E6F4F6] rounded-lg p-4">
          <div className="text-[11px] uppercase tracking-wide text-[#7A979D] mb-1">Annual premium</div>
          <div style={{ fontFamily: "var(--font-mono-brand)" }} className="text-xl text-[#0F2A2E]">
            {inr(quote.premiumPerYear)}
          </div>
        </div>
        <div className="bg-[#E6F4F6] rounded-lg p-4">
          <div className="text-[11px] uppercase tracking-wide text-[#7A979D] mb-1">Cover amount</div>
          <div style={{ fontFamily: "var(--font-mono-brand)" }} className="text-xl text-[#0F2A2E]">
            {inr(quote.coverAmount)}
          </div>
        </div>
        <div className="bg-[#E6F4F6] rounded-lg p-4">
          <div className="text-[11px] uppercase tracking-wide text-[#7A979D] mb-1">Policy term</div>
          <div className="text-[#0F2A2E] font-medium">{quote.policyTermYears} year(s)</div>
        </div>
        <div className="bg-[#E6F4F6] rounded-lg p-4">
          <div className="text-[11px] uppercase tracking-wide text-[#7A979D] mb-1">Claim settlement ratio</div>
          <div className="flex items-center gap-1.5 text-[#0F2A2E] font-medium">
            <BadgeCheck size={14} className="text-[#009FAF]" /> {quote.claimSettlementRatio}
          </div>
        </div>
      </div>

      {quote.highlight && (
        <div className="text-sm text-[#3F5D63] bg-[#FFF8E8] border border-[#E8D88C] rounded-lg p-3 mb-5">
          {quote.highlight}
        </div>
      )}

      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#3F5D63] uppercase tracking-wide mb-2">
          {productIcon(productType)}
          Documents required to proceed
        </div>
        <ul className="space-y-1.5">
          {requiredDocuments(productType).map((d) => (
            <li key={d} className="text-sm text-[#0F2A2E] flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-[#009FAF] mt-2 shrink-0" /> {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-[11px] text-[#7A979D] mb-5">
        Source: {quote.source === "ai_estimate" ? "AI-estimated, grounded in current market rate cards" : "Locally estimated"} &middot; Not a final binding quote.
      </div>

      <button
        onClick={() => onSelect(quote)}
        disabled={selecting}
        className="w-full bg-[#009FAF] text-white text-sm font-semibold py-2.5 rounded-md hover:bg-[#01718B] disabled:opacity-60"
      >
        {selecting ? "Selecting\u2026" : quote.selected ? "Selected \u2014 continue" : "Select this plan"}
      </button>
    </Modal>
  );
}
