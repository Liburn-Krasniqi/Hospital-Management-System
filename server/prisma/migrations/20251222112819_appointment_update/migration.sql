/*
  Warnings:

  - You are about to drop the column `appointmentDate` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentEndTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentStartTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "appointmentDate",
ADD COLUMN     "appointmentEndTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointmentStartTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;
