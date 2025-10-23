import { useState, useEffect } from "react";
import classes from "./PatientsTable.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
const url = "http://localhost:8000/api/patients/";

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
  const [patients, setPatients] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [isEdit, setEdit] = useState(false);
  const take = 5;

  function jumpToPage(page) {
    setSkip(take * page);
    setPage(page);
  }

  function handleEdit(id) {
    fetch(`${url}id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const patientToEdit = data;
        setEdit(patientToEdit);
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
        setPages(Math.floor(data[1] / take) + 1); // Set the number of pages based on the number of patients and how many we display per page //Reconsider using roof instead of floor
        setLoading(false);
      });
  }, [skip]);

  console.log(patients);

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
          <Modal show={isEdit} onHide={() => setEdit(false)}>
            <Modal.Title>{`Edit Patient: ${isEdit.name}`}</Modal.Title>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First and Last Name"
                    defaultValue={isEdit.name}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    defaultValue={isEdit.email}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone Nr"
                    defaultValue={isEdit.phone}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    defaultValue={isEdit.address}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBD">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={
                      String(isEdit.dateOfBirth).slice(0, 10) || "2001-09-11"
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setEdit(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => setEdit(false)}>
                Save Changes
              </Button>
            </Modal.Footer>
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
