import { Link } from "react-router-dom";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { Card } from "../../../components/UI";
import { patientFormat } from "../../Patients";
import { useAuth } from "../../../providers";

export function SignUp() {
  const [patient, setPatient] = useState(patientFormat);
  const auth = useAuth();

  async function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh

    const response = await fetch("http://localhost:8000/api/patients/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth,
        password: patient.password,
      }),
    });

    if (response.ok) {
      alert("Patient Created as:" + JSON.stringify(patient, null, 4));
      setPatient(patientFormat);
      const user = { email: patient.email, password: patient.password };
      auth.loginAction(user, "http://localhost:8000/api/patients/"); // url should also be diff for patients or for doctors etc
    }
  }
  return (
    <div className="d-flex justify-content-center">
      <Card className={"w-50"}>
        <h1 className="color-1">Sign Up</h1>
        <br />
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
              onChange={(e) =>
                setPatient({ ...patient, dateOfBirth: e.target.value })
              }
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <p>
              Already have an account?
              <Link
                style={{ textDecoration: "none" }}
                className="color-2"
                to="/login"
              >
                {" "}
                <strong>Log In</strong>
              </Link>
            </p>
            <Button className="background-2" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
