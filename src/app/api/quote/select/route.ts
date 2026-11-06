import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { leadId, quotationId } = await req.json();

  await prisma.$transaction([
    prisma.quotation.updateMany({ where: { leadId }, data: { selected: false } }),
    prisma.quotation.update({ where: { id: quotationId }, data: { selected: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
