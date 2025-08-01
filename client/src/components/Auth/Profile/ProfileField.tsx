import React from "react";

interface ProfileFieldProps {
  label: string;
  name?: string;
  value: string;
  type?: string;
  className?: string;
  editing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileField({
  label,
  name,
  value,
  type,
  className,
  editing,
  onChange,
}: ProfileFieldProps) {
  return (
    <div style={{ marginBottom: "1rem" }} className={className}>
      <strong>{label}:</strong>{" "}
      {editing ? (
        <input name={name} type={type} value={value} onChange={onChange} />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
