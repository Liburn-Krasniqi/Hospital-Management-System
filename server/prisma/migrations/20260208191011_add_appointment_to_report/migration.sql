-- CreateEnum
CREATE TYPE "public"."TypeOfVisit" AS ENUM ('CONSULTATION', 'SURGERY', 'TEST', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "typeOfVisit" "public"."TypeOfVisit" NOT NULL DEFAULT 'CONSULTATION';
