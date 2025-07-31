import { LoginFormData, RegisterFormData } from "shared/types/auth/auth.types";

interface ErrorsType {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export function validateLogin(form: LoginFormData) {
  if (!form) return {};
  const errors: ErrorsType = {};
  if (!form?.email) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Invalid email format";

  if (!form?.password || typeof form.password !== "string")
    errors.password = "Password is required";
  else if (form?.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return errors;
}

export function validateRegister(form: RegisterFormData) {
  const errors = validateLogin(form); // start with email/password rules

  if (!form?.first_name) errors.first_name = "First name is required";
  if (!form?.last_name) errors.last_name = "Last name is required";

  if (form?.date_of_birth && typeof form?.date_of_birth === "string") {
    const isValidDate = !isNaN(Date.parse(form?.date_of_birth));
    if (!isValidDate) errors.date_of_birth = "Invalid date format";
  }

  return errors;
}
