import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Calendar } from "lucide-react";

import Card from "react-bootstrap/Card";

const WORK_START = 8; // 8:00 AM
const WORK_END = 20; // 8:00 PM (20:00)
const SLOT_MINUTES = 30;

function isOutsideWorkingHours(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const totalMins = h * 60 + m;
  return totalMins < WORK_START * 60 || totalMins >= WORK_END * 60;
}

function getNextSixSlots(from) {
  const slots = [];
  let d = new Date(from);
  d.setSeconds(0, 0);

  const toSlotStart = (date) => {
    const nd = new Date(date);
    const m = nd.getMinutes();
    const nextM = m % SLOT_MINUTES === 0 ? m : Math.ceil(m / SLOT_MINUTES) * SLOT_MINUTES;
    nd.setMinutes(nextM === 60 ? 0 : nextM);
    if (nextM === 60) nd.setHours(nd.getHours() + 1);
    nd.setSeconds(0, 0);
    return nd;
  };

  const advanceToNextWorking = (date) => {
    const nd = new Date(date);
    const h = nd.getHours();
    const m = nd.getMinutes();
    const total = h * 60 + m;
    if (total < WORK_START * 60) {
      nd.setHours(WORK_START, 0, 0, 0);
      return nd;
    }
    if (total >= WORK_END * 60) {
      nd.setDate(nd.getDate() + 1);
      nd.setHours(WORK_START, 0, 0, 0);
      return nd;
    }
    return nd;
  };

  let cur = toSlotStart(d);
  cur = advanceToNextWorking(cur);

  while (slots.length < 6) {
    const h = cur.getHours();
    const m = cur.getMinutes();
    if (h * 60 + m >= WORK_END * 60) {
      cur.setDate(cur.getDate() + 1);
      cur.setHours(WORK_START, 0, 0, 0);
    }
    slots.push(new Date(cur));
    cur.setMinutes(cur.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}

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

function formatSlot(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

export function DoctorCard({ doctorId, name, speciality, appointments = [] }) {
  const now = new Date();
  const outOfHours = isOutsideWorkingHours(now);
  const slots = outOfHours ? [] : getNextSixSlots(now);

  return (
    <Card style={{ width: "18rem" }} className="shadow border-none border-0">
      <Card.Body>
        <Card.Title className="color-1">Dr. {name}</Card.Title>
        <Card.Subtitle className="d-inline-block w-auto mb-2 text-muted background-3 rounded-2 px-2">
          {speciality}
        </Card.Subtitle>
        <Card.Text className="d-flex flex-column">
          <strong className="mb-1">Available Times:</strong>
          <div
            className="d-flex flex-row w-auto gap-1 flex-wrap"
            style={{ width: "fit-content" }}
          >
            {outOfHours ? (
              <span className="text-muted small">Out of work hours (8 AM – 8 PM)</span>
            ) : (
              slots.map((slot) => {
                const blocked = isSlotBlocked(slot, appointments);
                return (
                  <p
                    key={slot.getTime()}
                    className={`p-1 rounded-1 ${blocked ? "bg-secondary text-white" : "background-4"}`}
                    title={blocked ? "Booked" : "Available"}
                  >
                    {formatSlot(slot)}
                  </p>
                );
              })
            )}
          </div>
        </Card.Text>
        <div className="text-center">
          <Button
            className="d-inline-flex w-auto gap-2 background-2 border-0 shadow-sm align-items-center ms-auto"
            as={Link}
            to={doctorId ? `/appointments/book/${doctorId}` : "/appointments"}
            style={{ width: "fit-content" }}
          >
            <Calendar size={20} className="color-3" />
            Book Appointment
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
