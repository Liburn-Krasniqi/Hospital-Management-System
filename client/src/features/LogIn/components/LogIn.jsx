import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";

import { url } from "../../Patients";
import { Card } from "../../../components/UI";

export const patientFormat = {
  email: "",
  password: "",
};
//coment
export function LogIn() {
  const [patient, setPatient] = useState(patientFormat);
  const [created, setCreated] = useState(false);
  function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh

    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: patient.email,
        password: patient.password,
      }),
    }).then((response) => {
      response.json();
      console.log(response);
    });
    alert("Patient Created as:" + JSON.stringify(patient, null, 4));
    setPatient(patientFormat);
    setCreated(true);
  }
  if (created) {
    return <Navigate to="/" />;
  } else {
    return (
      <div className="d-flex justify-content-center my-5">
        <Card className={"w-50"}>
          <h1 className="color-1">Log In</h1>
          <br />
          <Form onSubmit={handleSubmit}>
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
            <Form.Group className="mb-3" controlId="formPW">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPatient({ ...patient, password: e.target.value });
                }}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <p>
                Don't have an account?
                <Link
                  style={{ textDecoration: "none" }}
                  to="/signup"
                  className="color-2"
                >
                  {" "}
                  <strong>Register</strong>
                </Link>
              </p>
              <Button className="background-2" type="submit">
                Log In
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    );
  }
}
