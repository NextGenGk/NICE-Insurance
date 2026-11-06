import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import type { KycDocument } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPan, verifyAadhaar } from "@/lib/kyc";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { leadId, type, value } = await req.json();
  const result = type === "PAN" ? await verifyPan(value) : await verifyAadhaar(value);

  const doc = await prisma.kycDocument.upsert({
    where: {
      // No natural unique constraint on (leadId, type) in the schema by
      // default; find-or-create manually instead.
      id: (await prisma.kycDocument.findFirst({ where: { leadId, type } }))?.id ?? "___none___",
    },
    update: { valueMasked: result.masked, status: result.valid ? "VERIFIED" : "FAILED", verifiedAt: new Date() },
    create: { leadId, type, valueMasked: result.masked, status: result.valid ? "VERIFIED" : "FAILED", verifiedAt: new Date() },
  });

  if (result.valid) {
    const docs = await prisma.kycDocument.findMany({ where: { leadId } });
    const bothVerified =
      docs.some((d: KycDocument) => d.type === "PAN" && d.status === "VERIFIED") &&
      docs.some((d: KycDocument) => d.type === "AADHAAR" && d.status === "VERIFIED");
    if (bothVerified) {
      await prisma.lead.update({ where: { id: leadId }, data: { status: "KYC_PENDING" } });
    }
  }

  return NextResponse.json({ valid: result.valid, masked: result.masked, doc });
}
