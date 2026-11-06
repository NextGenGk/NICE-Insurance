"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { NavButtons } from "@/components/NavButtons";

type Status = "idle" | "checking" | "verified" | "invalid";

function StatusPill({ s }: { s: Status }) {
  if (s === "idle") return null;
  const cls =
    s === "verified"
      ? "bg-[#E6F4F6] text-[#009FAF]"
      : s === "checking"
      ? "bg-[#E6F4F6] text-[#3F5D63]"
      : "bg-[#FBEAEA] text-[#B3423E]";
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 ${cls}`}>
      {s === "checking" && <Loader2 size={11} className="animate-spin" />}
      {s === "verified" && <CheckCircle2 size={11} />}
      {s === "verified" ? "Verified" : s === "checking" ? "Checking…" : "Format invalid"}
    </span>
  );
}

export function KycForm({
  leadId,
  initialPanStatus,
  initialAadhaarStatus,
}: {
  leadId: string;
  initialPanStatus: Status;
  initialAadhaarStatus: Status;
}) {
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [panStatus, setPanStatus] = useState<Status>(initialPanStatus);
  const [aadhaarStatus, setAadhaarStatus] = useState<Status>(initialAadhaarStatus);

  async function verify(type: "PAN" | "AADHAAR") {
    const value = type === "PAN" ? pan : aadhaar;
    const setStatus = type === "PAN" ? setPanStatus : setAadhaarStatus;
    setStatus("checking");
    const res = await fetch("/api/kyc/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, type, value }),
    });
    const data = await res.json();
    setStatus(data.valid ? "verified" : "invalid");
  }

  return (
    <div>
      <div className="bg-white border border-[#D3E6EA] rounded-lg p-5 max-w-xl mb-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium text-[#3F5D63]">PAN number</label>
            <StatusPill s={panStatus} />
          </div>
          <div className="flex gap-2">
            <input
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="flex-1 border border-[#D3E6EA] rounded-md px-3 py-2 text-sm tracking-wider font-mono focus:outline-none focus:border-[#009FAF]"
            />
            <button
              onClick={() => verify("PAN")}
              disabled={!pan}
              className="text-sm font-semibold text-[#0F2A2E] border border-[#D3E6EA] rounded-md px-3 disabled:opacity-40 hover:border-[#009FAF]"
            >
              Verify
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium text-[#3F5D63]">Aadhaar number</label>
            <StatusPill s={aadhaarStatus} />
          </div>
          <div className="flex gap-2">
            <input
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
              placeholder="XXXX XXXX XXXX"
              maxLength={12}
              className="flex-1 border border-[#D3E6EA] rounded-md px-3 py-2 text-sm tracking-wider font-mono focus:outline-none focus:border-[#009FAF]"
            />
            <button
              onClick={() => verify("AADHAAR")}
              disabled={!aadhaar}
              className="text-sm font-semibold text-[#0F2A2E] border border-[#D3E6EA] rounded-md px-3 disabled:opacity-40 hover:border-[#009FAF]"
            >
              Verify
            </button>
          </div>
          <div className="text-[11px] text-[#7A979D] mt-1.5">Stored masked (XXXX XXXX 1234) — never raw.</div>
        </div>
      </div>
      <NavButtons
        backHref={`/leads/${leadId}/quote`}
        nextHref={`/leads/${leadId}/payment`}
        nextLabel="Proceed to payment"
        nextDisabled={panStatus !== "verified" || aadhaarStatus !== "verified"}
      />
    </div>
  );
}
