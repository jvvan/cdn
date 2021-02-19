import { useStoreState } from "easy-peasy";
import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function () {
  const auth = useStoreState((state) => state.auth);
  const meta = useStoreState((state) => state.meta);
  return (
    <Navbar bg="dark" expand="lg" className="navigation">
      <Navbar.Brand>{meta.name}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/upload">
            <Nav.Link>Upload</Nav.Link>
          </LinkContainer>
          {auth.admin ? (
            <LinkContainer to="/admin/users">
              <Nav.Link>Users</Nav.Link>
            </LinkContainer>
          ) : (
            ""
          )}
          <NavDropdown
            title={auth.discord.username}
            id="nav-dropdown"
            alignRight
          >
            <LinkContainer to="/settings">
              <NavDropdown.Item>Settings</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/tokens">
              <NavDropdown.Item>API Tokens</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item href="/api/auth/logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
