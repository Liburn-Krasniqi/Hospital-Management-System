import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Spinner, Alert, Button, Form, Table } from "react-bootstrap";
import { ArrowLeft, Plus, DollarSign } from "lucide-react";
import { useAuth } from "../../../providers";

const API = "http://localhost:8000/api";

export function DoctorServices() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const isDoctor = user?.role === "doctor";

  useEffect(() => {
    fetch(`${API}/bills/services`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch((e) => setError(e?.message || "Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    const p = parseFloat(price);
    if (!name.trim() || isNaN(p) || p < 0) {
      setError("Name and a valid price are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/bills/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          price: p,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create service");
      }
      const created = await res.json();
      setServices((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      setPrice("");
      setShowForm(false);
    } catch (e) {
      setError(e?.message || "Failed to create service");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto py-4 px-3" style={{ maxWidth: "680px" }}>
        <Alert className="background-4 color-1 border-0 shadow-bottom">
          Please log in to manage services.
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
          Only doctors can manage services. You are logged in as{" "}
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

      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1
            className="color-2 fw-bold"
            style={{ fontSize: "1.75rem", textShadow: "1px 1px 2px #67C090" }}
          >
            Billing Services
          </h1>
          <p className="color-1 mb-0" style={{ fontSize: "0.9rem" }}>
            Create and manage services with set prices for billing patients.
          </p>
        </div>
        <Button
          className="background-2 border-0"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus size={18} className="me-1" />
          {showForm ? "Cancel" : "New service"}
        </Button>
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

      {showForm && (
        <Card
          className="border-0 mb-4"
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
            <h5 className="color-1 fw-semibold mb-3">Create service</h5>
            <Form onSubmit={handleCreate}>
              <Form.Group className="mb-3">
                <Form.Label className="color-1">Name</Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. General Consultation"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="color-1">Description (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the service"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="color-1">Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                className="background-2 border-0"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <DollarSign size={18} className="me-2" />
                    Create service
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {services.length === 0 ? (
        <Card
          className="border-0"
          style={{
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Card.Body className="p-5 text-center">
            <DollarSign size={48} className="color-2 mb-3" style={{ opacity: 0.6 }} />
            <p className="color-1 mb-0" style={{ fontSize: "1rem" }}>
              No services yet.
            </p>
            <p className="color-2 mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
              Create a service to use when sending bills to patients.
            </p>
            <Button
              className="background-2 border-0 mt-3"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} className="me-1" /> New service
            </Button>
          </Card.Body>
        </Card>
      ) : (
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
          <Card.Body className="p-0">
            <Table responsive className="mb-0 color-1">
              <thead>
                <tr style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <th className="border-0 py-3 ps-4">Name</th>
                  <th className="border-0 py-3">Description</th>
                  <th className="border-0 py-3 pe-4 text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <td className="py-3 ps-4 fw-semibold">{s.name}</td>
                    <td className="py-3" style={{ fontSize: "0.9rem", color: "#6b8a9e" }}>
                      {s.description || "—"}
                    </td>
                    <td className="py-3 pe-4 text-end fw-medium">
                      ${Number(s.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
