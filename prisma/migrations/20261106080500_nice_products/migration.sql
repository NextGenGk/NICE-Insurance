-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('TRUCK', 'CAR', 'BIKE', 'HEALTH', 'HOME', 'OFFICE', 'SHOP', 'TRAVEL');
ALTER TABLE "Lead" ALTER COLUMN "productType" TYPE "ProductType_new" USING ("productType"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- AlterTable
ALTER TABLE "CustomerProfile" DROP COLUMN "annualIncome",
DROP COLUMN "existingCover",
DROP COLUMN "nomineeName",
DROP COLUMN "nomineeRelation",
DROP COLUMN "occupation",
DROP COLUMN "smoker",
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "propertyAddress" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "travelDays" INTEGER,
ADD COLUMN     "travelDestination" TEXT,
ADD COLUMN     "travellers" INTEGER DEFAULT 1;
