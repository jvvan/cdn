import { faTimes as Times } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container } from "react-bootstrap";

export default function AccessDenied({ text, title }) {
  return (
    <Container>
      <br />
      <br />
      <h2 className="text-center">
        {title ?? <FontAwesomeIcon icon={Times} size="5x" />}
        <br />
        <br />
        {text ?? "Access Denied!"}
      </h2>
    </Container>
  );
}
