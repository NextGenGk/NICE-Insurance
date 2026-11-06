import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { ProductPicker } from "./ProductPicker";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) notFound();

  return (
    <Shell stage="product">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        {lead.name}
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">Which product is this enquiry for?</p>
      <ProductPicker leadId={lead.id} />
    </Shell>
  );
}
