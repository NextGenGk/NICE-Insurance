import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const { note } = await req.json();

  const lead = await prisma.lead.update({
    where: { id },
    data: { advisorNote: note, status: "ADVISED" },
  });

  // In the full build: send `note` + the quote comparison link to the
  // customer via WhatsApp Business API and/or Resend email here.

  return NextResponse.json(lead);
}
