import React from "react";

function ProfileField({ label, value, className }) {
  return (
    <div className={className}>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}

export default ProfileField;
