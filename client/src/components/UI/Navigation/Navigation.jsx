import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";

import classes from "./Navigation.module.css";

export function Navigation() {
  return (
    <>
      <Navbar
        key={"lg"}
        expand={"lg"}
        className={`background-2 mb-3 shadow-bottom ${classes.test}`}
      >
        <Container fluid>
          <Navbar.Brand className="color-3 fs-1 fw-bold" as={Link} to="/">
            HealthCheck
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
            className={"border-0"}
          >
            <Offcanvas.Header
              closeButton
              className="background-2 shadow-bottom"
            >
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-lg`}
                className={`color-3 fw-bold fs-2`}
              >
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {/* <Form className="d-flex ">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form> */}
              <Nav className="justify-content-end flex-grow-1 pe-3 fw-bold">
                <Nav.Link className="color-3" as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link className="color-3" as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
                <Nav.Link className="color-4" as={Link} to="/login">
                  <CircleUserRound></CircleUserRound>
                </Nav.Link>

                {/* <NavDropdown
                  title="Dropdown"
                  id={`offcanvasNavbarDropdown-expand-lg`}
                >
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">
                    Something else here
                  </NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
