import { notFound } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { NavButtons } from "@/components/NavButtons";
import { InsurerLogo } from "@/components/InsurerLogo";
import { INSURERS, ProductType } from "@/lib/insurers";

function inr(n: number) {
  return "\u20B9" + n.toLocaleString("en-IN");
}

async function getOrIssuePolicy(leadId: string) {
  const existing = await prisma.policy.findUnique({ where: { leadId } });
  if (existing) return existing;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { quotations: { where: { selected: true } } },
  });
  const selected = lead?.quotations[0];
  if (!lead || !selected) return null;

  const policyNumber = `NICE/${selected.insurerCode.split("_")[0].toUpperCase()}/${Math.floor(
    Math.random() * 900000 + 100000
  )}`;

  const policy = await prisma.policy.create({
    data: {
      leadId,
      policyNumber,
      insurerCode: selected.insurerCode,
      insurerName: selected.insurerName,
      planName: selected.planName,
      coverAmount: selected.coverAmount,
      premium: selected.premiumPerYear,
      status: "ISSUED",
      issuedAt: new Date(),
    },
  });

  await prisma.lead.update({ where: { id: leadId }, data: { status: "ISSUED" } });

  return policy;
}

export default async function PolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  const policy = await getOrIssuePolicy(id);
  if (!policy) notFound();

  const ref = lead.productType
    ? INSURERS[lead.productType as ProductType].find((i) => i.code === policy.insurerCode)
    : undefined;

  return (
    <Shell stage="policy">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        Policy issued
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">Available instantly in the customer&apos;s portal.</p>

      <div className="bg-white border border-[#D3E6EA] rounded-lg p-6 max-w-lg mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#E6F4F6] text-[#009FAF] text-[11px] font-semibold px-3 py-1 rounded-bl-md">
          ACTIVE
        </div>
        <div className="flex items-center gap-3 mb-4">
          <InsurerLogo name={policy.insurerName} color={ref?.color ?? "#0F2A2E"} insurerRef={ref} size={56} />
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[#7A979D]">{policy.insurerName}</div>
            <div style={{ fontFamily: "var(--font-display)" }} className="text-lg text-[#0F2A2E]">
              {policy.planName}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <span className="text-[#7A979D]">Policyholder</span>
          <span className="text-[#0F2A2E] font-medium text-right">{lead.name}</span>
          <span className="text-[#7A979D]">Policy number</span>
          <span className="text-[#0F2A2E] font-medium text-right font-mono text-[13px]">{policy.policyNumber}</span>
          <span className="text-[#7A979D]">Cover amount</span>
          <span className="text-[#0F2A2E] font-medium text-right">{inr(policy.coverAmount)}</span>
          <span className="text-[#7A979D]">Annual premium</span>
          <span className="text-[#0F2A2E] font-medium text-right">{inr(policy.premium)}</span>
        </div>
        <div className="flex items-center gap-2 text-[#3F5D63] text-xs mb-4">
          <FileText size={13} /> Policy document ready for download
        </div>
        <button className="w-full flex items-center justify-center gap-2 border border-[#D3E6EA] text-[#0F2A2E] text-sm font-semibold py-2.5 rounded-md hover:border-[#009FAF]">
          <Download size={14} /> Download policy document
        </button>
      </div>

      <NavButtons backHref={`/leads/${id}/status`} />
    </Shell>
  );
}
