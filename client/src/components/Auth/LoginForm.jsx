import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import ValidatedInput from "./ValidatedInput";
import { validateLogin } from "../../utils/validateAuth";
import Spinner from "../Spinner/Spinner";

export default function LoginForm() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const newErrors = validateLogin(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(form);
    } catch (error) {
      setSubmitError(error.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit}>
      <ValidatedInput
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={(e) => handleChange(e)}
        required
        disabled={loading}
        error={errors.email}
        autoComplete="email"
      />
      <ValidatedInput
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={(e) => handleChange(e)}
        required
        disabled={loading}
        error={errors.password}
        autoComplete="current-password"
      />
      {submitError && (
        <div role="alert" style={{ color: "red", marginBottom: "0.5rem" }}>
          {submitError}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? <Spinner message="Logging in..." /> : "Login"}
      </button>{" "}
    </form>
  );
}
