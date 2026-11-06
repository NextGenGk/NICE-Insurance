import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateQuotes } from "@/lib/quotes";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { leadId } = await req.json();

  try {
    const quotes = await getOrCreateQuotes(leadId);
    return NextResponse.json({ quotes });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
