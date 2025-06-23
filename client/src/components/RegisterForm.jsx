import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import ValidatedInput from "./ValidatedInput";
import { validateRegister } from "../utils/validateAuth";

export default function RegisterForm() {
  const { login, register, loading } = useAuth(); // Will use this after registration
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    date_of_birth: "", // optional
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    try {
      // Validate form fields
      e.preventDefault();
      const errors = validateRegister(form);
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }
      await register(form);
      await login({
        email: form.email,
        password: form.password,
        date_of_birth: form.date_of_birth,
      });
      navigate("/");
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <ValidatedInput
        name="first_name"
        label="First Name"
        type="text"
        value={form.first_name || ""}
        onChange={(e) => handleChange(e)}
        required
        disabled={loading}
      />
      <ValidatedInput
        name="last_name"
        label="Last Name"
        type="text"
        value={form.last_name || ""}
        onChange={(e) => handleChange(e)}
        required
        disabled={loading}
      />
      <ValidatedInput
        name="email"
        label="Email"
        type="email"
        value={form.email || ""}
        onChange={(e) => handleChange(e, "email")}
        required
        disabled={loading}
      />
      <ValidatedInput
        name="password"
        label="Password"
        type="password"
        value={form.password || ""}
        onChange={(e) => handleChange(e)}
        required
        disabled={loading}
      />
      <ValidatedInput
        name="date_of_birth"
        label="Date of birth"
        type="date"
        value={form.date_of_birth || ""}
        onChange={(e) => handleChange(e)}
        disabled={loading}
        max={new Date().toISOString().split("T")[0]} // Prevent future dates
      />
      {errors && (
        <p style={{ color: "red" }}>{Object.values(errors).join(", ")}</p>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Register"}
      </button>{" "}
    </form>
  );
}
