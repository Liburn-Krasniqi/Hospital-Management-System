import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import { Calendar, ArrowLeft, User, Clock, FileText, Receipt } from "lucide-react";
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

function groupByDate(appointments) {
  const groups = {};
  for (const apt of appointments) {
    const d = new Date(apt.appointmentStartTime);
    const key = d.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(apt);
  }
  return Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b));
}

export function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDoctor = user?.role === "doctor";
  const doctorId = user?.id ?? null;

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    fetch(`${API}/appointments/id/${doctorId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to view your appointments.
        </Alert>
        <Link to="/login" className="color-2 text-decoration-none fw-medium">
          Log In
        </Link>
      </div>
    );
  }

  if (!isDoctor) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Only doctors can access this page. You are logged in as {user.role || "patient"}.
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

  const activeAppointments = appointments.filter(
    (a) =>
      (a.status || "").toLowerCase() !== "canceled" &&
      (a.status || "").toLowerCase() !== "cancelled"
  );
  const pastAppointments = appointments.filter(
    (a) =>
      (a.status || "").toLowerCase() === "canceled" ||
      (a.status || "").toLowerCase() === "cancelled"
  );
  const groups = groupByDate(activeAppointments);

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
          My Appointments
        </h1>
        <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
          Your scheduled appointments with patients.
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

      {activeAppointments.length === 0 && pastAppointments.length === 0 && (
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
          </Card.Body>
        </Card>
      )}

      {groups.length > 0 && (
        <div className="d-flex flex-column gap-4">
          {groups.map(([dateKey, dayAppointments]) => {
            const date = new Date(dateKey);
            const dateLabel = date.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            });
            return (
              <div key={dateKey}>
                <h5
                  className="color-1 fw-semibold mb-3"
                  style={{ fontSize: "1rem" }}
                >
                  {dateLabel}
                </h5>
                <div className="d-flex flex-column gap-2">
                  {dayAppointments.map((apt) => (
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
                                {apt.patient?.name ?? "Patient"}
                              </h6>
                              <p
                                className="mb-1"
                                style={{
                                  fontSize: "0.8rem",
                                  color: "#6b8a9e",
                                }}
                              >
                                {apt.patient?.email}
                              </p>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                <Clock size={14} className="color-2" />
                                <span
                                  className="color-1"
                                  style={{ fontSize: "0.9rem" }}
                                >
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
                          <div className="d-flex align-items-center gap-2">
                            <Link
                              to={`/doctor/reports/create?patientId=${apt.patientId || apt.patient?.id}&appointmentId=${apt.id}`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              <FileText size={14} className="me-1" />
                              Write report
                            </Link>
                            <Link
                              to={`/doctor/bills/send?patientId=${apt.patientId || apt.patient?.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Receipt size={14} className="me-1" />
                              Send bill
                            </Link>
                            <Badge
                              bg={
                                apt.status?.toLowerCase() === "completed"
                                  ? "secondary"
                                  : "success"
                              }
                              className="border-0"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {apt.status || "scheduled"}
                            </Badge>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
