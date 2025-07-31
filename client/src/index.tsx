import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/authContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
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
