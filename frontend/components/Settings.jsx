import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Settings() {
  const auth = useStoreState((state) => state.auth);
  const setAuth = useStoreActions((actions) => actions.setAuth);
  const [username, setUsername] = useState(auth?.username);
  const [loading, setLoading] = useState(false);
  if (loading)
    return (
      <div id="loading">
        <ClipLoader loading={true} color={"#0dcaf0"} size={150} />
      </div>
    );
  async function onClick() {
    if (loading) return;
    setLoading(true);
    const res = await fetch(`/api/users/@me`, {
      method: "PATCH",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .catch(() => {});
    if (!res || res.error) {
      toast.error(res?.error || "Server Error");
      setLoading(false);
    } else {
      toast.success("Saved!");
      const state = { ...auth, username };
      setAuth(state);
      setLoading(false);
    }
  }
  return (
    <Container>
      <br />
      <br />
      <h3 className="text-center">Settings</h3>
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
        <Button variant="primary" onClick={onClick}>
          Save
        </Button>
      </Form>
    </Container>
  );
}
