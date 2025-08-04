import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import ValidatedInput from "./ValidatedInput";
import { validateRegister } from "../../utils/validateAuth";
import Spinner from "../Spinner/Spinner";
import { RegisterFormData } from "../../types/auth.types";
import { toast } from "react-toastify";

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterForm() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    const validationErrors = validateRegister(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(form);
      await login({
        email: form.email,
        password: form.password,
      });
      navigate("/");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Register failed";
      toast.error(errorMessage);
      setSubmitError(errorMessage);
    }
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h2 style={{ textAlign: "center" }}>Register</h2>

      <ValidatedInput
        name="first_name"
        label="First Name"
        type="text"
        value={form.first_name}
        onChange={handleChange}
        required
        disabled={loading}
        error={errors.first_name}
      />

      <ValidatedInput
        name="last_name"
        label="Last Name"
        type="text"
        value={form.last_name}
        onChange={handleChange}
        required
        disabled={loading}
        error={errors.last_name}
      />

      <ValidatedInput
        name="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        disabled={loading}
        error={errors.email}
        autoComplete="email"
      />

      <ValidatedInput
        name="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={handleChange}
        required
        disabled={loading}
        error={errors.password}
        autoComplete="new-password"
      />

      <ValidatedInput
        name="date_of_birth"
        label="Date of birth"
        type="date"
        value={form.date_of_birth || ""}
        onChange={handleChange}
        disabled={loading}
        max={new Date().toISOString().split("T")[0]}
        error={errors.date_of_birth}
      />

      {submitError && (
        <div role="alert" style={{ color: "red", marginBottom: "0.5rem" }}>
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 2rem",
          fontSize: "1rem",
          borderRadius: "0.5rem",
          alignSelf: "center",
        }}
      >
        {loading ? <Spinner message="Registering..." /> : "Register"}
      </button>
    </form>
  );
}
