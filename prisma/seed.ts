import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // NOTE: replace clerkUserId with your real Clerk user id after first
  // sign-in (visible in the Clerk dashboard, or console.log(userId) in
  // any server component) so leads show up as "yours" in the dashboard.
  const advisor = await prisma.advisor.upsert({
    where: { email: "rajeev@niceinsurance.co.in" },
    update: {},
    create: {
      clerkUserId: process.env.SEED_CLERK_USER_ID ?? "demo-advisor",
      name: "NICE Advisor (Demo)",
      email: "rajeev@niceinsurance.co.in",
      commissionPct: 12,
    },
  });

  const leads = [
    {
      name: "Ramesh Sahu",
      phone: "+91 98261 00000",
      city: "Raipur",
      source: "Website enquiry",
      productType: "TRUCK" as const,
    },
    {
      name: "Priya Verma",
      phone: "+91 94255 00000",
      city: "Bhilai",
      source: "WhatsApp",
      productType: "HEALTH" as const,
    },
    {
      name: "Ashok Deshmukh",
      phone: "+91 93007 00000",
      city: "Raipur",
      source: "Referral",
      productType: "CAR" as const,
    },
    {
      name: "Sunita Agarwal",
      phone: "+91 99931 00000",
      city: "Durg",
      source: "Walk-in",
      productType: "HOME" as const,
    },
  ];

  for (const lead of leads) {
    const existing = await prisma.lead.findFirst({ where: { phone: lead.phone } });
    if (!existing) {
      await prisma.lead.create({
        data: { ...lead, advisorId: advisor.id },
      });
    }
  }

  console.log("Seeded NICE advisor + sample leads.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
