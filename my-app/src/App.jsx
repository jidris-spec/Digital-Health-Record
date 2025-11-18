// src/App.jsx
import { useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import getAppTheme from "./theme.jsx";

// 🔹 Adjust these imports if your files are elsewhere
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddPatient from "./pages/AddPatient.jsx";
import PatientsList from "./pages/PatientsList.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App() {
  // "light" / "dark" string mode
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem("themeMode");
    return stored === "dark" ? "dark" : "light";
  });

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", next);
      return next;
    });
  };

  const isDarkMode = mode === "dark";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            }
          />

          <Route
            path="/patients"
            element={
              <PatientsList
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            }
          />

          <Route
            path="/patients/add"
            element={
              <AddPatient
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            }
          />

          <Route
            path="/patients/:id"
            element={
              <PatientProfile
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
              />
            }
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
