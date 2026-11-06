import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Razorpay calls this directly (no Clerk session), which is why this
// route is listed as public in src/middleware.ts. Configure the same
// webhook secret in the Razorpay dashboard and in RAZORPAY_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rawBody = await req.text();

  if (secret) {
    const signature = req.headers.get("x-razorpay-signature");
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (signature !== expected) {
      return NextResponse.json({ error: "invalid signature" }, { status: 400 });
    }
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const orderId = event.payload?.payment?.entity?.order_id;
    if (orderId) {
      await prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: { status: "PAID" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
