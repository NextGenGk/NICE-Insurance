import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { profile: true, quotations: true, kycDocuments: true, payments: true, policy: true },
  });
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(body.productType ? { productType: body.productType } : {}),
      ...(body.status ? { status: body.status } : {}),
    },
  });
  return NextResponse.json(lead);
}
