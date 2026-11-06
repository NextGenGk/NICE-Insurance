import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { leadId } = await req.json();

  const selected = await prisma.quotation.findFirst({ where: { leadId, selected: true } });
  if (!selected) return NextResponse.json({ error: "no selected quotation" }, { status: 400 });

  const amountPaise = selected.premiumPerYear * 100;
  const forceMock = process.env.MOCK_RZP === "true";
  const razorpay = forceMock ? null : getRazorpay();

  if (!razorpay) {
    const orderId = `mock_order_${Date.now()}`;
    await prisma.payment.create({
      data: {
        leadId,
        amount: selected.premiumPerYear,
        status: "CREATED",
        razorpayOrderId: orderId,
      },
    });

    return NextResponse.json({
      orderId,
      amount: amountPaise,
      currency: "INR",
      keyId: null,
      mock: true,
    });
  }

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `lead_${leadId}`,
  });

  await prisma.payment.create({
    data: { leadId, amount: selected.premiumPerYear, status: "CREATED", razorpayOrderId: order.id },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
