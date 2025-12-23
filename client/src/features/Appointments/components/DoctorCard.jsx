import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Calendar } from "lucide-react";

import Card from "react-bootstrap/Card";

export function DoctorCard({ name, speciality, availableTimes }) {
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
            <p className="background-4 p-1 rounded-1">2:30 PM</p>
            <p className="background-4 p-1 rounded-1">2:30 PM</p>
            <p className="background-4 p-1 rounded-1">2:30 PM</p>
            <p className="background-4 p-1 rounded-1">2:30 PM</p>
          </div>
        </Card.Text>
        <div className="text-center">
          <Button
            className="d-inline-flex w-auto gap-2 background-2 border-0 shadow-sm align-items-center ms-auto"
            as={Link}
            to={"/"}
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
