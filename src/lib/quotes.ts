import { prisma } from "./prisma";
import { generateQuotes } from "./groq";
import type { ProductType } from "./insurers";

export async function getOrCreateQuotes(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { profile: true, quotations: true },
  });
  if (!lead || !lead.profile || !lead.productType) {
    throw new Error("Lead is missing product type or profile — complete those steps first.");
  }

  if (lead.quotations.length > 0) return lead.quotations;

  const results = await generateQuotes({
    productType: lead.productType as ProductType,
    age: lead.profile.age,
    gender: lead.profile.gender,
    city: lead.profile.city,
    sumAssured: lead.profile.sumAssured,
    familySize: lead.profile.familySize,
    preExisting: lead.profile.preExisting,
    preExistingDetails: lead.profile.preExistingDetails,
    policyType: lead.profile.policyType,
    vehicleAgeYrs: lead.profile.vehicleAgeYrs ?? undefined,
    idv: lead.profile.idv,
    ncbPercent: lead.profile.ncbPercent,
    propertyType: lead.profile.propertyType,
    propertyAddress: lead.profile.propertyAddress,
    businessType: lead.profile.businessType,
    travelDestination: lead.profile.travelDestination,
    travelDays: lead.profile.travelDays,
    travellers: lead.profile.travellers,
  });

  const created = await prisma.$transaction(
    results.map((q) =>
      prisma.quotation.create({
        data: {
          leadId,
          insurerCode: q.insurerCode,
          insurerName: q.insurerName,
          planName: q.planName,
          premiumPerYear: q.premiumPerYear,
          coverAmount: q.coverAmount,
          policyTermYears: q.policyTermYears,
          claimSettlementRatio: q.claimSettlementRatio,
          highlight: q.highlight,
          source: q.source,
        },
      })
    )
  );

  await prisma.lead.update({ where: { id: leadId }, data: { status: "QUOTED" } });

  return created;
}
