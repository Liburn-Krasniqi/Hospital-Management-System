import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import { ArrowLeft, Receipt } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PatientBills() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isPatient = user?.role === "patient";
  const patientId = user?.id ?? null;

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    fetch(`${API}/bills/patient/${patientId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBills(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to load bills"))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to view your bills.
        </Alert>
        <Link to="/login" className="color-2 text-decoration-none fw-medium">
          Log In
        </Link>
      </div>
    );
  }

  if (!isPatient) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Only patients can view this page. You are logged in as{" "}
          {user.role || "doctor"}.
        </Alert>
        <Link to="/" className="color-2 text-decoration-none fw-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 color-2">
        <Spinner animation="border" />
      </div>
    );
  }

  const unpaid = bills.filter(
    (b) => (b.status || "").toLowerCase() !== "paid"
  );
  const paid = bills.filter((b) => (b.status || "").toLowerCase() === "paid");

  return (
    <div className="mx-auto py-4 px-3" style={{ maxWidth: "720px" }}>
      <Link
        to="/"
        className="d-inline-flex align-items-center gap-2 text-decoration-none color-2 mb-4 fw-medium"
        style={{ transition: "all 0.2s ease", padding: "0.5rem 0" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="mb-4">
        <h1
          className="color-2 fw-bold"
          style={{ fontSize: "1.75rem", textShadow: "1px 1px 2px #67C090" }}
        >
          My Bills
        </h1>
        <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
          Bills from your visits. Pay by the due date to avoid overdue status.
        </p>
      </div>

      {error && (
        <Alert
          className="border-0 mb-4 py-3"
          style={{
            borderRadius: "10px",
            backgroundColor: "#fdeaea",
            color: "#9a1c1c",
          }}
          onClose={() => setError(null)}
          dismissible
        >
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {bills.length === 0 ? (
        <Card
          className="border-0"
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Card.Body className="p-5 text-center">
            <Receipt
              size={48}
              className="color-2 mb-3"
              style={{ opacity: 0.6 }}
            />
            <p className="color-1 mb-0" style={{ fontSize: "1rem" }}>
              No bills yet.
            </p>
            <p className="color-2 mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
              Bills from your visits will appear here once your doctor sends them.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {unpaid.length > 0 && (
            <h5 className="color-1 fw-semibold" style={{ fontSize: "1rem" }}>
              Unpaid
            </h5>
          )}
          {unpaid.map((bill) => (
            <Card
              key={bill.id}
              className="border-0"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  height: "4px",
                  background: "linear-gradient(90deg, #124170, #26667f)",
                }}
              />
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h6 className="color-1 fw-bold mb-1" style={{ fontSize: "1rem" }}>
                      {bill.service?.name ?? "Service"}
                    </h6>
                    <p className="mb-1" style={{ fontSize: "0.85rem", color: "#6b8a9e" }}>
                      Billed {formatDate(bill.billingDate)} · Due{" "}
                      {formatDate(bill.dueDate)}
                    </p>
                    <Badge
                      bg={
                        (bill.status || "").toLowerCase() === "overdue"
                          ? "danger"
                          : "warning"
                      }
                      className="border-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {bill.status || "unpaid"}
                    </Badge>
                  </div>
                  <div className="fw-bold color-1" style={{ fontSize: "1.25rem" }}>
                    ${Number(bill.amount).toFixed(2)}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {paid.length > 0 && (
            <h5 className="color-1 fw-semibold mt-2" style={{ fontSize: "1rem" }}>
              Paid
            </h5>
          )}
          {paid.map((bill) => (
            <Card
              key={bill.id}
              className="border-0"
              style={{
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                opacity: 0.9,
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h6 className="color-1 fw-bold mb-1" style={{ fontSize: "1rem" }}>
                      {bill.service?.name ?? "Service"}
                    </h6>
                    <p className="mb-1" style={{ fontSize: "0.85rem", color: "#6b8a9e" }}>
                      Billed {formatDate(bill.billingDate)}
                    </p>
                    <Badge bg="success" className="border-0" style={{ fontSize: "0.75rem" }}>
                      Paid
                    </Badge>
                  </div>
                  <div className="fw-bold color-1" style={{ fontSize: "1.25rem" }}>
                    ${Number(bill.amount).toFixed(2)}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
