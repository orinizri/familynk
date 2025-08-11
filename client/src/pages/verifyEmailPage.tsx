// src/pages/Auth/VerifyEmailPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ResultCard } from "../components/Feedback/ResultCard";
import { useAuth } from "../contexts/authContext";
import { apiStatus } from "../constants/apiStatus";
import { apiStatusFieldType } from "../types/api.types";

type State = {
  kind: apiStatusFieldType;
  message?: string;
};

export default function VerifyEmailPage() {
  const [search] = useSearchParams();
  const token = search.get("token") ?? "";
  const [state, setState] = useState<State>({ kind: apiStatus.IDLE });
  const navigate = useNavigate();
  const { verifyEmail, user } = useAuth();
  
  
  useEffect(() => {
    if (!token) {
      setState({
        kind: apiStatus.ERROR,
        message: "Missing verification token.",
      });
      return;
    }

    const ac = new AbortController();
    void (async () => {
      try {
        setState({ kind: apiStatus.LOADING });
        const { success, data, error } = await verifyEmail(token, ac.signal);
        console.log("verify email page", success, data, error);
        if (success) {
          setState({ kind: apiStatus.SUCCESS, message: data });
        } else {
          // Map server statuses to friendly messages
          setState({ kind: apiStatus.ERROR, message: error });
        }
      } catch (error) {
        console.error("!@#", error);
        setState({
          kind: apiStatus.ERROR,
          message: "Network error. Please try again.",
        });
      }
    })();

    // return () => ac.abort();
  }, [token, verifyEmail]);

  // Actions shared across states
  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");
  const goResend = () => navigate("/resend-verification"); // if you add this route

  return (
    <Box
      sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", px: 2 }}
    >
      {state.kind === apiStatus.LOADING && (
        <ResultCard title="Verifying your email…" subtitle="One moment please">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Checking the link and updating your account.
          </Typography>
        </ResultCard>
      )}

      {state.kind === apiStatus.SUCCESS && (
        <ResultCard
          title="Your email is verified!"
          subtitle="You can now sign in."
          action={
            <>
              <Button variant="contained" onClick={goLogin}>
                Go to Login
              </Button>
              <Button variant="text" onClick={goHome}>
                Back to Home
              </Button>
            </>
          }
        >
          <CheckCircleOutlineIcon fontSize="large" color="success" />
          <Typography variant="body2" color="text.secondary">
            {state.message}
          </Typography>
        </ResultCard>
      )}

      {state.kind === apiStatus.ERROR && (
        <ResultCard
          title="Verification problem"
          subtitle="We couldn’t verify your email"
          action={
            <>
              <Button variant="contained" onClick={goResend}>
                Resend verification
              </Button>
              <Button variant="text" onClick={goHome}>
                Back to Home
              </Button>
            </>
          }
        >
          <ErrorOutlineIcon fontSize="large" color="error" />
          <Alert severity="error" sx={{ width: "100%", maxWidth: 420 }}>
            {state.message}
          </Alert>
          <Typography variant="caption" color="text.secondary">
            If the problem persists, contact support.
          </Typography>
        </ResultCard>
      )}
    </Box>
  );
}
