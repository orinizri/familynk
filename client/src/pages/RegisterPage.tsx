import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div
      style={{
        height: "90dvh",
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RegisterForm />
    </div>
  );
}
