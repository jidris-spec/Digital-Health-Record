// src/components/KpiCard.jsx
import { useEffect, useState } from "react";
import { Paper, Stack, Box, Typography, Tooltip, Zoom } from "@mui/material";

export default function KpiCard({
  icon,
  label,
  value,
  tooltip,
  trend = 0,            // e.g. +3, -2, 0
  color = "primary",
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // --- Count-up animation for the KPI value ---
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;

    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 700; // ms
    const stepTime = 16;  // ~60fps
    const increment = end / (duration / stepTime);

    const step = () => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(start));
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  // --- Trend display (▲ / ▼ / •) ---
  const trendColor =
    trend > 0 ? "#16a34a" : trend < 0 ? "#dc2626" : "#6b7280";
  const trendSymbol = trend > 0 ? "▲" : trend < 0 ? "▼" : "•";

  return (
    <Tooltip title={tooltip} TransitionComponent={Zoom} arrow>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
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

            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {displayValue}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: trendColor, fontWeight: 600 }}
              >
                {trendSymbol} {Math.abs(trend)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Tooltip>
  );
}
