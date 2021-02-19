import { useStoreActions } from "easy-peasy";
import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import prettyBytes from "../utils/prettyBytes";

export default function Users() {
  const [users, setUsers] = useState([]);
  async function handleDelete(id, name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.status === 200) {
        const user = await res.json();
        setUsers((state) => state.filter((u) => u._id !== user._id));
      }
    }
  }
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setUsers([]);
          toast.error(data.error);
        } else setUsers(data);
      });
  }, []);

  return (
    <Container>
      <br />
      <br />
      <MDBDataTable
        responsive
        dark
        bordered
        tbodyTextWhite
        theadTextWhite
        noBottomColumns
        key="id"
        data={{
          columns: [
            { label: "Discord ID", field: "id" },
            {
              label: "Username",
              field: "username",
            },
            { label: "Whitelisted", field: "whitelisted" },
            { label: "Admin", field: "admin" },
            {
              label: "Used Storage",
              field: "usedStorage",
              sort: "asc",
            },
            {
              label: "Date",
              field: "createdAt",
              sort: "asc",
            },
            {
              label: "Actions",
              field: "actions",
            },
          ],
          rows: users.map((user) => ({
            ...user,
            createdAt: new Date(user.createdAt).toLocaleString(),
            usedStorage: prettyBytes(user.usedStorage),
            whitelisted: user.whitelisted ? "Yes" : "No",
            admin: user.admin ? "Yes" : "No",
            actions: (
              <>
                <LinkContainer to={`/admin/users/${user._id}`}>
                  <Button variant="info">Edit</Button>
                </LinkContainer>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(user._id, user.username)}
                >
                  Delete
                </Button>
              </>
            ),
          })),
        }}
      />
    </Container>
  );
}
