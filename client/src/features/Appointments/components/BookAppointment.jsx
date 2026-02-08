import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Form, Card, Spinner, Alert } from "react-bootstrap";
import { Calendar, ArrowLeft } from "lucide-react";
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

export function BookAppointment() {
  const { doctorId } = useParams();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

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
      setSuccess(true);
      setSelectedSlot(null);
      setReason("");
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
    <div className="mx-auto py-4 px-3" style={{ maxWidth: "720px" }}>
      <Link
        to="/appointments"
        className="d-inline-flex align-items-center gap-2 text-decoration-none color-2 mb-4 fw-medium"
        style={{
          transition: "all 0.2s ease",
          border: "none",
          outline: "none",
          padding: "0.5rem 0",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <ArrowLeft size={20} /> Back to Doctors
      </Link>

      <Card className="shadow-bottom border-0 mb-4">
        <Card.Body className="p-4">
          <Card.Title className="color-1 fs-3 fw-bold mb-2">Book Appointment</Card.Title>
          <Card.Subtitle className="color-2 fs-6">
            Dr. {doctor.name} · {doctor.specialty || "General"}
          </Card.Subtitle>
        </Card.Body>
      </Card>

      {!patientId && (
        <Alert className="background-2 color-white border-0 shadow-bottom mb-4 py-3">
          Please log in as a patient to send an appointment request.
        </Alert>
      )}

      {success && (
        <Alert className="background-3 color-1 border-0 shadow-bottom mb-4 py-3" onClose={() => setSuccess(false)} dismissible>
          <strong>Success!</strong> Request sent. The doctor will review it.
        </Alert>
      )}

      {error && (
        <Alert className="background-1 color-4 border-0 shadow-bottom mb-4 py-3" onClose={() => setError(null)} dismissible>
          <strong>Error:</strong> {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold color-1 mb-3 fs-6">Select Date</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {days.map((d) => {
              const isSelected = selectedDate && selectedDate.toDateString() === d.toDateString();
              return (
                <Button
                  key={d.getTime()}
                  type="button"
                  variant="light"
                  className={isSelected ? "background-2 color-white border-0 shadow-sm" : "border-0 shadow-sm"}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    fontWeight: isSelected ? "600" : "500",
                    backgroundColor: isSelected ? undefined : "#fff",
                    color: isSelected ? undefined : "#26667f",
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
        </Form.Group>

        {selectedDate && (
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold color-1 mb-3 fs-6">Select Time (8 AM – 8 PM)</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {slots.map(({ date, blocked }) => {
                const isSelected = selectedSlot && selectedSlot.getTime() === date.getTime();
                return (
                  <Button
                    key={date.getTime()}
                    type="button"
                    variant="light"
                    className={
                      isSelected
                        ? "background-2 color-white border-0 shadow-sm"
                        : blocked
                          ? "border-0"
                          : "border-0 shadow-sm"
                    }
                    style={{
                      padding: "0.5rem 0.875rem",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      fontWeight: isSelected ? "600" : "500",
                      backgroundColor: blocked ? "#124170" : isSelected ? undefined : "#fff",
                      color: blocked ? "#ddf4e7" : isSelected ? undefined : "#26667f",
                      opacity: blocked ? 0.6 : 1,
                      cursor: blocked ? "not-allowed" : "pointer",
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
              <Form.Text className="color-2 d-block mt-2 fst-italic">
                All slots are booked for this day. Please select another date.
              </Form.Text>
            )}
          </Form.Group>
        )}

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold color-1 mb-3 fs-6">Reason (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            className="color-1 border-0 shadow-sm"
            style={{
              borderRadius: "8px",
              padding: "0.75rem",
              backgroundColor: "#fff",
              resize: "none",
            }}
            placeholder="Brief reason for the visit..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex gap-3 align-items-center flex-wrap">
          <Button
            type="submit"
            className="d-inline-flex align-items-center gap-2 background-2 color-white border-0 shadow-sm fw-semibold"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
            disabled={!selectedSlot || !patientId || sending}
          >
            {sending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Calendar size={20} className="color-3" />
            )}
            Send Request
          </Button>
          <Button
            as={Link}
            to="/appointments"
            variant="light"
            className="border-0 shadow-sm color-2 fw-medium"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "#fff",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
