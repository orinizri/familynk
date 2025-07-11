import React from "react";
import "./spinner.css";

export default function Spinner({ message = "Loading..." }) {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
