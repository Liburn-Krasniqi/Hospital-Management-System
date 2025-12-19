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

import { useState, useEffect } from "react";
import {
  Pagination,
  CustomTable,
  CustomForm,
} from "../../../components/Custom";

// for editing doctors
const doctorFormat = {
  id: "",
  name: "",
  email: "",
  phone: "",
  specialty: "",
  password: "",
};

// attributes to be displayed on the table and form
const fields = ["name", "email", "phone", "specialty", "password"];
const fieldDisplayName = ["Name", "Email", "Phone", "Specialty", "Password"];

const fieldsTable = ["name", "email", "phone", "specialty"];
const fieldDisplayNameTable = ["Name", "Email", "Phone", "Specialty"];

const placeholders = [
  "Enter First and Last Name",
  "Enter email",
  "Phone Nr",
  "Specialty",
  "Password",
];

// backend url
const url = "http://localhost:8000/api/doctors";

export function Doctors() {
  const [doctors, setDoctors] = useState([]); // for reading the data and displaying it on the table
  const [isLoading, setLoading] = useState(true); // for simple aesthetics and indicating that the data is being loaded

  // for pagination
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setPage] = useState(0);
  const take = 5;

  const [isCreate, setCreate] = useState(false);
  const [isShow, setShow] = useState(false);
  const [doctor, setDoctor] = useState(doctorFormat);

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
      fetchurl = `${url}id/${doctor.id}`;
    }
    fetch(fetchurl, {
      method: method,
      body: JSON.stringify({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialty: doctor.specialty,
        password: doctor.password, // get rid of this later
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json();
      console.log(response);
    });
    alert("Doctor edited as:" + JSON.stringify(doctor, null, 4));
    setCreate(false);
    setDoctor(doctorFormat);
  }

  function handleCreate() {
    // TODO
    setCreate(true);
    setShow(true);
  }

  function handleEdit(doctor) {
    setCreate(false);
    // dont take in id but take in the patient then theres no need to contact backend at all ??
    setDoctor({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialty: doctor.specialty,
      dateOfBirth: doctor.dateOfBirth,
      password: doctor.password,
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
        console.log("deleted doctor: " + data);
      });
  }

  useEffect(() => {
    fetch(`${url}/${take || 0}-${skip || 0}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data[0]); // Since backend returns an array of [[doctors] (objects), doctorsCount (number)]
        setPages(Math.ceil(data[1] / take)); // Set the number of pages based on the number of doctors and how many we display per page
        setLoading(false);
      });
  }, [skip, isShow]);

  const pageNumbers = [];
  for (let i = 0; i < pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <CustomForm
        isCreate={isCreate}
        setCreate={setCreate}
        isShow={isShow}
        setShow={setShow}
        entity={doctor}
        entityName={"Doctor"}
        setEntity={setDoctor}
        entityFormat={doctorFormat}
        fields={fields}
        fieldType={["text", "email", "text", "text", "text"]}
        //          ["Name", "Email", "Phone", "Specialty", "Password"];
        fieldDisplayName={fieldDisplayName}
        placeholders={placeholders}
        handleSubmit={handleSubmit}
      ></CustomForm>

      <CustomTable
        isLoading={isLoading}
        entities={doctors}
        entityName={"Doctor"}
        fields={fieldsTable}
        fieldDisplayName={fieldDisplayNameTable}
        allowCreate={true}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleCreate={handleCreate}
      ></CustomTable>

      <Pagination
        currentPage={currentPage}
        jumpToPage={jumpToPage}
        pageNumbers={pageNumbers}
      ></Pagination>
    </div>
  );
}
