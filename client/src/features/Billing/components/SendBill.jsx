import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

export function SendBill() {
  const [searchParams] = useSearchParams();
  const prefillPatientId = searchParams.get("patientId");

  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const [patientId, setPatientId] = useState(prefillPatientId || "");
  const [serviceId, setServiceId] = useState("");
  const [amountOverride, setAmountOverride] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  const isDoctor = user?.role === "doctor";
  const doctorId = user?.id ?? null;

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const [servicesRes, patientsRes] = await Promise.all([
          fetch(`${API}/bills/services`),
          fetch(`${API}/patients/100-0`),
        ]);
        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const patientsData = patientsRes.ok ? await patientsRes.json() : [[], 0];
        setServices(Array.isArray(servicesData) ? servicesData : []);
        const list = Array.isArray(patientsData) ? patientsData[0] : patientsData;
        setPatients(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [doctorId]);

  useEffect(() => {
    if (prefillPatientId) setPatientId(prefillPatientId);
  }, [prefillPatientId]);

  const selectedService = services.find((s) => s.id === serviceId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!patientId || !serviceId || !dueDate) {
      setError("Patient, service, and due date are required.");
      return;
    }

    setSending(true);
    try {
      const body = {
        patientId,
        serviceId,
        dueDate: new Date(dueDate).toISOString(),
      };
      if (amountOverride !== "" && !isNaN(parseFloat(amountOverride))) {
        body.amount = parseFloat(amountOverride);
      }

      const res = await fetch(`${API}/bills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to create bill (${res.status})`);
      }
      const bill = await res.json();
      setPatientId("");
      setServiceId("");
      setAmountOverride("");
      setDueDate(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 10);
      });
      setError("Bill sent successfully. You can send another below.");
      setTimeout(() => setError(null), 4000);
    } catch (e) {
      setError(e?.message || "Failed to send bill");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to send bills.
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
          Only doctors can send bills. You are logged in as {user.role || "patient"}.
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

  const successMsg = error && typeof error === "string" && error.includes("successfully");

  return (
    <div className="mx-auto py-4 px-3" style={{ maxWidth: "640px" }}>
      <Link
        to="/doctor/appointments"
        className="d-inline-flex align-items-center gap-2 text-decoration-none color-2 mb-4 fw-medium"
        style={{ transition: "all 0.2s ease", padding: "0.5rem 0" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ArrowLeft size={18} /> Back to Appointments
      </Link>

      <div className="mb-4">
        <h1
          className="color-2 fw-bold"
          style={{ fontSize: "1.75rem", textShadow: "1px 1px 2px #67C090" }}
        >
          Send bill to patient
        </h1>
        <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
          Create a bill for a patient after a visit. Amount defaults to the service price.
        </p>
      </div>

      {error && (
        <Alert
          className="border-0 mb-4 py-3"
          style={{
            borderRadius: "10px",
            backgroundColor: successMsg ? "#e8f5e9" : "#fdeaea",
            color: successMsg ? "#1b5e20" : "#9a1c1c",
          }}
          onClose={() => setError(null)}
          dismissible
        >
          {error}
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
                onChange={(e) => setPatientId(e.target.value)}
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

            <Form.Group className="mb-3">
              <Form.Label className="color-1 fw-semibold">Service</Form.Label>
              <Form.Select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                required
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ${Number(s.price).toFixed(2)}
                  </option>
                ))}
              </Form.Select>
              {services.length === 0 && (
                <Form.Text className="text-muted">
                  <Link to="/doctor/bills/services">Create services</Link> first.
                </Form.Text>
              )}
            </Form.Group>

            {selectedService && (
              <Form.Group className="mb-3">
                <Form.Label className="color-1 fw-semibold">
                  Amount override (optional)
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountOverride}
                  onChange={(e) => setAmountOverride(e.target.value)}
                  placeholder={`Default: $${Number(selectedService.price).toFixed(2)}`}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="color-1 fw-semibold">Due date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                className="background-2 border-0"
                disabled={sending || services.length === 0}
              >
                {sending ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} className="me-2" />
                    Send bill
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                as={Link}
                to="/doctor/appointments"
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
