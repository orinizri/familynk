import * as React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type BaseInputProps = Omit<
  React.ComponentProps<typeof TextField>,
  "label" | "error" | "helperText" | "type"
>;

interface ValidatedInputProps extends BaseInputProps {
  label: string;
  errorText?: string; // <- explicit error message
  hint?: string; // <- subtle helper text when no error
  type?: "text" | "email" | "password";
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
}

export default function ValidatedInput({
  label,
  type = "text",
  value,
  onChange,
  errorText,
  hint,
  required,
  startAdornment,
  endAdornment,
  ...rest
}: ValidatedInputProps) {
  const [showPwd, setShowPwd] = React.useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPwd ? "text" : "password") : type;

  return (
    <Box>
      <TextField
        fullWidth
        size="medium"
        variant="outlined"
        label={label}
        value={value}
        onChange={onChange}
        type={effectiveType}
        required={required}
        error={Boolean(errorText)}
        helperText={errorText || hint}
        slotProps={{
          input: {
            startAdornment: startAdornment ? (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ) : undefined,
            endAdornment: (
              <InputAdornment position="end">
                {isPassword ? (
                  <IconButton
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    onClick={() => setShowPwd((v) => !v)}
                    edge="end"
                  >
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ) : (
                  endAdornment
                )}
              </InputAdornment>
            ),
            autoComplete:
              type === "email"
                ? "email"
                : isPassword
                  ? "current-password"
                  : "on",
            // prevent iOS auto-capitalization on emails/usernames:
            autoCapitalize: "none",
          },
        }}
        sx={{
          "& .MuiFormLabel-asterisk": { color: "error.main" },
          width: "100%",
        }}
        {...rest}
      />
      {/* Optional: additional slot for longer validation notes */}
      {errorText && (
        <FormHelperText error sx={{ mt: 0.5 }}>
          {errorText}
        </FormHelperText>
      )}
    </Box>
  );
}
