import { Button, Modal, Form } from "react-bootstrap";
import { patientFormat } from "./Patients";

export function PatientForm({
  isEdit,
  setEdit,
  patient,
  setPatient,
  handleSubmit,
}) {
  // Curly braces is for destructuring the prop, so instead of props.isEdit we just write isEdit
  return (
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
                defaultValue={String(patient.dateOfBirth ?? "2001-09-11").slice(
                  0,
                  10
                )}
              />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={() => {
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
  );
}
