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

// model Doctor{
//   id String @id @default(uuid())
//   name String
//   email String @unique
//   password String
//   phone String
//   specialty String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   appointments Appointment[]
// }

// import { doctorFormat } from "../../Doctors/components/Doctors";
import { DoctorCard } from "./DoctorCard";
import { useState, useEffect } from "react";

const API = "http://localhost:8000/api";

// Display Doctors Profiles, allow to filter on speciality and availiability etc.
export function Appointments() {
  const [doctors, setDoctors] = useState([]); // for reading the data and displaying it on the table
  const take = 5;
  const [pages, setPages] = useState(0);

  const [skip, setSkip] = useState(0);
  const [isShow, setShow] = useState(false);
  const [appointmentsByDoctor, setAppointmentsByDoctor] = useState({});
  const [isLoading, setLoading] = useState(true); // for simple aesthetics and indicating that the data is being loaded

  useEffect(() => {
    fetch(`${API}/doctors/${take || 0}-${skip || 0}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data[0]); // Since backend returns an array of [[doctors] (objects), doctorsCount (number)]
        setPages(Math.ceil(data[1] / take)); // Set the number of pages based on the number of doctors and how many we display per page
        setLoading(false);
      });
  }, [skip, isShow]);

  useEffect(() => {
    if (doctors.length === 0) return;
    Promise.all(
      doctors.map((d) =>
        fetch(`${API}/appointments/id/${d.id}`).then((r) => r.json())
      )
    ).then((results) => {
      const byDoctor = {};
      doctors.forEach((d, i) => {
        byDoctor[d.id] = Array.isArray(results[i]) ? results[i] : [];
      });
      setAppointmentsByDoctor(byDoctor);
    });
  }, [doctors]);

  return (
    <div>
      <div className="text-center mb-4">
        <h1
          className="color-2 fw-bold fs-1"
          style={{ "text-shadow": "1px 1px 2px #67C090" }}
        >
          Doctors
        </h1>
      </div>
      <div className="d-inline-flex p-2 gap-3 flex-wrap">
        {doctors.map((doctor) => {
          return (
            <DoctorCard
              doctorId={doctor.id}
              name={doctor.name}
              speciality={doctor.specialty}
              appointments={appointmentsByDoctor[doctor.id] || []}
              key={doctor.id}
            />
          );
        })}
      </div>
    </div>
  );
}
