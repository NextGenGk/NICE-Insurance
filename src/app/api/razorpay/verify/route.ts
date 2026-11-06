import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { leadId, razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = await req.json();

  if (!leadId || !razorpay_order_id) {
    return NextResponse.json({ error: "leadId and razorpay_order_id required" }, { status: 400 });
  }

  if (!mock) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ error: "razorpay not configured" }, { status: 500 });

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "signature mismatch" }, { status: 400 });
    }
  }

  await prisma.payment.updateMany({
    where: { leadId, razorpayOrderId: razorpay_order_id },
    data: { status: "PAID", razorpayPaymentId: razorpay_payment_id ?? `mock_payment_${Date.now()}` },
  });

  await prisma.lead.update({ where: { id: leadId }, data: { status: "SUBMITTED" } });

  return NextResponse.json({ ok: true });
}
