// src/components/KpiCard.jsx
import { Paper, Stack, Box, Typography, Tooltip, Zoom } from "@mui/material";

export default function KpiCard({ icon, label, value,Grid, tooltip, color = "primary" }) {
  return (
    <Tooltip title={tooltip} TransitionComponent={Zoom} arrow>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: (t) => t.palette[color].light,
              color: (t) => t.palette[color].contrastText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Tooltip>
  );
}
