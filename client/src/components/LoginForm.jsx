// src/components/LoginForm.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login, user, loading } = useAuth(); // from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password }); // context handles token logic
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (loading) return <p>Checking session...</p>;
  if (user) return <Navigate to="/" />;

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
