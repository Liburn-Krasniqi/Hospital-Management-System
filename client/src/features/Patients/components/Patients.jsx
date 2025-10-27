import { PatientsTable } from "./PatientsTable";

// for editing patients
export const patientFormat = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: null,
  password: "",
};

export const url = "http://localhost:8000/api/patients/"; // probably have this imported later on

export function Patients() {
  return (
    <div>
      <PatientsTable></PatientsTable>
    </div>
  );
}
