import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import { ArrowLeft, User, CheckCircle } from "lucide-react";

const API = "http://localhost:8000/api";

export function AppointmentRequestSuccess() {
  const { doctorId } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState(location.state?.doctor ?? null);
  const [loading, setLoading] = useState(!location.state?.doctor);

  useEffect(() => {
    if (doctorId && !location.state?.doctor) {
      fetch(`${API}/doctors/id/${doctorId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then(setDoctor)
        .finally(() => setLoading(false));
    }
  }, [doctorId, location.state?.doctor]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 color-2">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
      <Link
        to="/appointments"
        className="d-inline-flex align-items-center gap-2 text-decoration-none color-2 mb-4 fw-medium"
        style={{ transition: "all 0.2s ease", padding: "0.5rem 0" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ArrowLeft size={18} /> Back to Doctors
      </Link>

      {/* Doctor info card */}
      <Card className="border-0 mb-4" style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ height: "4px", background: "linear-gradient(90deg, #124170, #26667f, #67c090)" }} />
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center background-2 rounded-circle flex-shrink-0"
              style={{ width: "48px", height: "48px" }}
            >
              <User size={22} color="#fff" />
            </div>
            <div>
              <h4 className="color-1 fw-bold mb-1" style={{ fontSize: "1.25rem" }}>
                Dr. {doctor?.name ?? "—"}
              </h4>
              <span className="color-2" style={{ fontSize: "0.9rem" }}>
                {doctor?.specialty || "General Practice"}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Success message */}
      <div
        className="d-flex align-items-center gap-3 px-4 py-4 border-0"
        style={{
          borderRadius: "12px",
          backgroundColor: "#e8f8ee",
          color: "#124170",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <CheckCircle size={28} className="color-3 flex-shrink-0" />
        <div>
          <p className="mb-0 fw-semibold" style={{ fontSize: "1rem" }}>
            Request sent!
          </p>
          <p className="mb-0" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
            The doctor will review and confirm your appointment.
          </p>
        </div>
      </div>
    </div>
  );
}
