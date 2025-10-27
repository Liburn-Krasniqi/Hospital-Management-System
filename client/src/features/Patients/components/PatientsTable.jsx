import { CirclePlus } from "lucide-react";

export function PatientsTable({
  isLoading,
  patients,
  handleEdit,
  handleDelete,
  handleCreate,
}) {
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
      <div className="table-responsive-lg my-3">
        <div className="d-flex align-items-center">
          <h1>Patients</h1>
          <button
            type="button"
            className="btn btn-primary ms-auto disabled" //later on for custom table make this dynamic and controlled via arguments
            onClick={handleCreate} // define handle create
          >
            <CirclePlus></CirclePlus> Add Patient
          </button>
        </div>
        <table className="table table-striped table-hover my-3">
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
      </div>
    );
  }
}
