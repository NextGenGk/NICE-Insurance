"use client";

import { useState } from "react";
import type { LeadStatus } from "@prisma/client";
import { CheckCircle2, Clock } from "lucide-react";
import { NavButtons } from "@/components/NavButtons";

const STEPS: { key: LeadStatus; label: string }[] = [
  { key: "SUBMITTED", label: "Submitted to insurer" },
  { key: "UNDERWRITING", label: "Financial / medical review" },
  { key: "ISSUED", label: "Underwriting decision" },
];

export function StatusTracker({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const initialIdx = Math.max(
    0,
    STEPS.findIndex((s) => s.key === status)
  );
  const [idx, setIdx] = useState(initialIdx === -1 ? 0 : initialIdx);
  const [busy, setBusy] = useState(false);

  async function advance() {
    const next = STEPS[idx + 1];
    if (!next) return;
    setBusy(true);
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next.key }),
    });
    setIdx(idx + 1);
    setBusy(false);
  }

  const done = idx >= STEPS.length - 1;

  return (
    <div>
      <div className="bg-white border border-[#D3E6EA] rounded-lg p-6 max-w-md mb-6">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-3 mb-4 last:mb-0">
            {i < idx ? (
              <CheckCircle2 size={18} className="text-[#009FAF] shrink-0" />
            ) : i === idx ? (
              <Clock size={18} className="text-[#009FAF] shrink-0" />
            ) : (
              <div className="w-[18px] h-[18px] rounded-full border-2 border-[#D3E6EA] shrink-0" />
            )}
            <span className={i <= idx ? "text-[#0F2A2E] font-medium text-sm" : "text-[#7A979D] text-sm"}>
              {s.label}
            </span>
          </div>
        ))}
        {!done ? (
          <button
            onClick={advance}
            disabled={busy}
            className="mt-3 text-sm font-semibold text-[#0F2A2E] border border-[#D3E6EA] rounded-md px-4 py-2 hover:border-[#009FAF] disabled:opacity-60"
          >
            {busy ? "Updating…" : "Simulate insurer update"}
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-1.5 text-[#009FAF] text-sm font-medium">
            <CheckCircle2 size={16} /> Approved
          </div>
        )}
      </div>
      <NavButtons
        backHref={`/leads/${leadId}/payment`}
        nextHref={`/leads/${leadId}/policy`}
        nextLabel="View policy"
        nextDisabled={!done}
      />
    </div>
  );
}
