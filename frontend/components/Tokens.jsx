import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Tokens() {
  const [tokens, setTokens] = useState([]);
  async function handleDelete(id) {
    if (confirm(`Are you sure you want to delete this token?`)) {
      const res = await fetch(`/api/users/@me/tokens/${id}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        const token = await res.json();
        toast.success("Token has been deleted!");
        setTokens((state) => state.filter((t) => t._id !== token._id));
      }
    }
  }
  async function handleCreate() {
    const res = await fetch("/api/users/@me/tokens", {
      method: "POST",
    });
    if (res.status === 200) {
      toast.success("Token created!");
      const token = await res.json();
      setTokens((state) => [...state, token]);
    }
  }
  useEffect(() => {
    fetch("/api/users/@me/tokens")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setTokens([]);
          toast.error(data.error);
        } else {
          setTokens(data);
        }
      });
  }, []);

  return (
    <Container>
      <br />
      <br />
      <div className="text-right">
        <Button
          variant="primary"
          style={{ width: "5em" }}
          onClick={() => handleCreate()}
        >
          Create
        </Button>
      </div>
      <MDBDataTable
        responsive
        dark
        bordered
        tbodyTextWhite
        theadTextWhite
        noBottomColumns
        data={{
          columns: [
            { label: "ID", field: "_id" },
            {
              label: "Token",
              field: "token",
            },
            {
              label: "Last Used",
              field: "lastUsed",
              sort: "asc",
            },
            {
              label: "Actions",
              field: "actions",
            },
          ],
          rows: tokens.map((token) => ({
            ...token,
            token: <p className="blur-text">{token.token}</p>,
            lastUsed: new Date(token.lastUsed).toLocaleString(),
            actions: (
              <>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(token._id)}
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
