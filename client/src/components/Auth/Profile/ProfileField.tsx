import React from "react";

interface ProfileFieldProps {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
}

export default function ProfileField({
  label,
  value,
  className,
}: ProfileFieldProps) {
  return (
    <div className={className}>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}