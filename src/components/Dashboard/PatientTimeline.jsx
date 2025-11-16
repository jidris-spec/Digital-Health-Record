// src/components/Dashboard/PatientTimeline.jsx
import {
  Paper,
  Typography,
  Alert,
  Box,
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";

import { Event, Science } from "@mui/icons-material";

export default function PatientTimeline({ events = [] }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Patient Timeline
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Chronological view of this patient’s appointments and lab activity.
      </Typography>

      {events.length === 0 ? (
        <Alert severity="info">
          No history yet for this patient. Appointments and lab results will
          appear here in time order.
        </Alert>
      ) : (
        <Timeline
          position="right"
          sx={{
            mt: 0,
            [`& .MuiTimelineItem-root:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {events.map((event, index) => {
            const isLast = index === events.length - 1;
            const isLab = event.type === "lab";

            return (
              <TimelineItem key={event.id}>
                {/* Left side: date */}
                <TimelineOppositeContent
                  sx={{ m: "auto 0", minWidth: 90 }}
                  variant="body2"
                  color="text.secondary"
                >
                  {event.dateLabel}
                </TimelineOppositeContent>

                {/* Center: vertical line + dot */}
                <TimelineSeparator>
                  <TimelineDot
                    color={isLab ? "secondary" : "primary"}
                    sx={{
                      boxShadow: "0 0 0 3px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isLab ? (
                      <Science sx={{ fontSize: 16 }} />
                    ) : (
                      <Event sx={{ fontSize: 16 }} />
                    )}
                  </TimelineDot>
                  {!isLast && <TimelineConnector />}
                </TimelineSeparator>

                {/* Right side: event card */}
                <TimelineContent sx={{ py: 1.5, px: 2 }}>
                  <Box
                    sx={{
                      p: 1.3,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, mb: 0.3 }}
                    >
                      {isLab ? "Lab result" : "Appointment"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      )}
    </Paper>
  );
}
