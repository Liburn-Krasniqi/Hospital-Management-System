import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import { Calendar, ArrowLeft, User, Clock } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PatientAppointmentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isPatient = user?.role === "patient";
  const patientId = user?.id ?? null;

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    fetch(`${API}/appointments/requests?patientId=${patientId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to load requests"))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to view your appointment requests.
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
          Only patients can access this page. You are logged in as{" "}
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

  const pendingRequests = requests.filter(
    (r) => (r.status || "").toLowerCase() === "pending"
  );
  const otherRequests = requests.filter(
    (r) => (r.status || "").toLowerCase() !== "pending"
  );

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
          My Requests
        </h1>
        <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
          Track your appointment requests awaiting doctor approval.
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

      {pendingRequests.length === 0 && otherRequests.length === 0 && (
        <Card
          className="border-0"
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Card.Body className="p-5 text-center">
            <Calendar
              size={48}
              className="color-2 mb-3"
              style={{ opacity: 0.6 }}
            />
            <p className="color-1 mb-0" style={{ fontSize: "1rem" }}>
              No appointment requests yet.
            </p>
            <p className="color-2 mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
              Book an appointment with a doctor to see your requests here.
            </p>
            <Link
              to="/appointments"
              className="btn background-2 color-white border-0 mt-3"
            >
              Browse Doctors
            </Link>
          </Card.Body>
        </Card>
      )}

      {pendingRequests.length > 0 && (
        <div className="mb-4">
          <h5
            className="color-1 fw-semibold mb-3"
            style={{ fontSize: "1rem" }}
          >
            Pending ({pendingRequests.length})
          </h5>
          <div className="d-flex flex-column gap-3">
            {pendingRequests.map((req) => (
              <Card
                key={req.id}
                className="border-0"
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #124170, #26667f)",
                  }}
                />
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center background-2 rounded-circle flex-shrink-0"
                        style={{ width: "44px", height: "44px" }}
                      >
                        <User size={20} color="#fff" />
                      </div>
                      <div>
                        <h6
                          className="color-1 fw-bold mb-1"
                          style={{ fontSize: "1rem" }}
                        >
                          Dr. {req.doctor?.name ?? "Doctor"}
                        </h6>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "0.8rem",
                            color: "#6b8a9e",
                          }}
                        >
                          {req.doctor?.specialty ?? "General Practice"}
                        </p>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <Clock size={14} className="color-2" />
                          <span
                            className="color-1"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {formatDateTime(req.requestedDate)}
                          </span>
                        </div>
                        {req.reason && (
                          <p
                            className="mb-0 mt-2"
                            style={{
                              fontSize: "0.85rem",
                              color: "#124170",
                            }}
                          >
                            <strong>Reason:</strong> {req.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      bg="warning"
                      text="dark"
                      className="border-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Awaiting response
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {otherRequests.length > 0 && (
        <div>
          <h5
            className="color-1 fw-semibold mb-3"
            style={{ fontSize: "1rem" }}
          >
            Recent ({otherRequests.length})
          </h5>
          <div className="d-flex flex-column gap-2">
            {otherRequests.map((req) => (
              <Card
                key={req.id}
                className="border-0"
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                  backgroundColor: "#f8faf9",
                }}
              >
                <Card.Body className="py-3 px-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="color-1 fw-medium">
                        Dr. {req.doctor?.name ?? "Doctor"}
                      </span>
                      <span
                        className="color-2 ms-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {formatDateTime(req.requestedDate)}
                      </span>
                    </div>
                    <Badge
                      bg={
                        req.status?.toLowerCase() === "approved"
                          ? "success"
                          : "secondary"
                      }
                      className="border-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {req.status}
                    </Badge>
                  </div>
                  {req.reason && (
                    <p
                      className="mb-0 mt-1"
                      style={{ fontSize: "0.8rem", color: "#6b8a9e" }}
                    >
                      {req.reason}
                    </p>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
