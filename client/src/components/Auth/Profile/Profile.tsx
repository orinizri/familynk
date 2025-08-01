import React, { useState } from "react";
import { useAuth } from "../../../contexts/authContext";
import "./profile.css";
import ProfileField from "./ProfileField";
import Spinner from "../../Spinner/Spinner";
import { User } from "../../../types/user.types";
import api from "../../../api/api";
import { updateUserSchema } from "../../../schemas/user.schema";
import { ApiResponse } from "@client/types/auth.types";
import { ZodError } from "zod";
import EditFormIcons from "../EditFormIcons/EditFormIcons";

export default function Profile() {
  const { user, loading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<User>>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.name, e.target.value);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (): Promise<void> => {
    try {
      console.log("Saving profile with form data:", form);
      form.date_of_birth = form.date_of_birth.toString().trim();
      const validated = updateUserSchema.parse(form);
      const formToUpdate = {};

      for (const field of Object.keys(validated) as (keyof User)[]) {
        if (validated[field] && validated[field] !== user[field]) {
          if (field === "date_of_birth") {
            // Convert date_of_birth to ISO string if it's a Date object
            console.log("b4", validated[field]);
            formToUpdate[field] = new Date(validated[field]).toISOString();
            console.log("after", validated[field]);
          }
          formToUpdate[field] = validated[field] as keyof User;
        }
      }
      if (Object.keys(formToUpdate).length === 0) {
        setIsEditing(false);
        return;
      }
      const updated = await api.put<ApiResponse>("/users/me", formToUpdate);
      if (updated.data.success === false) {
        console.error("Update failed:", updated.data.message);
        // toast.error(updated.data.message);
        return;
      }
      console.log("Profile updated:", updated.data);
      updateUser(updated.data.data as User);
      setIsEditing(false);
      setForm(updated.data.data as User);
      // toast.success("Profile updated");
    } catch (err) {
      if (err instanceof ZodError) {
        console.error("Validation error:", err.issues[0].message);
      }
      // toast.error("Update failed");
    }
  };
  if (loading) return <Spinner />;

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
