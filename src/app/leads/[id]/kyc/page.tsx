import { notFound } from "next/navigation";
import type { KycDocument } from "@prisma/client";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { KycForm } from "./KycForm";

export default async function KycPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { kycDocuments: true } });
  if (!lead) notFound();

  const pan = lead.kycDocuments.find((d: KycDocument) => d.type === "PAN");
  const aadhaar = lead.kycDocuments.find((d: KycDocument) => d.type === "AADHAAR");

  return (
    <Shell stage="kyc">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        KYC verification
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">
        Format-checked here; wired to a live verification API (Surepass/Digio) in the full build.
      </p>
      <KycForm
        leadId={id}
        initialPanStatus={pan?.status === "VERIFIED" ? "verified" : "idle"}
        initialAadhaarStatus={aadhaar?.status === "VERIFIED" ? "verified" : "idle"}
      />
    </Shell>
  );
}
