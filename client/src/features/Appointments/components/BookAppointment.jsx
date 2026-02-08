import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Form, Card, Spinner, Alert } from "react-bootstrap";
import { Calendar, ArrowLeft, Clock, User, CheckCircle } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

const WORK_START = 8; // 8:00 AM
const WORK_END = 20; // 8:00 PM (20:00)
const SLOT_MINUTES = 30;

function isSlotBlocked(slotStart, appointments) {
  const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60 * 1000);
  const active = (appointments || []).filter(
    (a) => (a.status || "").toLowerCase() !== "canceled" && (a.status || "").toLowerCase() !== "cancelled"
  );
  return active.some((a) => {
    const start = new Date(a.appointmentStartTime);
    const end = new Date(a.appointmentEndTime);
    return start < slotEnd && end > slotStart;
  });
}

function getSlotsForDate(date, appointments) {
  const slots = [];
  const d = new Date(date);
  d.setHours(WORK_START, 0, 0, 0);

  while (true) {
    const h = d.getHours();
    const m = d.getMinutes();
    if (h * 60 + m >= WORK_END * 60) break;

    const slotStart = new Date(d);
    const blocked = isSlotBlocked(slotStart, appointments);
    slots.push({ date: new Date(slotStart), blocked });
    d.setMinutes(d.getMinutes() + SLOT_MINUTES);
  }
  return slots;
}

