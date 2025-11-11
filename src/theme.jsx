// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // we'll add a toggle later
    primary: { main: "#2563eb" },
    secondary: { main: "#0ea5e9" },
    success: { main: "#10b981" },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: ['"Inter"', "Segoe UI", "Roboto", "Arial", "sans-serif"].join(","),
  },
});

export default theme;
