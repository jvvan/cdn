import React, { useState } from "react";
import { FormControl, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  function onClick() {
    if (progress > 0) return;
    let file = document.getElementById("file").files[0];
    if (!file) return toast.error("You must select a file!");
    let xhr = new XMLHttpRequest();
    xhr.open("post", "/api/files/upload", true);
    let data = new FormData();
    data.append("file", file);
    xhr.upload.onprogress = (e) => {
      setProgress(e.loaded / e.total);
    };
    xhr.addEventListener("load", (evt) => {
      if (evt.target.status === 200) {
        setError(null);
        setFile(JSON.parse(evt.target.response));
        setProgress(0);
      } else {
        setFile(null);
        setError(JSON.parse(evt.target.response).error);
        setProgress(0);
      }
    });
    xhr.send(data);
  }
  return (
    <div className="container">
      <br />
      <h3 className="text-center">Upload</h3>
      <br />
      <br />
      <form className="text-center upload-form">
        {error ? <Alert variant="danger">{error}</Alert> : ""}
        {file ? (
          <Alert variant="success">
            File has been successfully uploaded!
            <br />
            <a href={`/files/${file._id}.${file.type}`}>{file.name}</a>
          </Alert>
        ) : (
          ""
        )}
        <FormControl
          type="file"
          name="file"
          id="file"
          placeholder="File"
          required
        ></FormControl>
        <progress id="upload-progress" value={progress}></progress>
        <Button variant="info" className="btn-block my-4" onClick={onClick}>
          Upload
        </Button>
      </form>
    </div>
  );
}
