// src/components/RecordCard.jsx
import { Paper, Typography } from "@mui/material";

export default function RecordCard({ title, description }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
}
