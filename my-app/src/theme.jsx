// src/theme.jsx
import { createTheme } from "@mui/material/styles";

export default function getAppTheme(mode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#7c3aed",
      },
      success: {
        main: "#16a34a",
      },
      error: {
        main: "#dc2626",
      },
      ...(isDark && {
        background: {
          default: "#020617", // slate-950 style
          paper: "#020617",
        },
      }),
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });
}
