import { CirclePlus } from "lucide-react";

/*

const [isLoading, setLoading] = useState(true); (setup in parent)
const [patients, setPatients] = useState([]); (setup in parent)



*/

export function CustomTable({
  isLoading, // for simple aesthetics and indicating that the data is being loaded
  entities, // (rows) array for reading the data and displaying it on the table
  entityName, // name of the type of entity that will be displayed on the table (e.g., Patient)
  fields, // array for defining table structure
  fieldDisplayName,
  // callbacks
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
          <h1>{entityName}s</h1>
          <button
            type="button"
            className="btn btn-primary ms-auto disabled" //later on for custom table make this dynamic and controlled via arguments
            onClick={handleCreate} // define handle create
          >
            <CirclePlus></CirclePlus> Add {entityName}
          </button>
        </div>
        <table className="table table-striped table-hover my-3">
          <thead>
            <tr>
              {fieldDisplayName.map((field) => {
                return <th scope="col">{field}</th>;
              })}
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {entities.map((entity) => {
              return (
                <tr key={entity.id}>
                  {fields.map((field) => {
                    return (
                      <td>
                        {field.includes("date")
                          ? String(entity[field]).slice(0, 10)
                          : entity[field]}
                      </td>
                    );
                  })}
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
                          handleEdit(entity);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(entity.id)}
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
