"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Lightbulb } from "lucide-react";
import { NavButtons } from "@/components/NavButtons";
import type { ProductType } from "@/lib/insurers";

const PRODUCT_LABELS: Record<ProductType, string> = {
  TRUCK: "truck insurance",
  CAR: "car insurance",
  BIKE: "bike insurance",
  HEALTH: "health insurance",
  HOME: "home insurance",
  OFFICE: "office insurance",
  SHOP: "shop insurance",
  TRAVEL: "travel insurance",
};

export function AdviceForm({
  leadId,
  customerFirstName,
  productType,
}: {
  leadId: string;
  customerFirstName: string;
  productType: ProductType;
}) {
  const [note, setNote] = useState(
    `Hi ${customerFirstName}, here's my recommendation for ${PRODUCT_LABELS[productType]}. After comparing premium, claim ratio, and benefits across available plans, I'd suggest the best-fit option. Please review and let me know if you'd like to proceed.`
  );
  const [sent, setSent] = useState(false);

  async function share() {
    await fetch(`/api/leads/${leadId}/advise`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setSent(true);
  }

  return (
    <div>
      <div className="bg-white border border-[#D3E6EA] rounded-lg p-5 max-w-xl mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#FFF8E8] flex items-center justify-center">
            <Lightbulb size={16} className="text-[#C89B3C]" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[#7A979D]">Advisor note</div>
            <div className="font-semibold text-[#0F2A2E] text-[13px]">Advisor recommendation</div>
          </div>
        </div>
        <label className="block text-[12px] font-medium text-[#3F5D63] mb-2">Note to customer</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="w-full border border-[#D3E6EA] rounded-md px-3 py-2 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#009FAF]"
        />
        <button
          onClick={share}
          className="mt-3 flex items-center gap-2 bg-[#009FAF] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#01718B]"
        >
          <Sparkles size={14} /> {sent ? "Sent to customer" : "Share with customer"}
        </button>
        {sent && (
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[#009FAF]">
            <CheckCircle2 size={14} /> Recommendation delivered. Now proceed to KYC.
          </div>
        )}
      </div>
      <NavButtons backHref={`/leads/${leadId}/quote`} nextHref={`/leads/${leadId}/kyc`} nextLabel="Collect KYC" nextDisabled={!sent} />
    </div>
  );
}
