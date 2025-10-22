import { useState, useEffect } from "react";
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
  const [page, setPage] = useState(0);
  const take = 5;

  function previousPage() {
    setSkip(take * (page - 1));
    setPage(page - 1);
  }

  function nextPage() {
    setSkip(take * (page + 1));
    setPage(page + 1);
  }

  useEffect(() => {
    fetch(`${url}${take || 0}-${skip || 0}`)
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      });
  }, [skip]);

  console.log(patients);

  if (isLoading === true) {
    console.log("Loading");
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
                    <button type="button" className="btn btn-warning">
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={previousPage}>previous page</button>
        <button onClick={nextPage}>next page</button>
      </div>
    );
  }
}
