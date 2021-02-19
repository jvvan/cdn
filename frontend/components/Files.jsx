import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import prettyBytes from "../utils/prettyBytes";

export default function Files({ endpoint = "/api/files" }) {
  const [files, setFiles] = useState([]);
  async function handleDelete(id, name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
      if (res.status === 200) {
        const file = await res.json();
        setFiles((state) => state.filter((f) => f._id !== file._id));
        toast.success(`${name} has been deleted!`);
      } else {
        const json = await res.json();
        if (json.error) toast.error(json.error);
      }
    }
  }
  useEffect(() => {
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setFiles([]);
          toast.error(data.error);
        } else setFiles(data);
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
        data={{
          columns: [
            {
              label: "ID",
              field: "_id",
              sort: "asc",
            },
            {
              label: "File Name",
              field: "name",
            },
            {
              label: "Size",
              field: "size",
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
          rows: files.map((file) => ({
            ...file,
            name: <a href={`/files/${file._id}.${file.type}`}>{file.name}</a>,
            createdAt: new Date(file.createdAt).toLocaleString(),
            size: prettyBytes(file.size),
            actions: (
              <>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(file._id, file.name)}
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
