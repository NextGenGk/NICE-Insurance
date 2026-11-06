import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, include: { profile: true } });
  if (!lead || !lead.productType) notFound();

  return (
    <Shell stage="profile">
      <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
        Customer profile
      </h1>
      <p className="text-[#3F5D63] text-sm mb-6">These details shape the quotation.</p>
      <ProfileForm leadId={lead.id} productType={lead.productType} existing={lead.profile} />
    </Shell>
  );
}
