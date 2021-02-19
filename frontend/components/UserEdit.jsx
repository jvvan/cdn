import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  FormLabel,
} from "react-bootstrap";
import { Redirect, useRouteMatch } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function UserEdit() {
  const {
    params: { id },
  } = useRouteMatch("/admin/users/:id");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [whitelisted, setWhitelisted] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          setLoading(false);
        } else {
          setUser(data);
          setUsername(data.username);
          setWhitelisted(data.whitelisted);
          setAdmin(data.admin);
          setLoading(false);
        }
      });
  }, []);
  if (loading)
    return (
      <div id="loading">
        <ClipLoader loading={true} color={"#0dcaf0"} size={150} />
      </div>
    );
  if (!loading && !user) return <Redirect to="/admin/users" />;
  async function onClick() {
    if (loading) return;
    setLoading(true);
    const res = await fetch(`/api/users/${user._id}`, {
      method: "PATCH",
      body: JSON.stringify({ username, whitelisted, admin }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .catch(() => {});
    console.log(res);
    if (!res || res.error) {
      toast.error(res?.error || "Server Error");
      setLoading(false);
    } else {
      toast.success("Saved!");
      setLoading(false);
    }
    console.log(username, whitelisted, admin);
  }
  return (
    <Container>
      <br />
      <br />
      <h3 className="text-center">Editing: {user.username}</h3>
      <br />
      <Form
        className="text-center user-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Form.Group controlId="userForm.username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="user-form-input"
          />
        </Form.Group>
        <Form.Group controlId="userForm.whitelisted">
          <Form.Label>Whitelisted</Form.Label>
          <Form.Control
            as="select"
            placeholder="Whitelisted"
            value={whitelisted ? "Yes" : "No"}
            onChange={(e) => setWhitelisted(e.target.value === "Yes")}
            className="user-form-input"
          >
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="userForm.admin">
          <Form.Label>Admin</Form.Label>
          <Form.Control
            as="select"
            placeholder="Admin"
            value={admin ? "Yes" : "No"}
            onChange={(e) => setAdmin(e.target.value === "Yes")}
            className="user-form-input"
          >
            <option>Yes</option>
            <option>No</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={onClick}>
          Save
        </Button>
      </Form>
    </Container>
  );
}
