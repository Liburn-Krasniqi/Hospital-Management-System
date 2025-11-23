import { Button, Modal, Form } from "react-bootstrap";
import { patientFormat } from "../../../features/Patients/components/Patients"; // make this a passable arg

/*

const [isCreate, setCreate] = useState(false);


*/

export function CustomForm({
  isCreate,
  isShow,
  setShow,
  entity,
  entityName, // name of the type of entity that will be displayed on the table (e.g., Patient)
  setEntity,
  entityFormat,
  fields, // array to access each entities attributes
  fieldType, // array of input types
  fieldDisplayName, // array for display names
  placeholders,
  handleSubmit,
}) {
  if (isCreate) {
    return (
      <>
        <Modal
          show={isShow}
          onHide={() => {
            setShow(false);
            setEntity(entityFormat);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{`Create ${entityName}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {fields.map((field, index) => {
                return (
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>{fieldDisplayName[index]}</Form.Label>
                    <Form.Control
                      type={fieldType[index]}
                      placeholder={placeholders[index]}
                      onChange={(e) => {
                        setEntity({ ...entity, [field]: e.target.value });
                      }}
                    />
                  </Form.Group>
                );
              })}

              <Button
                variant="secondary"
                onClick={() => {
                  setShow(false);
                  setEntity(entityFormat);
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => setShow(false)}
              >
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  } else {
    return (
      <>
        <Modal
          show={isShow}
          onHide={() => {
            setShow(false);
            setEntity(entityFormat);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{`Edit ${entityName}: ${entity.name}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {fields.map((field, index) => {
                return (
                  <Form.Group className="mb-3" controlId="formName" key={field}>
                    <Form.Label>{fieldDisplayName[index]}</Form.Label>
                    <Form.Control
                      type={fieldType[index]}
                      defaultValue={
                        field.includes("date")
                          ? String(entity[field]).slice(0, 10)
                          : entity[field]
                      }
                      onChange={(e) => {
                        setEntity({ ...entity, [field]: e.target.value });
                      }}
                    />
                  </Form.Group>
                );
              })}

              <div className="d-flex justify-content-between">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShow(false);
                    setEntity(entityFormat);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => setShow(false)}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
