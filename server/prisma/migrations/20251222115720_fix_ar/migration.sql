-- AddForeignKey
ALTER TABLE "public"."AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppointmentRequest" ADD CONSTRAINT "AppointmentRequest_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
