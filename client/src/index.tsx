// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePickerProps, LocalizationProvider, MuiPickersAdapter } from "@mui/x-date-pickers";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/authContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { ToastContainer } from "react-toastify";

import type {} from "@mui/x-date-pickers/themeAugmentation";

const theme = createTheme({
  components: {
    MuiDatePicker: {
      defaultProps: {
        displayWeekNumber: true,
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f0f0f0",
        },
      },
    },
  },
});
const adapter = AdapterDayjs as new (
  ...args: DatePickerProps[]
) => MuiPickersAdapter<unknown>;

const rootElement = document.getElementById("root")!;
if (!rootElement) throw new Error("Root element not found");
const root = ReactDOM.createRoot(rootElement);
root.render(
  (<React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <LocalizationProvider dateAdapter={adapter}>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>) as ReactNode
);
