import React from "react";
import { useAuth } from "../../../contexts/authContext";
import "./profile.css";
import ProfileField from "./ProfileField";

export default function Profile() {
  const { user, loading } = useAuth();
  console.log("User data in Profile component:", user);
  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <ProfileField
        label="First Name"
        value={user.first_name || "-"}
        className="profile-field"
      />

      <ProfileField
        label="Last Name"
        value={user.last_name || "-"}
        className="profile-field"
      />

      <ProfileField
        label="Email"
        value={user.email || "-"}
        className="profile-field"
      />

      <ProfileField
        label="Date of Birth"
        value={
          user.date_of_birth && typeof user.date_of_birth === "string"
            ? new Date(user.date_of_birth).toLocaleDateString()
            : "-"
        }
        className="profile-field"
      />

      {user.role === "admin" && (
        <ProfileField
          className="profile-field"
          label="Role"
          value={(user.role as string) || "-"}
        />
      )}
    </div>
  );
}
