import React from "react";

export default function ValidatedInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  hint,
  required,
  ...rest
}) {
  return (
    <div style={{ marginBottom: "1rem", display: "flex" }}>
      <label style={{ display: "block", width: "100%" }}>
        {label}
        {required && " *"}
      </label>

      {hint && (
        <small
          style={{ display: "block", color: "#666", marginBottom: "0.25rem" }}
        >
          {hint}
        </small>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        {...rest}
        style={{
          width: "100%",
          padding: "0.5rem 2rem",
          borderRadius: "0.5rem",
          border: error ? "1px solid red" : "1px solid #ccc",
        }}
      />

      {error && (
        <div
          style={{ color: "red", fontSize: "0.85rem", marginTop: "0.25rem" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
