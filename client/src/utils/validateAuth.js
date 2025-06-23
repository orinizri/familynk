export function validateLogin(form) {
  if (!form) return {};
  const errors = {};
  if (!form?.email) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Invalid email format";

  if (!form?.password) errors.password = "Password is required";
  else if (form?.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return errors;
}

export function validateRegister(form) {
  const errors = validateLogin(form); // start with email/password rules

  if (!form?.first_name) errors.first_name = "First name is required";
  if (!form?.last_name) errors.last_name = "Last name is required";

  if (form?.date_of_birth) {
    const isValidDate = !isNaN(Date.parse(form?.date_of_birth));
    if (!isValidDate) errors.date_of_birth = "Invalid date format";
  }

  return errors;
}
