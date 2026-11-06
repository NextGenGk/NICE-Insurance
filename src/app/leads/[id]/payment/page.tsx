import { notFound } from "next/navigation";
import type { Payment } from "@prisma/client";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { INSURERS, ProductType } from "@/lib/insurers";
import { PaymentPanel } from "./PaymentPanel";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { quotations: { where: { selected: true } }, payments: true },
  });
  const selected = lead?.quotations[0];
  if (!lead || !selected || !lead.productType) notFound();

  const alreadyPaid = lead.payments.some((p: Payment) => p.status === "PAID");
  const ref = INSURERS[lead.productType as ProductType].find((i) => i.code === selected.insurerCode);

  return (
    <Shell stage="payment">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        Premium payment
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">
        Razorpay checkout — runs in test mode until live keys are added.
      </p>
      <PaymentPanel
        leadId={id}
        insurer={selected.insurerName}
        plan={selected.planName}
        premium={selected.premiumPerYear}
        alreadyPaid={alreadyPaid}
        insurerRef={ref}
        color={ref?.color ?? "#0F2A2E"}
      />
    </Shell>
  );
}
