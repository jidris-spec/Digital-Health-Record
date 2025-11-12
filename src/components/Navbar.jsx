import { AppBar, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate("/", { replace: true });
  }

  return (
    <AppBar position="sticky" elevation={2} sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Welcome To Digital Health Record
        </Typography>

        <Tooltip title="Sign out" arrow>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
