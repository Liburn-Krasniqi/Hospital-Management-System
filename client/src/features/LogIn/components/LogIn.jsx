import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Card } from "../../../components/UI";
import { useAuth } from "../../../providers";

const userFormat = {
  email: "",
  password: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  return "";
}

export function LogIn() {
  const [user, setUser] = useState(userFormat);
  const [role, setRole] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const auth = useAuth();

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = user[field];
    const error =
      field === "email"
        ? validateEmail(value)
        : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const emailError = validateEmail(user.email);
    const passwordError = validatePassword(user.password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) return;

    const end = role ? "doctors" : "patients";
    auth.loginAction(user, `http://localhost:8000/api/${end}/`);
  }

  const emailError = touched.email && errors.email;
  const passwordError = touched.password && errors.password;

  return (
    <div className="d-flex justify-content-center my-5">
      <Card className={"w-50"}>
        <h1 className="color-1">Log In</h1>
        <br />
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
                if (touched.email)
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(e.target.value),
                  }));
              }}
              onBlur={() => handleBlur("email")}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPW">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
                if (touched.password)
                  setErrors((prev) => ({
                    ...prev,
                    password: validatePassword(e.target.value),
                  }));
              }}
              onBlur={() => handleBlur("password")}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
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
