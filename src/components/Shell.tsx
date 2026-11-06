import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { NiceBrand } from "./NiceBrand";

export const STAGES = [
  { key: "lead", label: "Lead" },
  { key: "product", label: "Product Type" },
  { key: "profile", label: "Profile" },
  { key: "quote", label: "Quotation" },
  { key: "advice", label: "Advice" },
  { key: "kyc", label: "KYC" },
  { key: "payment", label: "Payment" },
  { key: "status", label: "Underwriting" },
  { key: "policy", label: "Issued" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

function Rail({ current }: { current: StageKey }) {
  const idx = STAGES.findIndex((s) => s.key === current);
  return (
    <div className="flex flex-col gap-0">
      {STAGES.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-start gap-3 relative">
            <div className="flex flex-col items-center">
              <div
                className={
                  "w-3 h-3 rounded-full border-2 shrink-0 mt-1 transition-colors " +
                  (done
                    ? "bg-[#009FAF] border-[#009FAF]"
                    : active
                    ? "border-white bg-white"
                    : "border-white/40 bg-transparent")
                }
              />
              {i < STAGES.length - 1 && (
                <div className={"w-[2px] h-8 " + (done ? "bg-white" : "bg-white/30")} />
              )}
            </div>
            <div
              className={
                "text-[13px] pb-6 -mt-0.5 tracking-wide " +
                (active ? "text-white font-semibold" : done ? "text-white/80" : "text-white/50")
              }
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Shell({ children, stage }: { children: React.ReactNode; stage: StageKey }) {
  return (
    <div className="min-h-screen bg-[#F3F8F9] flex">
      <aside className="w-64 shrink-0 bg-gradient-to-b from-[#01718B] to-[#015A6E] px-6 py-8 hidden md:flex flex-col fixed inset-y-0 left-0 overflow-y-auto">
        <NiceBrand />
        <Rail current={stage} />

        <div className="mt-auto pt-6 border-t border-white/10 text-[10px] leading-relaxed text-white/60">
          <div className="text-white/80 font-medium mb-1">NICE – Network of Insurance &amp; Claims Expert</div>
          <div>H No-C 108, Ground Floor, Opposite Life Worth Hospital, Amapara, Raipur, Chhattisgarh 492001</div>
          <a href="tel:+919771420518" className="block hover:text-white transition-colors mt-1">+91 97714 20518</a>
          <a href="tel:+918210437434" className="block hover:text-white transition-colors">+91 82104 37434</a>
          <a href="mailto:rajeev@niceinsurance.co.in" className="block hover:text-white transition-colors">rajeev@niceinsurance.co.in</a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="border-b border-[#D3E6EA] px-6 md:px-10 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#3F5D63] hover:text-[#0F2A2E] transition-colors md:hidden">
              <ArrowLeft size={18} />
            </Link>
            <div className="md:hidden">
              <NiceBrand dark={false} />
            </div>
            <div className="text-[#0F2A2E] font-medium text-sm hidden md:flex items-center gap-3">
              <Link href="/" className="text-[#3F5D63] hover:text-[#0F2A2E] transition-colors">
                <ArrowLeft size={16} />
              </Link>
              NICE Insurance Workspace
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#7A979D] uppercase tracking-wide border border-[#D3E6EA] rounded-full px-3 py-1">
              Raipur, Chhattisgarh
            </span>
            <UserButton />
          </div>
        </header>
        <main className="flex-1 px-6 md:px-10 py-8 max-w-7xl w-full">{children}</main>
      </div>
    </div>
  );
}
