import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import ValidatedInput from "./ValidatedInput";
import { validateLogin } from "../utils/validateAuth";

export default function LoginForm() {
  const { login, user, loading } = useAuth(); // from context
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e, field) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const newErrors = validateLogin();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(form);
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  if (loading) return <p>Checking session...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <ValidatedInput
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => handleChange(e, "email")}
        required
        disabled={loading}
        error={errors.email}
      />
      <ValidatedInput
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => handleChange(e, "password")}
        required
        disabled={loading}
        error={errors.password}
      />
      {submitError && (
        <div role="alert" style={{ color: "red", marginBottom: "0.5rem" }}>
          {submitError}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>{" "}
    </form>
  );
}
