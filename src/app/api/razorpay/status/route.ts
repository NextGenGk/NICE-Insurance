import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("leadId");
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  const payment = await prisma.payment.findFirst({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });

  if (!payment) return NextResponse.json({ paid: false });

  if (payment.status === "PAID") {
    return NextResponse.json({ paid: true, paymentId: payment.razorpayPaymentId });
  }

  // Also check if lead status was updated by webhook
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { status: true } });
  if (lead?.status === "SUBMITTED") {
    return NextResponse.json({ paid: true });
  }

  return NextResponse.json({ paid: false, status: payment.status });
}
