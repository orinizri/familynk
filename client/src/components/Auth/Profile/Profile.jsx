import React from "react";
import { useAuth } from "../../../contexts/authContext";
import "./profile.css";

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="profile-field">
        <strong>First Name:</strong>
        <span>{user.first_name || "-"}</span>
      </div>

      <div className="profile-field">
        <strong>Last Name:</strong>
        <span>{user.last_name || "-"}</span>
      </div>

      <div className="profile-field">
        <strong>Email:</strong>
        <span>{user.email}</span>
      </div>

      <div className="profile-field">
        <strong>Date of Birth:</strong>
        <span>
          {user.date_of_birth
            ? new Date(user.date_of_birth).toLocaleDateString()
            : "-"}
        </span>
      </div>
      {user.role === "admin" && (
        <>
          <div className="profile-field">
            <strong>Role:</strong>
            <span>{user.role}</span>
          </div>
        </>
      )}
    </div>
  );
}
