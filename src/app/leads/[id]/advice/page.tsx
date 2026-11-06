import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { AdviceForm } from "./AdviceForm";

export default async function AdvicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { profile: true } });
  if (!lead || !lead.productType) notFound();

  return (
    <Shell stage="advice">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        Advisor recommendation
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">
        Add your advisor recommendation for {lead.name} after selecting a quotation.
      </p>
      <AdviceForm
        leadId={id}
        customerFirstName={lead.name.split(" ")[0]}
        productType={lead.productType}
      />
    </Shell>
  );
}
