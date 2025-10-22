import { useState, useEffect } from "react";
import classes from "./PatientsTable.module.css";
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

// Display the number of pages possible

export function PatientsTable() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setPage] = useState(0);
  const take = 5;

  function jumpToPage(page) {
    setSkip(take * page);
    setPage(page);
    console.log("Fire: " + page);
  }

  useEffect(() => {
    fetch(`${url}${take || 0}-${skip || 0}`)
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
                      <button type="button" className="btn btn-warning">
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger">
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
          <button onClick={() => jumpToPage(currentPage - 1)}>
            previous page
          </button>
          {pageNumbers.map((number) => {
            return (
              <li
                className={`list-group-item ${classes.pagination_li}`}
                key={number}
                id={number}
                onClick={() => jumpToPage(number)}
              >
                {number + 1}
              </li>
            );
          })}
          <button onClick={() => jumpToPage(currentPage + 1)}>next page</button>
        </ul>
      </div>
    );
  }
}
