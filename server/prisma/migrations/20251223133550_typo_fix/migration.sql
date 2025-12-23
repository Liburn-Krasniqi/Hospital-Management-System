/*
  Warnings:

  - You are about to drop the column `appointmentDateappointmentStartTime` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentStartTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "appointmentDateappointmentStartTime",
ADD COLUMN     "appointmentStartTime" TIMESTAMP(3) NOT NULL;
