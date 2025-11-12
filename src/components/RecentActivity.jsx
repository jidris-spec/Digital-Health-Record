// src/components/RecentActivity.jsx
import {
  Paper, Stack, Typography, Skeleton, Alert, List, ListItem,
  ListItemText, Divider, Box, Button
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export default function RecentActivity({ loading, activity, onMarkReviewed }) {
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
          Nothing here yet. Actions you take will appear as an activity log.
        </Alert>
      ) : (
        <List dense>
          {activity.map((item, idx) => (
            <Box key={item.id}>
              <ListItem
                secondaryAction={
                  item.type === "lab" ? (
                    <Button
                      variant="text"
                      color="success"
                      size="small"
                      onClick={() => onMarkReviewed?.(item.id)}
                    >
                      Mark reviewed
                    </Button>
                  ) : null
                }
              >
                <ListItemText
                  primary={item.text}
                  secondary={
                    item.type === "lab" ? "Lab update" :
                    item.type === "warn" ? "System" :
                    "Appointment"
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
