// model Patient{
//   id  String @id @default(uuid())
//   name String
//   email String @unique
//   password String
//   phone String
//   address String
//   dateOfBirth DateTime
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   appointments Appointment[]
//   }

// TODO:
// 1. Remove the form from the tables implementation. (Create seperate component) DONE.
// 2. Create a create operation. DONEish.
// 3. Improve style. (Pagiation centering and styling, loading spinny, etc)
// 4. Derive customTable and customForm from these implementations afterwards. (Might have to do this much later on)

import { useState, useEffect } from "react";
import { PatientsTable } from "./PatientsTable";
import { PatientForm } from "./PatientsForm";
import { Pagination } from "./Pagination";

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

export const url = "http://localhost:8000/api/patients/"; // probably have this imported later on from an API module or something

export function Patients() {
  const [patients, setPatients] = useState([]); // for reading the data and displaying it on the table
  const [isLoading, setLoading] = useState(true); // for simple aesthetics and indicating that the data is being loaded

  // for pagination
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setPage] = useState(0);
  const take = 5;

  const [isCreate, setCreate] = useState(false);
  const [isShow, setShow] = useState(false);
  const [patient, setPatient] = useState(patientFormat);

  function jumpToPage(page) {
    setSkip(take * page);
    setPage(page);
  }

  function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh
    var fetchurl = url;
    var method = "POST";

    if (!isCreate) {
      method = "PUT";
      fetchurl = `${url}id/${patient.id}`;
    }
    fetch(fetchurl, {
      method: method,
      body: JSON.stringify({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth,
        password: patient.password, // get rid of this later
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json();
      console.log(response);
    });
    alert("Patient edited as:" + JSON.stringify(patient, null, 4));
    setCreate(false);
    setPatient(patientFormat);
  }

  function handleCreate() {
    // TODO
    setCreate(true);
    setShow(true);
  }

  function handleEdit(patient) {
    setCreate(false);
    // dont take in id but take in the patient then theres no need to contact backend at all ??
    setPatient({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      dateOfBirth: patient.dateOfBirth,
      password: patient.password,
    });
    setShow(true);
  }

  function handleDelete(id) {
    console.log(`${url}${id}`);
    fetch(`${url}id/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("deleted patient: " + data);
      });
  }

  useEffect(() => {
    fetch(`${url}${take || 0}-${skip || 0}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients(data[0]); // Since backend returns an array of [[patients] (objects), patientsCount (number)]
        setPages(Math.ceil(data[1] / take)); // Set the number of pages based on the number of patients and how many we display per page
        setLoading(false);
      });
  }, [skip, isShow]);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 0; i < pages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <PatientForm
        isCreate={isCreate}
        setCreate={setCreate}
        isShow={isShow}
        setShow={setShow}
        patient={patient}
        setPatient={setPatient}
        handleSubmit={handleSubmit}
      ></PatientForm>
      <PatientsTable
        isLoading={isLoading}
        patients={patients}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleCreate={handleCreate}
      ></PatientsTable>
      {/* Pagination, is probably considered custom */}
      <Pagination
        currentPage={currentPage}
        jumpToPage={jumpToPage}
        pageNumbers={pageNumbers}
      ></Pagination>
    </div>
  );
}
