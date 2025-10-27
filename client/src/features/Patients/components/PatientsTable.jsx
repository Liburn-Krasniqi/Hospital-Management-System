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
// 1. Remove the form from the tables implementation. (Create seperate component)
// 2. Improve style. (Pagiation centering and styling, loading spinny, etc)
// 3. Derive customTable and customForm from these implementations afterwards. (Might have to do this much later on)

import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

import { patientFormat, url } from "./Patients";
import classes from "./PatientsTable.module.css";
import { PatientForm } from "./PatientsForm";

export function PatientsTable() {
  const [patients, setPatients] = useState([]); // for reading the data and displaying it on the table
  const [isLoading, setLoading] = useState(true); // for simple aesthetics and indicating that the data is being loaded

  // for pagination
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setPage] = useState(0);
  const take = 5;

  const [isEdit, setEdit] = useState(false);
  const [patient, setPatient] = useState(patientFormat);

  function jumpToPage(page) {
    setSkip(take * page);
    setPage(page);
  }

  function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh

    fetch(`${url}id/${patient.id}`, {
      method: "PUT",
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
    setPatient(patientFormat);
  }

  function handleEdit(patient) {
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
    setEdit(true);
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
  }, [skip, isEdit]);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 0; i < pages; i++) {
    pageNumbers.push(i);
  }

  if (isLoading === true) {
    return (
      <div className="d-flex justify-content-center">
        <div
          className="spinner-border text-info my-5 "
          style={{ width: "10rem", height: "10rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="table-responsive-lg">
        <PatientForm
          isEdit={isEdit}
          setEdit={setEdit}
          patient={patient}
          setPatient={setPatient}
          handleSubmit={handleSubmit}
        ></PatientForm>
        <table className="table table-striped table-hover my-5">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Address</th>
              <th scope="col">dateOfBirth</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {patients.map((patient) => {
              return (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.address}</td>
                  <td>{String(patient.dateOfBirth).slice(0, 10)}</td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic mixed styles example"
                    >
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => {
                          handleEdit(patient);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(patient.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-center mt-5">
          <ul className="list-group list-group-horizontal">
            <button onClick={() => jumpToPage(currentPage - 1)} className="">
              <ArrowBigLeft></ArrowBigLeft>
            </button>
            {pageNumbers.map((number) => {
              return (
                <li
                  className={`list-group-item ${classes.pagination_li} ${
                    number === currentPage ? classes.curr : ""
                  }`}
                  key={number}
                  id={number}
                  onClick={() => jumpToPage(number)}
                >
                  {number + 1}
                </li>
              );
            })}
            <button onClick={() => jumpToPage(currentPage + 1)} className="">
              <ArrowBigRight></ArrowBigRight>
            </button>
          </ul>
        </div>
      </div>
    );
  }
}
