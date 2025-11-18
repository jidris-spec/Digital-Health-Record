// src/components/RecordCard.jsx
import { Paper, Typography, Box, Tooltip, Button } from "@mui/material";

export default function RecordCard({
  icon,
  title,
  description,
  date,
  onClick,
  color = "primary",
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        cursor: onClick ? "pointer" : "default",
        borderLeft: (t) => `4px solid ${t.palette[color].main}`,
        transition: "all 0.2s ease",
        "&:hover": {
          transform: onClick ? "translateY(-3px)" : "none",
          boxShadow: onClick ? 6 : 3,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon && <Box sx={{ mr: 1.2 }}>{icon}</Box>}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {date && (
            <Typography variant="caption" color="text.secondary">
              {date}
            </Typography>
          )}
        </Box>
      </Box>

      <Tooltip title={description} arrow>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1,
          }}
        >
          {description}
        </Typography>
      </Tooltip>

      {onClick && (
        <Button
          size="small"
          variant="text"
          color={color}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          View details →
        </Button>
      )}
    </Paper>
  );
}
