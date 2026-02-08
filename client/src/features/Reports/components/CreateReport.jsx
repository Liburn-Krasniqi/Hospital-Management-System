import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { FileText, ArrowLeft } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

const TYPE_OPTIONS = [
  { value: "CONSULTATION", label: "Consultation" },
  { value: "SURGERY", label: "Surgery" },
  { value: "TEST", label: "Test" },
  { value: "OTHER", label: "Other" },
];

export function CreateReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillPatientId = searchParams.get("patientId");
  const prefillAppointmentId = searchParams.get("appointmentId");

  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const [patientId, setPatientId] = useState(prefillPatientId || "");
  const [appointmentId, setAppointmentId] = useState(prefillAppointmentId || "");
  const [findings, setFindings] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [typeOfVisit, setTypeOfVisit] = useState("CONSULTATION");

  const isDoctor = user?.role === "doctor";
  const doctorId = user?.id ?? null;

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        const [apptsRes, patientsRes] = await Promise.all([
          fetch(`${API}/appointments/id/${doctorId}`),
          fetch(`${API}/patients/100-0`),
        ]);

        const appts = apptsRes.ok ? await apptsRes.json() : [];
        const patientsData = patientsRes.ok ? await patientsRes.json() : [[], 0];

        setAppointments(Array.isArray(appts) ? appts : []);
        const patientList = Array.isArray(patientsData)
          ? patientsData[0]
          : [];
        setPatients(Array.isArray(patientList) ? patientList : []);
      } catch (e) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [doctorId]);

  const appointmentsForPatient = appointments.filter((a) => {
    const aptPatientId = a.patientId ?? a.patient?.id;
    return aptPatientId === patientId;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!patientId || !findings.trim() || !recommendations.trim()) {
      setError("Patient, findings, and recommendations are required.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId,
          findings: findings.trim(),
          recommendations: recommendations.trim(),
          typeOfVisit,
          appointmentId: appointmentId || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to create report (${res.status})`);
      }
      navigate("/doctor/reports", { state: { created: true } });
    } catch (e) {
      setError(e?.message || "Failed to create report");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to write reports.
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
          Only doctors can write reports. You are logged in as {user.role || "patient"}.
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

  return (
    <div className="mx-auto py-4 px-3" style={{ maxWidth: "640px" }}>
      <Link
        to="/doctor/reports"
        className="d-inline-flex align-items-center gap-2 text-decoration-none color-2 mb-4 fw-medium"
        style={{ transition: "all 0.2s ease", padding: "0.5rem 0" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ArrowLeft size={18} /> Back to Reports
      </Link>

      <div className="mb-4">
        <h1
          className="color-2 fw-bold"
          style={{ fontSize: "1.75rem", textShadow: "1px 1px 2px #67C090" }}
        >
          Write Report
        </h1>
        <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
          Create a medical report for a patient after a visit.
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

      <Card
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
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="color-1 fw-semibold">Patient</Form.Label>
              <Form.Select
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  setAppointmentId("");
                }}
                required
              >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {appointmentsForPatient.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label className="color-1 fw-semibold">
                  Link to appointment (optional)
                </Form.Label>
                <Form.Select
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                >
                  <option value="">None</option>
                  {appointmentsForPatient.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {new Date(apt.appointmentStartTime).toLocaleString()} –{" "}
                      {apt.reason || "No reason"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="color-1 fw-semibold">Type of visit</Form.Label>
              <Form.Select
                value={typeOfVisit}
                onChange={(e) => setTypeOfVisit(e.target.value)}
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="color-1 fw-semibold">Findings</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Document clinical findings, observations, test results..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="color-1 fw-semibold">Recommendations</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="Treatment plan, follow-up instructions, medications..."
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                className="background-2 border-0"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FileText size={18} className="me-2" />
                    Create Report
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/doctor/reports")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
