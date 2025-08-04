import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import ValidatedInput from "./ValidatedInput";
import { validateLogin } from "../../utils/validateAuth";
import DelayedFallback from "../Layout/DelayedFallback";
import { toast } from "react-toastify";

// ✅ Form structure and validation error types
interface LoginFormData {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof LoginFormData, string>>;

export default function LoginForm() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    const newErrors = validateLogin(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(form);
    } catch (error) {
      toast.error(
        "Login error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      console.error("Login error:", error);
      setSubmitError("Login failed");
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
      <ValidatedInput
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
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
        onChange={handleChange}
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
        {loading ? <DelayedFallback message="Logging in..." /> : "Login"}
      </button>
    </form>
  );
}
