import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/authContext";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import App from "./App";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
