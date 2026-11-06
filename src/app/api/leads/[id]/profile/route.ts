import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data = {
    age: body.age,
    gender: body.gender,
    city: body.city,
    sumAssured: body.sumAssured,
    familySize: body.familySize ?? 1,
    preExisting: !!body.preExisting,
    preExistingDetails: body.preExistingDetails ?? null,
    policyType: body.policyType ?? null,
    existingPolicy: !!body.existingPolicy,
    roomRentPreference: body.roomRentPreference ?? null,
    vehicleAgeYrs: body.vehicleAgeYrs ?? null,
    vehicleRegistration: body.vehicleRegistration ?? null,
    vehicleMake: body.vehicleMake ?? null,
    vehicleModel: body.vehicleModel ?? null,
    idv: body.idv ?? null,
    previousInsurer: body.previousInsurer ?? null,
    ncbPercent: body.ncbPercent ?? null,
    propertyType: body.propertyType ?? null,
    propertyAddress: body.propertyAddress ?? null,
    businessType: body.businessType ?? null,
    travelDestination: body.travelDestination ?? null,
    travelDays: body.travelDays ?? null,
    travellers: body.travellers ?? null,
  };

  const profile = await prisma.customerProfile.upsert({
    where: { leadId: id },
    update: data,
    create: { leadId: id, ...data },
  });

  return NextResponse.json(profile);
}
