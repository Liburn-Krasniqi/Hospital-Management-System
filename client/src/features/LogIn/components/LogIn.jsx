import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";

import { Card } from "../../../components/UI";
import { useAuth } from "../../../providers";

const userFormat = {
  email: "",
  password: "",
};

export function LogIn() {
  const [user, setUser] = useState(userFormat); // not just patients but users in general
  const [role, setRole] = useState(false);
  const auth = useAuth();
  function handleSubmit(e) {
    e.preventDefault(); // Mandatory to avoid default refresh
    if (user.email !== "" && user.password !== "") {
      let end = "patients";
      if (role) {
        end = "doctors";
      }
      auth.loginAction(user, `http://localhost:8000/api/${end}/`); // url should also be diff for patients or for doctors etc
      return;
    }
    alert("please provide a valid input");
  }

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
                setUser({ ...user, email: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPW">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Staff Account (Yes/No)</Form.Label>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              onChange={(e) => {
                setRole(!role);
                console.log(role);
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
