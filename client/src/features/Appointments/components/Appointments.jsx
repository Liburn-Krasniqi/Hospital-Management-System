// model Appointment {
//   id                   String   @id @default(uuid())
//   patientId            String
//   doctorId             String
//   appointmentStartTime DateTime
//   appointmentEndTime   DateTime
//   reason               String?
//   status               String   @default("scheduled") // e.g., scheduled, completed, canceled
//   createdAt            DateTime @default(now())
//   updatedAt            DateTime @updatedAt

//   patient Patient @relation(fields: [patientId], references: [id])
//   doctor  Doctor  @relation(fields: [doctorId], references: [id])
// }

// model AppointmentRequest {
//   id            String   @id @default(uuid())
//   patientId     String
//   doctorId      String
//   requestedDate DateTime
//   reason        String?
//   status        String   @default("pending") // e.g., pending, approved, rejected
//   createdAt     DateTime @default(now())
//   updatedAt     DateTime @updatedAt

//   // Uncomment the following lines if you want to establish relations
//   patient Patient @relation(fields: [patientId], references: [id])
//   doctor  Doctor  @relation(fields: [doctorId], references: [id])
// }

export function Appointments() {
  return <h1>Appointments page</h1>;
}
