import { Button, Form } from "react-bootstrap";
import { url, patientFormat } from "../../Patients";
import { useState } from "react";

export function SignUp() {
  const [patient, setPatient] = useState(patientFormat);

  function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh

    fetch(url, {
      method: "POST",
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
    alert("Patient Created as:" + JSON.stringify(patient, null, 4));
    setPatient(patientFormat);
  }
  return (
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
        <Form.Control type="date" onChange={(e) => {}} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save Changes
      </Button>
    </Form>
  );
}
