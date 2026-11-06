import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { getOrCreateQuotes } from "@/lib/quotes";
import { PRODUCT_LABELS, ProductType } from "@/lib/insurers";
import { QuoteBoard } from "./QuoteBoard";

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { profile: true } });
  if (!lead || !lead.productType || !lead.profile) notFound();

  let quotes: Awaited<ReturnType<typeof getOrCreateQuotes>> = [];
  let error: string | null = null;
  try {
    quotes = await getOrCreateQuotes(id);
  } catch (e) {
    quotes = [];
    error = (e as Error).message;
  }

  return (
    <Shell stage="quote">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        Comparing quotes
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">
        {lead.name} &middot; {PRODUCT_LABELS[lead.productType as ProductType]}
      </p>
      {error ? (
        <div className="text-sm text-[#B3423E] bg-[#FBEAEA] rounded-md px-4 py-3 max-w-md">{error}</div>
      ) : (
        <QuoteBoard leadId={id} quotes={quotes} productType={lead.productType} />
      )}
    </Shell>
  );
}
