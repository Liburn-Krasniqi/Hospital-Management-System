import Card from "react-bootstrap/Card";
import classes from "./UICard.module.css";

export function UICard({ title, text, children }) {
  return (
    <Card
      style={{
        width: "18rem",
        border: "none",
      }}
    >
      {/* Icon container */}
      <div
        className="d-flex justify-content-center align-items-center rounded mt-3"
        style={{
          backgroundColor: "#eaf9faff",
          width: "50px",
          height: "50px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>

      {/* Card body */}
      <Card.Body className="text-center">
        <Card.Title className="mb-3">{title}</Card.Title>
        <Card.Text className={`fw-normal ${classes.paragraph}`}>
          {text}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
