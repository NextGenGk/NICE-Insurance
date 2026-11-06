"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Quotation } from "@prisma/client";
import { BadgeCheck, AlertCircle, Eye } from "lucide-react";
import { NavButtons } from "@/components/NavButtons";
import { InsurerLogo } from "@/components/InsurerLogo";
import { INSURERS, ProductType } from "@/lib/insurers";
import { QuoteDetailModal } from "./QuoteDetailModal";

function inr(n: number) {
  return "\u20B9" + n.toLocaleString("en-IN");
}

export function QuoteBoard({
  leadId,
  quotes,
  productType,
}: {
  leadId: string;
  quotes: Quotation[];
  productType: ProductType;
}) {
  const router = useRouter();
  const preSelected = quotes.find((q) => q.selected) ?? null;
  const [selected, setSelected] = useState<Quotation | null>(preSelected);
  const [viewing, setViewing] = useState<Quotation | null>(null);
  const [saving, setSaving] = useState(false);

  const usedFallback = quotes.some((q) => q.source === "fallback_estimate");

  async function selectQuote(q: Quotation) {
    setSaving(true);
    await fetch("/api/quote/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, quotationId: q.id }),
    });
    setSelected(q);
    setSaving(false);
    setViewing(null);
  }

  async function confirmAndContinue() {
    if (!selected) return;
    router.push(`/leads/${leadId}/advice`);
  }

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {quotes.map((q) => {
          const ref = INSURERS[productType].find((i) => i.code === q.insurerCode);
          const isSelected = selected?.id === q.id;
          return (
            <div
              key={q.id}
              className={
                "text-left bg-white rounded-lg p-5 border-2 transition-all relative " +
                (isSelected ? "border-[#009FAF] shadow-sm" : "border-[#D3E6EA] hover:border-[#9AC4CA]")
              }
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-[#E6F4F6] text-[#009FAF] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  SELECTED
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <InsurerLogo name={q.insurerName} color={ref?.color ?? "#0F2A2E"} insurerRef={ref} size={56} />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wide text-[#7A979D] truncate">{q.insurerName}</div>
                  <div className="font-semibold text-[#0F2A2E] text-[13px] leading-tight">{q.planName}</div>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono-brand)" }} className="text-2xl text-[#0F2A2E] mb-1">
                {inr(q.premiumPerYear)}
                <span className="text-xs text-[#7A979D] font-sans">/year</span>
              </div>
              <div className="text-[12px] text-[#3F5D63] mb-3">Cover: {inr(q.coverAmount)}</div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#3F5D63] mb-4">
                <BadgeCheck size={13} className="text-[#009FAF]" /> Claim settlement {q.claimSettlementRatio}
              </div>
              <button
                onClick={() => setViewing(q)}
                className="w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#0F2A2E] border border-[#D3E6EA] rounded-md py-2 hover:border-[#009FAF] transition-colors"
              >
                <Eye size={13} /> View full details
              </button>
            </div>
          );
        })}
      </div>

      {usedFallback && (
        <div className="flex items-center gap-2 text-[12px] text-[#8A6A1A] bg-[#FFF8E8] rounded-md px-3 py-2 mb-4">
          <AlertCircle size={14} /> Using locally estimated rates — set GROQ_API_KEY for live AI pricing.
        </div>
      )}

      <NavButtons
        backHref={`/leads/${leadId}/profile`}
        onNext={confirmAndContinue}
        nextLabel="Collect KYC"
        nextDisabled={!selected || saving}
      />

      <QuoteDetailModal
        open={!!viewing}
        onClose={() => setViewing(null)}
        quote={viewing}
        productType={productType}
        onSelect={selectQuote}
        selecting={saving}
      />
    </div>
  );
}
