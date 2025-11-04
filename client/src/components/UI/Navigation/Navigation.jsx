import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../providers";
import classes from "./Navigation.module.css";

export function Navigation() {
  const auth = useAuth();
  const username = auth.user?.name;
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
              <Nav className="justify-content-end flex-grow-1 pe-3 fw-bold">
                <Nav.Link className="color-3" as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link className="color-3" as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
                {/* this link should point to profile in case user is logged in // or better have the log out option */}
                {username ? (
                  <NavDropdown
                    align="end"
                    title={`${username[0][0] + username.split(" ")[1][0]}`}
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item
                      className="text-danger"
                      onClick={() => {
                        auth.logOut();
                      }}
                    >
                      Log Out
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link className="color-4" as={Link} to="/login">
                    <CircleUserRound></CircleUserRound>
                  </Nav.Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
