// src/components/Dashboard/RecentActivity.jsx
import {
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import { Delete, ClearAll } from "@mui/icons-material";

function formatDate(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString();
}

export default function RecentActivity({
  activity = [],
  onDeleteItem,
  onClearAll,
}) {
  const hasItems = activity && activity.length > 0;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent Activity
        </Typography>

        <Stack direction="row" spacing={1}>
          {hasItems && onClearAll && (
            <Tooltip title="Clear all activity" arrow>
              <IconButton size="small" onClick={onClearAll}>
                <ClearAll fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      {/* List content */}
      {!hasItems ? (
        <Typography variant="body2" color="text.secondary">
          No recent activity yet.
        </Typography>
      ) : (
        <List
          dense
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: 260, // adjust if you want
          }}
        >
          {activity.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                onDeleteItem && (
                  <Tooltip title="Delete this entry" arrow>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              }
            >
              <ListItemText
                primary={item.message}
                secondary={formatDate(item.createdAt)}
                primaryTypographyProps={{ variant: "body2" }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
