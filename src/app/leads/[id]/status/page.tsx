import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { StatusTracker } from "./StatusTracker";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  return (
    <Shell stage="status">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        Case status
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">Advisor and customer both see this in real time.</p>
      <StatusTracker leadId={id} status={lead.status} />
    </Shell>
  );
}
