import React from "react";
import LoginForm from "../components/Auth/LoginForm";

export default function LoginPage() {
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
      <LoginForm />
    </div>
  );
}
