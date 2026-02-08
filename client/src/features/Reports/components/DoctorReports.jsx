import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Spinner, Alert, Badge, Collapse } from "react-bootstrap";
import { FileText, ArrowLeft, User, Calendar } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ReportCard({ report }) {
  const [open, setOpen] = useState(false);
  const typeColors = {
    CONSULTATION: "info",
    SURGERY: "danger",
    TEST: "warning",
    OTHER: "secondary",
  };
  const typeColor = typeColors[report.typeOfVisit] || "secondary";

  return (
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
        <div
          className="d-flex align-items-start justify-content-between gap-3 flex-wrap cursor-pointer"
          onClick={() => setOpen(!open)}
          style={{ cursor: "pointer" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center background-2 rounded-circle flex-shrink-0"
              style={{ width: "44px", height: "44px" }}
            >
              <User size={20} color="#fff" />
            </div>
            <div>
              <h6 className="color-1 fw-bold mb-1" style={{ fontSize: "1rem" }}>
                {report.patient?.name ?? "Patient"}
              </h6>
              <p
                className="mb-1"
                style={{ fontSize: "0.8rem", color: "#6b8a9e" }}
              >
                {report.patient?.email}
              </p>
              <div className="d-flex align-items-center gap-2 mt-1">
                <Calendar size={14} className="color-2" />
                <span className="color-1" style={{ fontSize: "0.9rem" }}>
                  {formatDate(report.reportDate)}
                </span>
              </div>
            </div>
          </div>
          <Badge
            bg={typeColor}
            className="border-0"
            style={{ fontSize: "0.75rem" }}
          >
            {report.typeOfVisit ?? "CONSULTATION"}
          </Badge>
        </div>

        <Collapse in={open}>
          <div className="mt-4 pt-3 border-top">
            <h6 className="color-1 fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Findings
            </h6>
            <p className="color-1 mb-3" style={{ fontSize: "0.9rem" }}>
              {report.findings}
            </p>
            <h6 className="color-1 fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Recommendations
            </h6>
            <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
              {report.recommendations}
            </p>
          </div>
        </Collapse>
        <button
          className="btn btn-link btn-sm p-0 mt-2 color-2 text-decoration-none"
          onClick={() => setOpen(!open)}
          style={{ fontSize: "0.85rem" }}
        >
          {open ? "Show less" : "Show details"}
        </button>
      </Card.Body>
    </Card>
  );
}

export function DoctorReports() {
  const { user } = useAuth();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const justCreated = location.state?.created === true;

  const isDoctor = user?.role === "doctor";
  const doctorId = user?.id ?? null;

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    fetch(`${API}/reports/doctor/${doctorId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to load reports"))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to view your reports.
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
          Only doctors can access this page. You are logged in as{" "}
          {user.role || "patient"}.
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

      <div className="mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h1
            className="color-2 fw-bold"
            style={{ fontSize: "1.75rem", textShadow: "1px 1px 2px #67C090" }}
          >
            My Reports
          </h1>
          <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
            Reports you have written for patients.
          </p>
        </div>
        <Link
          to="/doctor/reports/create"
          className="btn background-2 color-white border-0"
        >
          Write Report
        </Link>
      </div>

      {justCreated && (
        <Alert
          className="border-0 mb-4 py-3"
          style={{
            borderRadius: "10px",
            backgroundColor: "#d4edda",
            color: "#155724",
          }}
        >
          Report created successfully.
        </Alert>
      )}

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

      {reports.length === 0 && (
        <Card
          className="border-0"
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Card.Body className="p-5 text-center">
            <FileText
              size={48}
              className="color-2 mb-3"
              style={{ opacity: 0.6 }}
            />
            <p className="color-1 mb-0" style={{ fontSize: "1rem" }}>
              No reports yet.
            </p>
            <p className="color-2 mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
              Reports you create for patients will appear here.
            </p>
            <Link
              to="/doctor/reports/create"
              className="btn background-2 color-white border-0 mt-3"
            >
              Write Report
            </Link>
          </Card.Body>
        </Card>
      )}

      {reports.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
