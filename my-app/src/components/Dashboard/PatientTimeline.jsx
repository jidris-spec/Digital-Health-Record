// src/components/Dashboard/PatientTimeline.jsx
import { Paper, Typography, Stack, Box, Chip } from "@mui/material";
import { Event, Science, Notes } from "@mui/icons-material";

function typeMeta(type) {
  const t = (type || "").toLowerCase();

  if (t === "appt" || t === "appointment") {
    return {
      label: "Appointment",
      color: "primary",
      icon: <Event fontSize="small" />,
    };
  }

  if (t === "lab") {
    return {
      label: "Lab result",
      color: "secondary",
      icon: <Science fontSize="small" />,
    };
  }

  return {
    label: "Note",
    color: "default",
    icon: <Notes fontSize="small" />,
  };
}

// events: [{ id, type, date: Date, dateLabel, title, description }]
export default function PatientTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No history recorded for this patient yet. As you add appointments and
          lab results, they will appear here in chronological order.
        </Typography>
      </Paper>
    );
  }

  // Group by calendar day
  const groups = events.reduce((acc, ev) => {
    const d = ev.date instanceof Date ? ev.date : new Date(ev.date);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    const label = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (!acc[key]) {
      acc[key] = { label, items: [] };
    }
    acc[key].items.push(ev);
    return acc;
  }, {});

  const orderedKeys = Object.keys(groups).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Timeline
      </Typography>

      <Box
        sx={{
          position: "relative",
          ml: { xs: 1, sm: 2 },
          pl: { xs: 2, sm: 3 },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 10,
            top: 4,
            bottom: 0,
            width: 2,
            bgcolor: "divider",
          },
        }}
      >
        <Stack spacing={3}>
          {orderedKeys.map((key) => {
            const group = groups[key];

            return (
              <Box key={key}>
                {/* Date header */}
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    {group.label}
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  {group.items.map((ev) => {
                    const meta = typeMeta(ev.type);

                    return (
                      <Stack
                        key={ev.id}
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        {/* Dot */}
                        <Box
                          sx={{
                            mt: 1,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: "2px solid",
                            borderColor: `${meta.color}.main`,
                            bgcolor: "background.paper",
                            boxShadow: 1,
                            flexShrink: 0,
                          }}
                        />

                        {/* Card */}
                        <Paper
                          elevation={1}
                          sx={{
                            flex: 1,
                            p: 1.5,
                            borderRadius: 2,
                            borderLeft: 3,
                            borderLeftColor: `${meta.color}.main`,
                            bgcolor: "background.default",
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 0.5 }}
                          >
                            <Chip
                              size="small"
                              icon={meta.icon}
                              label={meta.label}
                              color={meta.color}
                              variant="outlined"
                            />
                            {ev.dateLabel && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {ev.dateLabel}
                              </Typography>
                            )}
                          </Stack>

                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {ev.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.3 }}
                          >
                            {ev.description}
                          </Typography>
                        </Paper>
                      </Stack>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Paper>
  );
}
