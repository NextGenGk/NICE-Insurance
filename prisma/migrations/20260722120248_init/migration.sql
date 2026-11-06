-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('LIFE', 'HEALTH', 'GENERAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'ADVISED', 'KYC_PENDING', 'PAYMENT_PENDING', 'SUBMITTED', 'UNDERWRITING', 'ISSUED', 'REJECTED', 'LOST');

-- CreateEnum
CREATE TYPE "KycDocType" AS ENUM ('PAN', 'AADHAAR');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'ISSUED', 'REJECTED');

-- CreateTable
CREATE TABLE "Advisor" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "irdaiLicense" TEXT,
    "commissionPct" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Advisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "source" TEXT NOT NULL DEFAULT 'Website',
    "productType" "ProductType",
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "advisorNote" TEXT,
    "advisorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sumAssured" INTEGER NOT NULL,
    "smoker" BOOLEAN NOT NULL DEFAULT false,
    "occupation" TEXT,
    "annualIncome" INTEGER,
    "existingCover" INTEGER,
    "nomineeName" TEXT,
    "nomineeRelation" TEXT,
    "familySize" INTEGER NOT NULL DEFAULT 1,
    "preExisting" BOOLEAN NOT NULL DEFAULT false,
    "preExistingDetails" TEXT,
    "policyType" TEXT,
    "existingPolicy" BOOLEAN NOT NULL DEFAULT false,
    "roomRentPreference" TEXT,
    "vehicleAgeYrs" INTEGER,
    "vehicleRegistration" TEXT,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "idv" INTEGER,
    "previousInsurer" TEXT,
    "ncbPercent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "dob" TIMESTAMP(3),

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "insurerCode" TEXT NOT NULL,
    "insurerName" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "premiumPerYear" INTEGER NOT NULL,
    "coverAmount" INTEGER NOT NULL,
    "policyTermYears" INTEGER NOT NULL,
    "claimSettlementRatio" TEXT,
    "highlight" TEXT,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'ai_estimate',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycDocument" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "KycDocType" NOT NULL,
    "valueMasked" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "insurerCode" TEXT NOT NULL,
    "insurerName" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "coverAmount" INTEGER NOT NULL,
    "premium" INTEGER NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'SUBMITTED',
    "documentUrl" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_clerkUserId_key" ON "Advisor"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Advisor_email_key" ON "Advisor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_leadId_key" ON "CustomerProfile"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_leadId_key" ON "Policy"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyNumber_key" ON "Policy"("policyNumber");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycDocument" ADD CONSTRAINT "KycDocument_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
