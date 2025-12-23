/*
  Warnings:

  - You are about to drop the column `appointmentDate` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentDateappointmentStartTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentEndTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "appointmentDate",
ADD COLUMN     "appointmentDateappointmentStartTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointmentEndTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "reason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."AppointmentRequest" ALTER COLUMN "reason" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
