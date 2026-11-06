import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.phone) {
    return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
  }

  const advisor = await prisma.advisor.findUnique({ where: { clerkUserId: userId } });

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email || null,
      city: body.city || null,
      source: body.source || "Manual entry",
      advisorId: advisor?.id ?? null,
    },
  });

  return NextResponse.json(lead);
}
