import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";

// import { url } from "../../Patients";
import { Card } from "../../../components/UI";
import { useAuth } from "../../../providers";

const patientFormat = {
  email: "",
  password: "",
};

export function LogIn() {
  const [patient, setPatient] = useState(patientFormat);
  const [created, setCreated] = useState(false);
  const auth = useAuth();

  function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh
    if (patient.email !== "" && patient.password !== "") {
      auth.loginAction(patient);
      return;
    }
    alert("pleae provide a valid input");
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
