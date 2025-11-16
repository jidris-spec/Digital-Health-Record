// src/components/RecentActivity.jsx
import {
  Paper, Stack, Typography, Skeleton, Alert, List, ListItem,
  ListItemText, Divider, Box, Button, Tooltip
} from "@mui/material";
import {
  InfoOutlined,
  Science,
  WarningAmber,
  Event,
  CheckCircle,
} from "@mui/icons-material";

export default function RecentActivity({ loading, activity, onMarkReviewed }) {
  function typeIcon(type) {
    const map = {
      lab: <Science fontSize="small" color="primary" />,
      warn: <WarningAmber fontSize="small" color="warning" />,
      appt: <Event fontSize="small" color="success" />,
    };
    return map[type] || <Event fontSize="small" />;
  }

  function typeLabel(type) {
    if (type === "lab") return "Lab update";
    if (type === "warn") return "System alert";
    return "Appointment";
  }

  function timestamp(item) {
    const date = new Date(item.id.slice(0, 8));
    // fallback: show current time
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Recent Activity
        </Typography>
      </Stack>

      {loading ? (
        <>
          <Skeleton height={24} />
          <Skeleton height={24} />
        </>
      ) : activity.length === 0 ? (
        <Alert severity="info" icon={<InfoOutlined />}>
          Nothing here yet. All actions you take will show up as activity.
        </Alert>
      ) : (
        <List dense>
          {activity.map((item, idx) => (
            <Box key={item.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  item.type === "lab" ? (
                    <Tooltip title="Mark this lab as reviewed and clear it." arrow>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => onMarkReviewed?.(item.id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                        Reviewed
                      </Button>
                    </Tooltip>
                  ) : null
                }
                sx={{
                  py: 1,
                  px: 0.5,
                  borderRadius: 2,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: "rgba(67, 56, 202, 0.08)",
                  },
                }}
              >
                {/* Icon */}
                <Box sx={{ pr: 1, pt: 0.4 }}>{typeIcon(item.type)}</Box>

                {/* Main text */}
                <ListItemText
                  primary={
                    <Tooltip title={item.text} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 250,
                          fontWeight: 500,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Tooltip>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary">
                        {typeLabel(item.type)} • {timestamp(item)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>

              {idx < activity.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
}
