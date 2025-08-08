import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import ValidatedInput from "./ValidatedInput";
import { validateRegister } from "../../utils/validateAuth";
import { RegisterFormData } from "../../types/auth.types";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Link as RouterLink } from "react-router-dom";
import { Button, Alert, Link } from "@mui/material";
import { AuthLayout } from "./AuthLayout";

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

  const handleDateChange = (date: Dayjs | null) => {
    setForm((prev) => ({
      ...prev,
      date_of_birth: date ? date.toISOString() : "",
    }));
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
      await login({ email: form.email, password: form.password });
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
    <form onSubmit={(e) => void handleSubmit(e)} autoComplete="on">
      <AuthLayout
        title="Create your account"
        footer={
          <>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Log in
            </Link>
          </>
        }
      >
        <ValidatedInput
          name="first_name"
          label="First Name"
          type="text"
          value={form.first_name}
          onChange={handleChange}
          required
          disabled={loading}
          errorText={errors.first_name}
        />
        <ValidatedInput
          name="last_name"
          label="Last Name"
          type="text"
          value={form.last_name}
          onChange={handleChange}
          required
          disabled={loading}
          errorText={errors.last_name}
        />
        <ValidatedInput
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
          errorText={errors.email}
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
          errorText={errors.password}
          autoComplete="new-password"
        />
        <DatePicker
          label="Date of birth"
          value={form.date_of_birth ? dayjs(form.date_of_birth) : null}
          onChange={handleDateChange}
          disabled={loading}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: Boolean(errors.date_of_birth),
              helperText: errors.date_of_birth || " ",
            },
          }}
        />
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? "Registering…" : "Register"}
        </Button>
      </AuthLayout>
    </form>
  );
}
