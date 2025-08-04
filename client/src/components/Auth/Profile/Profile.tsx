import React, { useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import "./profile.css";
import ProfileField from "./ProfileField";
import { User } from "../../../types/user.types";
import { api } from "../../../api/api";
import { updateUserSchema } from "../../../schemas/user.schema";
import { ApiResponse } from "@client/types/auth.types";
import { ZodError } from "zod";
import EditFormIcons from "../EditFormIcons/EditFormIcons";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<User>>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (): Promise<void> => {
    try {
      form.date_of_birth = form.date_of_birth.toString().trim();
      const validated = updateUserSchema.parse(form);
      const formToUpdate = {};

      for (const field of Object.keys(validated) as (keyof User)[]) {
        if (validated[field] && validated[field] !== user[field]) {
          if (field === "date_of_birth") {
            // Convert date_of_birth to ISO string if it's a Date object
            formToUpdate[field] = new Date(validated[field]).toISOString();
          }
          formToUpdate[field] = validated[field] as keyof User;
        }
      }
      if (Object.keys(formToUpdate).length === 0) {
        setIsEditing(false);
        return;
      }
      const updated = await api.put("/users/me", formToUpdate);
      if (!updated.data) {
        toast.error("No response from server");
        return;
      }
      const { data } = updated as AxiosResponse<ApiResponse>;
      if (data.success === false) {
        console.error("Update failed:", data.message);
        toast.error(data.message);
        return;
      }
      updateUser(data.data as User);
      setIsEditing(false);
      setForm(data.data as User);
      // toast.success("Profile updated");
    } catch (err) {
      if (err instanceof ZodError) {
        toast.error("Validation error: " + err.issues[0].message);
      }
      // toast.error("Update failed");
    }
  };

  return (
    <>
      <EditFormIcons
        onSave={() => void handleSave()}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
      />
      <div className="profile-container">
        <h2>User Profile</h2>
        <ProfileField
          editing={isEditing}
          label="First Name"
          value={form.first_name || ""}
          className="profile-field"
          name="first_name"
          onChange={handleChange}
        />

        <ProfileField
          editing={isEditing}
          label="Last Name"
          value={form.last_name || ""}
          className="profile-field"
          name="last_name"
          onChange={handleChange}
        />

        <ProfileField
          editing={isEditing}
          label="Email"
          value={form.email || ""}
          className="profile-field"
          name="email"
          onChange={handleChange}
        />

        <ProfileField
          editing={isEditing}
          label="Date of Birth"
          value={
            form.date_of_birth && typeof form.date_of_birth === "string"
              ? new Date(form.date_of_birth).toLocaleDateString()
              : ""
          }
          className="profile-field"
          name="date_of_birth"
          onChange={handleChange}
        />

        {user.role === "admin" && (
          <ProfileField
            className="profile-field"
            label="Role"
            value={(user.role as string) || ""}
          />
        )}
      </div>
    </>
  );
}
