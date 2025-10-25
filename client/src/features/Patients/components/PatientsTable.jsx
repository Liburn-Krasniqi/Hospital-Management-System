import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

import classes from "./PatientsTable.module.css";

const url = "http://localhost:8000/api/patients/"; // probably have this imported later on

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

export function PatientsTable() {
  const [patients, setPatients] = useState([]); // for reading the data and displaying it on the table
  const [isLoading, setLoading] = useState(true); // for simple aesthetics and indicating that the data is being loaded

  // for pagination
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setPage] = useState(0);
  const take = 5;

  // for editing patients
  const patientFormat = {
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: null,
    password: "",
  };
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

  function handleEdit(id) {
    fetch(`${url}id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPatient({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          dateOfBirth: data.dateOfBirth,
          password: data.password,
        });
        setEdit(true);
      });
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
        setPatients(data[0]); // Since this returns an array of [patients, patientsCount]
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
    return <div>This is loading...</div>;
  } else {
    return (
      <div className="table-responsive-lg">
        <>
          <Modal
            show={isEdit}
            onHide={() => {
              setEdit(false);
              setPatient(patientFormat);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{`Edit Patient: ${patient.name}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First and Last Name"
                    defaultValue={patient.name}
                    onChange={(e) => {
                      setPatient({ ...patient, name: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    defaultValue={patient.email}
                    onChange={(e) => {
                      setPatient({ ...patient, email: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone Nr"
                    defaultValue={patient.phone}
                    onChange={(e) => {
                      setPatient({ ...patient, name: e.target.phone });
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    defaultValue={patient.address}
                    onChange={(e) => {
                      setPatient({ ...patient, name: e.target.address });
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBD">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={String(
                      patient.dateOfBirth ?? "2001-09-11"
                    ).slice(0, 10)}
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  onHide={() => {
                    setEdit(false);
                    setPatient(patientFormat);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => setEdit(false)}
                >
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>

        <table className="table table-striped table-hover">
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
                        onClick={() => handleEdit(patient.id)}
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

        <ul className="list-group list-group-horizontal">
          <button onClick={() => jumpToPage(currentPage - 1)}>previous</button>
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
          <button onClick={() => jumpToPage(currentPage + 1)}>next</button>
        </ul>
      </div>
    );
  }
}
