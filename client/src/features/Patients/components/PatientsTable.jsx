import { useState, useEffect } from "react";
import classes from "./PatientsTable.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
    console.log("Fire: " + page);
  }

  function handleEdit(id) {
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
        setPatients(data[0]); // Since this returns an array of [patients, patientsCount]
        setPages(Math.floor(data[1] / take) + 1); // Set the number of pages based on the number of patients and how many we display per page
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
        {isEdit ? (
          <>
            text
            <Modal>TEXTTTT</Modal>
          </>
        ) : null}
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
