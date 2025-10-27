import { Button, Modal, Form } from "react-bootstrap";
import { patientFormat } from "./Patients";

export function PatientForm({
  isCreate,
  setCreate,
  isShow,
  setShow,
  patient,
  setPatient,
  handleSubmit,
}) {
  if (isCreate) {
    return (
      <>
        <Modal
          show={isShow}
          onHide={() => {
            setShow(false);
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
                  onChange={(e) => {
                    setPatient({ ...patient, phone: e.target.value });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  onChange={(e) => {
                    setPatient({ ...patient, address: e.target.value });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPW">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Password"
                  onChange={(e) => {
                    setPatient({ ...patient, password: e.target.value });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBD">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={String(new Date().toISOString()).slice(0, 10)}
                  onChange={(e) => {
                    setPatient({ ...patient, dateOfBirth: e.target.value });
                  }}
                />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => {
                  setShow(false);
                  setPatient(patientFormat);
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
    // Curly braces is for destructuring the prop, so instead of (props.isShow) we just write isShow
    return (
      <>
        <Modal
          show={isShow}
          onHide={() => {
            setShow(false);
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
                    setPatient({ ...patient, phone: e.target.value });
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
                    setPatient({ ...patient, address: e.target.value });
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBD">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={String(
                    patient.dateOfBirth ?? new Date().toISOString()
                  ).slice(0, 10)}
                  onChange={(e) => {
                    setPatient({ ...patient, dateOfBirth: e.target.value });
                  }}
                />
              </Form.Group>
              <Button
                variant="secondary"
                onClick={() => {
                  setShow(false);
                  setPatient(patientFormat);
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
  }
}
