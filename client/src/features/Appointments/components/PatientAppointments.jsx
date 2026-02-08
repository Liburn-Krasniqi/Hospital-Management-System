import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import { Calendar, ArrowLeft, User, Clock } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

function formatTimeRange(startStr, endStr) {
  if (!startStr || !endStr) return "—";
  const start = new Date(startStr).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const end = new Date(endStr).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function PatientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isPatient = user?.role === "patient";
  const patientId = user?.id ?? null;

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    fetch(`${API}/appointments/patient/${patientId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to view your appointment history.
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

  const upcoming = appointments.filter((a) => {
    const status = (a.status || "").toLowerCase();
    const isCancelled =
      status === "canceled" || status === "cancelled";
    const isPast = new Date(a.appointmentStartTime) < new Date();
    return !isCancelled && !isPast;
  });

  const past = appointments.filter((a) => {
    const status = (a.status || "").toLowerCase();
    const isCancelled =
      status === "canceled" || status === "cancelled";
    const isPast = new Date(a.appointmentStartTime) < new Date();
    return isCancelled || isPast;
  });

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
          Appointment History
        </h1>
        <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
          Your scheduled and past appointments.
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

      {appointments.length === 0 && (
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
              No appointments yet.
            </p>
            <p className="color-2 mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
              Approved requests will appear here as scheduled appointments.
            </p>
            <Link
              to="/appointments"
              className="btn background-2 color-white border-0 mt-3"
            >
              Book an Appointment
            </Link>
          </Card.Body>
        </Card>
      )}

      {upcoming.length > 0 && (
        <div className="mb-4">
          <h5
            className="color-1 fw-semibold mb-3"
            style={{ fontSize: "1rem" }}
          >
            Upcoming ({upcoming.length})
          </h5>
          <div className="d-flex flex-column gap-2">
            {upcoming.map((apt) => (
              <Card
                key={apt.id}
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
                          Dr. {apt.doctor?.name ?? "Doctor"}
                        </h6>
                        <p
                          className="mb-1"
                          style={{
                            fontSize: "0.8rem",
                            color: "#6b8a9e",
                          }}
                        >
                          {apt.doctor?.specialty ?? "General Practice"}
                        </p>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <Clock size={14} className="color-2" />
                          <span
                            className="color-1"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {formatDate(apt.appointmentStartTime)} ·{" "}
                            {formatTimeRange(
                              apt.appointmentStartTime,
                              apt.appointmentEndTime
                            )}
                          </span>
                        </div>
                        {apt.reason && (
                          <p
                            className="mb-0 mt-2"
                            style={{
                              fontSize: "0.85rem",
                              color: "#124170",
                            }}
                          >
                            <strong>Reason:</strong> {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      bg="success"
                      className="border-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {apt.status || "scheduled"}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h5
            className="color-1 fw-semibold mb-3"
            style={{ fontSize: "1rem" }}
          >
            Past ({past.length})
          </h5>
          <div className="d-flex flex-column gap-2">
            {past.map((apt) => (
              <Card
                key={apt.id}
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
                        Dr. {apt.doctor?.name ?? "Doctor"}
                      </span>
                      <span
                        className="color-2 ms-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {formatDate(apt.appointmentStartTime)} ·{" "}
                        {formatTimeRange(
                          apt.appointmentStartTime,
                          apt.appointmentEndTime
                        )}
                      </span>
                    </div>
                    <Badge
                      bg={
                        (apt.status || "").toLowerCase() === "completed"
                          ? "secondary"
                          : "danger"
                      }
                      className="border-0"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {apt.status || "—"}
                    </Badge>
                  </div>
                  {apt.reason && (
                    <p
                      className="mb-0 mt-1"
                      style={{ fontSize: "0.8rem", color: "#6b8a9e" }}
                    >
                      {apt.reason}
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
