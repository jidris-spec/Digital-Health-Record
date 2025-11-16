// src/components/Dashboard/Navbar.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Breadcrumbs,
  Button,
} from "@mui/material";
import {
  Logout,
  LightMode,
  DarkMode,
  Home,
  CalendarMonth,
  Group,
  Science,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../auth.jsx";

export default function Navbar({
  isDarkMode = false,
  onToggleTheme,
  breadcrumbs = [],
}) {
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate("/", { replace: true });
  }

  // Icon based on label text
  function getCrumbIcon(label) {
    switch (label.toLowerCase()) {
      case "dashboard":
        return <Home fontSize="inherit" />;
      case "appointments":
        return <CalendarMonth fontSize="inherit" />;
      case "patients":
        return <Group fontSize="inherit" />;
      case "labs":
      case "lab results":
        return <Science fontSize="inherit" />;
      default:
        return null;
    }
  }

  // Route based on label text
  function getCrumbPath(label) {
    switch (label.toLowerCase()) {
      case "dashboard":
        return "/dashboard";
      case "appointments":
        return "/dashboard";       // appointments live on dashboard
      case "patients":
        return "/patients";
      case "add patient":
        return "/patients/new";
      default:
        return null;
    }
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
      {/* Top row: title + actions */}
      <Toolbar sx={{ py: 1.2 }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            letterSpacing: 0.6,
          }}
        >
          Digital Health Record
        </Typography>

        {/* Dark / Light toggle */}
        {onToggleTheme && (
          <Tooltip
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={onToggleTheme}
              sx={{
                mr: 1,
                transition: "0.25s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.18)",
                  transform: "scale(1.08)",
                },
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
        )}

        {/* Simple nav buttons */}
        <Box sx={{ display: "flex", gap: 1, mr: 1 }}>
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

        {/* Logout */}
        <Tooltip title="Sign out" arrow>
          <Box>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                transition: "0.25s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Logout />
            </IconButton>
          </Box>
        </Tooltip>
      </Toolbar>

      {/* Bottom row: breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Toolbar
          variant="dense"
          sx={{
            minHeight: 40,
            px: 3,
            py: 0.5,
            bgcolor: "rgba(255,255,255,0.06)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 13,
            }}
          >
            {breadcrumbs.map((label, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const icon = getCrumbIcon(label);
              const path = getCrumbPath(label);

              // 🔗 Any crumb with a path is clickable (including last)
              if (path) {
                return (
                  <Box
                    key={label + index}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                      "&:hover span": {
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() => navigate(path)}
                  >
                    {icon && (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          mr: 0.3,
                        }}
                      >
                        {icon}
                      </Box>
                    )}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 13,
                        fontWeight: isLast ? 600 : 400,
                        opacity: isLast ? 1 : 0.9,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                );
              }

              // no path → plain text
              return (
                <Box
                  key={label + index}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {icon && (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        mr: 0.3,
                      }}
                    >
                      {icon}
                    </Box>
                  )}
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: isLast ? 600 : 400,
                      opacity: isLast ? 1 : 0.8,
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Breadcrumbs>
        </Toolbar>
      )}
    </AppBar>
  );
}
