// src/components/Dashboard/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Button,
} from "@mui/material";
import { Logout, LightMode, DarkMode } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../auth.jsx";

export default function Navbar({ isDarkMode = false, onToggleTheme }) {
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate("/", { replace: true });
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
        boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Toolbar sx={{ py: 1.2 }}>
        {/* Clickable title: go to /dashboard */}
        <Box
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Digital Health Record
          </Typography>
        </Box>

        {/* Simple nav buttons */}
        <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate("/patients")}
          >
            Patients
          </Button>
        </Box>

        {/* Theme toggle */}
        {onToggleTheme && (
          <Tooltip
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            arrow
          >
            <IconButton color="inherit" onClick={onToggleTheme}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        )}

        {/* Logout */}
        <Tooltip title="Sign out" arrow>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