function getNextDays(n) {
  const days = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatSlot(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDay(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return "Today";
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function formatFullDate(date) {
  if (!date) return "";
  return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

  const isPatient = user?.role === "patient";
  const patientId = user?.id ?? null;
  const days = getNextDays(14);
  const slots = selectedDate ? getSlotsForDate(selectedDate, appointments) : [];

  useEffect(() => {
    if (!doctorId) return;
    Promise.all([
      fetch(`${API}/doctors/id/${doctorId}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API}/appointments/id/${doctorId}`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([doc, appts]) => {
        setDoctor(doc);
        setAppointments(Array.isArray(appts) ? appts : []);
      })
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!selectedSlot || !patientId || !doctorId) return;

    setSending(true);
    try {
      const res = await fetch(`${API}/appointments/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId,
          requestedDate: selectedSlot.toISOString(),
          reason: reason.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Request failed");
      navigate(`/appointments/book/${doctorId}/success`, { state: { doctor } });
    } catch (e) {
      setError(e?.message || "Could not send request");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 color-2">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-5">
        <Alert className="background-4 color-1 border-0 shadow-bottom">Doctor not found.</Alert>
        <Link to="/appointments" className="color-2 text-decoration-none fw-medium">
          Back to Appointments
        </Link>
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

      {/* Doctor header card */}
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
                Dr. {doctor.name}
              </h4>
              <span className="color-2" style={{ fontSize: "0.9rem" }}>
                {doctor.specialty || "General Practice"}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Auth warning */}
      {!user && (
        <Alert className="background-1 color-white border-0 mb-4 py-3" style={{ borderRadius: "10px" }}>
          Please log in to send an appointment request.
        </Alert>
      )}

      {user && !isPatient && (
        <Alert className="background-1 color-white border-0 mb-4 py-3" style={{ borderRadius: "10px" }}>
          Only patients can send appointment requests. You are logged in as a {user.role || "non-patient"}.
        </Alert>
      )}

      {error && (
        <Alert
          className="border-0 mb-4 py-3"
          style={{ borderRadius: "10px", backgroundColor: "#fdeaea", color: "#9a1c1c" }}
          onClose={() => setError(null)}
          dismissible
        >
          <strong>Error:</strong> {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Date selection */}
        <Card className="border-0 mb-3" style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Calendar size={18} className="color-2" />
              <span className="fw-bold color-1" style={{ fontSize: "0.95rem" }}>Select Date</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {days.map((d) => {
                const isSelected = selectedDate && selectedDate.toDateString() === d.toDateString();
                return (
                  <Button
                    key={d.getTime()}
                    type="button"
                    size="sm"
                    className={isSelected ? "background-2 color-white border-0" : "border-0"}
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: "20px",
                      fontWeight: isSelected ? "600" : "500",
                      fontSize: "0.82rem",
                      backgroundColor: isSelected ? undefined : "#f0f9f3",
                      color: isSelected ? undefined : "#26667f",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlot(null);
                    }}
                  >
                    {formatDay(d)}
                  </Button>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* Time slot selection */}
        {selectedDate && (
          <Card className="border-0 mb-3" style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-1">
                <Clock size={18} className="color-2" />
                <span className="fw-bold color-1" style={{ fontSize: "0.95rem" }}>Select Time</span>
              </div>
              <p className="mb-3" style={{ fontSize: "0.8rem", color: "#6b8a9e", margin: 0, paddingTop: "2px" }}>
                {formatFullDate(selectedDate)} &middot; 30 min slots
              </p>
              <div className="d-flex flex-wrap gap-2">
                {slots.map(({ date, blocked }) => {
                  const isSelected = selectedSlot && selectedSlot.getTime() === date.getTime();
                  return (
                    <Button
                      key={date.getTime()}
                      type="button"
                      size="sm"
                      className={
                        isSelected
                          ? "background-2 color-white border-0"
                          : blocked
                            ? "border-0"
                            : "border-0"
                      }
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "20px",
                        fontWeight: isSelected ? "600" : "500",
                        fontSize: "0.82rem",
                        backgroundColor: blocked ? "#e4e8eb" : isSelected ? undefined : "#f0f9f3",
                        color: blocked ? "#a0adb8" : isSelected ? undefined : "#26667f",
                        cursor: blocked ? "not-allowed" : "pointer",
                        textDecoration: blocked ? "line-through" : "none",
                        transition: "all 0.15s ease",
                      }}
                      disabled={blocked}
                      title={blocked ? "Booked" : "Available"}
                      onClick={() => !blocked && setSelectedSlot(date)}
                    >
                      {formatSlot(date)}
                    </Button>
                  );
                })}
              </div>
              {slots.every((s) => s.blocked) && slots.length > 0 && (
                <p className="mt-3 mb-0 fst-italic" style={{ fontSize: "0.82rem", color: "#9a1c1c" }}>
                  All slots are booked for this day. Please select another date.
                </p>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Reason + actions */}
        <Card className="border-0 mb-3" style={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <Card.Body className="p-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold color-1 mb-2" style={{ fontSize: "0.95rem" }}>
                Reason <span style={{ fontWeight: "400", color: "#6b8a9e" }}>(optional)</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="color-1 border"
                style={{
                  borderRadius: "10px",
                  padding: "0.75rem",
                  backgroundColor: "#fafcfb",
                  resize: "none",
                  borderColor: "#d6e4dc",
                  fontSize: "0.9rem",
                }}
                placeholder="Brief reason for the visit..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Group>

            {/* Summary line */}
            {selectedSlot && (
              <div
                className="d-flex align-items-center gap-2 mb-4 px-3 py-2"
                style={{ backgroundColor: "#f0f9f3", borderRadius: "8px", fontSize: "0.85rem" }}
              >
                <CheckCircle size={16} className="color-3 flex-shrink-0" />
                <span className="color-1">
                  <strong>{formatDay(selectedDate)}</strong> at <strong>{formatSlot(selectedSlot)}</strong> with Dr. {doctor.name}
                </span>
              </div>
            )}

            <div className="d-flex gap-3 align-items-center">
              <Button
                type="submit"
                className="d-inline-flex align-items-center gap-2 background-2 color-white border-0 fw-semibold"
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  fontSize: "0.9rem",
                }}
                disabled={!selectedSlot || !patientId || sending}
              >
                {sending ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Calendar size={18} />
                )}
                Send Request
              </Button>
              <Button
                as={Link}
                to="/appointments"
                variant="light"
                className="border-0 color-2 fw-medium"
                style={{
                  padding: "0.6rem 1.5rem",
                  borderRadius: "10px",
                  backgroundColor: "#f0f9f3",
                  transition: "all 0.2s ease",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
}
