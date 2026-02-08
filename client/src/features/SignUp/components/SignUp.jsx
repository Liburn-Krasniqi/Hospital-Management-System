import { Link } from "react-router-dom";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

import { Card } from "../../../components/UI";
import { useAuth } from "../../../providers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]{8,20}$/;
const MIN_PASSWORD_LENGTH = 6;

const signupPatientFormat = {
  name: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
};

function validateName(name) {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
}

function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
  return "";
}

function validatePhone(phone) {
  if (!phone.trim()) return "Phone is required";
  if (!PHONE_REGEX.test(phone)) return "Please enter a valid phone number (8-20 digits)";
  return "";
}

function validateAddress(address) {
  if (!address.trim()) return "Address is required";
  if (address.trim().length < 5) return "Address must be at least 5 characters";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
}

function validateDateOfBirth(dateOfBirth) {
  if (!dateOfBirth) return "Date of birth is required";
  const date = new Date(dateOfBirth);
  if (isNaN(date.getTime())) return "Please enter a valid date";
  if (date > new Date()) return "Date of birth cannot be in the future";
  return "";
}

export function SignUp() {
  const [patient, setPatient] = useState(signupPatientFormat);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runValidation(field);
  }

  function runValidation(field, overrides = {}) {
    const data = { ...patient, ...overrides };
    let error = "";
    switch (field) {
      case "name":
        error = validateName(data.name);
        break;
      case "email":
        error = validateEmail(data.email);
        break;
      case "phone":
        error = validatePhone(data.phone);
        break;
      case "address":
        error = validateAddress(data.address);
        break;
      case "dateOfBirth":
        error = validateDateOfBirth(data.dateOfBirth);
        break;
      case "password":
        error = validatePassword(data.password);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(data.password, data.confirmPassword);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function validateAll() {
    const newErrors = {
      name: validateName(patient.name),
      email: validateEmail(patient.email),
      phone: validatePhone(patient.phone),
      address: validateAddress(patient.address),
      dateOfBirth: validateDateOfBirth(patient.dateOfBirth),
      password: validatePassword(patient.password),
      confirmPassword: validateConfirmPassword(patient.password, patient.confirmPassword),
    };
    setErrors(newErrors);
    setTouched(
      Object.fromEntries(Object.keys(newErrors).map((k) => [k, true]))
    );
    return Object.values(newErrors).every((e) => !e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (!validateAll()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/patients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patient.name.trim(),
          email: patient.email.trim(),
          phone: patient.phone.trim(),
          address: patient.address.trim(),
          dateOfBirth: patient.dateOfBirth,
          password: patient.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setPatient(signupPatientFormat);
        const user = { email: patient.email, password: patient.password };
        auth.loginAction(user, "http://localhost:8000/api/patients/");
      } else {
        setSubmitError(
          data.message || data.error || "Registration failed. Please try again."
        );
      }
    } catch {
      setSubmitError("Failed to connect. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Card className={"w-50"}>
        <h1 className="color-1">Sign Up</h1>
        <br />
        <Form onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div className="alert alert-danger" role="alert">
              {submitError}
            </div>
          )}
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First and Last Name"
              value={patient.name}
              onChange={(e) => {
                setPatient({ ...patient, name: e.target.value });
                if (touched.name) runValidation("name", { name: e.target.value });
              }}
              onBlur={() => handleBlur("name")}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={patient.email}
              onChange={(e) => {
                setPatient({ ...patient, email: e.target.value });
                if (touched.email) runValidation("email", { email: e.target.value });
              }}
              onBlur={() => handleBlur("email")}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Phone Nr"
              value={patient.phone}
              onChange={(e) => {
                setPatient({ ...patient, phone: e.target.value });
                if (touched.phone) runValidation("phone", { phone: e.target.value });
              }}
              onBlur={() => handleBlur("phone")}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Address"
              value={patient.address}
              onChange={(e) => {
                setPatient({ ...patient, address: e.target.value });
                if (touched.address) runValidation("address", { address: e.target.value });
              }}
              onBlur={() => handleBlur("address")}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPW">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password (min 6 characters)"
              value={patient.password}
              onChange={(e) => {
                const pwd = e.target.value;
                setPatient({ ...patient, password: pwd });
                if (touched.password) runValidation("password", { password: pwd });
                if (touched.confirmPassword) runValidation("confirmPassword", { password: pwd });
              }}
              onBlur={() => handleBlur("password")}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPW">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={patient.confirmPassword}
              onChange={(e) => {
                setPatient({ ...patient, confirmPassword: e.target.value });
                if (touched.confirmPassword)
                  runValidation("confirmPassword", { confirmPassword: e.target.value });
              }}
              onBlur={() => handleBlur("confirmPassword")}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBD">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={patient.dateOfBirth || ""}
              onChange={(e) => {
                setPatient({ ...patient, dateOfBirth: e.target.value });
                if (touched.dateOfBirth)
                  runValidation("dateOfBirth", { dateOfBirth: e.target.value });
              }}
              onBlur={() => handleBlur("dateOfBirth")}
              isInvalid={!!errors.dateOfBirth}
            />
            <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
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
            <Button
              className="background-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Register"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
