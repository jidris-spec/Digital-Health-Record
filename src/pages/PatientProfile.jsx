// src/pages/PatientProfile.jsx

import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Stack,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import Navbar from "../components/Dashboard/Navbar.jsx";
import PatientTimeline from "../components/Dashboard/PatientTimeline.jsx";
import {
  loadPatients,
  loadAppts,
  loadActivity,
} from "../utils/storage.jsx";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const patients = loadPatients();
  const appointments = loadAppts();
  const activity = loadActivity();

  const patient = patients.find((p) => p.id === id) || null;

  // All this patient's appointments
  const patientAppointments = useMemo(() => {
    if (!patient) return [];
    return appointments.filter((a) => a.patient === patient.fullName);
  }, [appointments, patient]);

  // All this patient's lab events
  const patientLabs = useMemo(() => {
    if (!patient) return [];
    const name = (patient.fullName || "").toLowerCase();

    return activity.filter((item) => {
      if (item.type !== "lab") return false;

      const text = (item.text || "").toLowerCase();
      const storedName = (item.patientName || "").toLowerCase();

      // Prefer strict id match
      if (item.patientId && item.patientId === patient.id) return true;

      // Fallback for older data
      return storedName === name || text.includes(name);
    });
  }, [activity, patient]);

  // Unified timeline events (appointments + labs)
  const timelineEvents = useMemo(() => {
    if (!patient) return [];

    const parseDate = (raw) => {
      if (!raw) return null;
      // Appointments stored like "2025-11-10 10:30"
      if (typeof raw === "string" && raw.includes(" ")) {
        return new Date(raw.replace(" ", "T"));
      }
      // Labs createdAt is ISO
      return new Date(raw);
    };

    const apptEvents = patientAppointments
      .map((appt) => {
        const d = parseDate(appt.date);
        if (!d || isNaN(d.getTime())) return null;
        return {
          id: `appt-${appt.id}`,
          type: "appt",
          date: d,
          dateLabel: appt.date,
          title: "Appointment",
          description: appt.reason
            ? `${appt.reason} (${appt.status || "Scheduled"})`
            : appt.status || "Scheduled appointment",
        };
      })
      .filter(Boolean);

    const labEvents = patientLabs
      .map((lab) => {
        const d = parseDate(lab.createdAt || lab.date);
        if (!d || isNaN(d.getTime())) return null;
        return {
          id: `lab-${lab.id}`,
          type: "lab",
          date: d,
          dateLabel: d.toLocaleString(), // more readable label
          title: "Lab result",
          description: lab.text || "Lab update",
        };
      })
      .filter(Boolean);

    const all = [...apptEvents, ...labEvents];

    // Sort by date ascending (oldest → newest).
    // If you prefer newest first, reverse the comparison.
    all.sort((a, b) => a.date - b.date);

    return all;
  }, [patient, patientAppointments, patientLabs]);

  if (!patient) {
    return (
      <>
        <Navbar breadcrumbs={["Dashboard", "Patients"]} />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Patient not found. They may have been deleted.
          </Alert>
          <Button variant="outlined" onClick={() => navigate("/patients")}>
            Back to patients
          </Button>
        </Container>
      </>
    );
  }

  const crumbs = ["Dashboard", "Patients", patient.fullName || "Patient"];

  return (
    <>
      <Navbar breadcrumbs={crumbs} />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Stack spacing={3}>
          {/* Patient Info Card */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack spacing={1}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {patient.fullName}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {patient.gender && (
                    <Chip
                      label={patient.gender}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {patient.dob && (
                    <Chip
                      label={`DOB: ${patient.dob}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {patient.address || "No address on file."}
                </Typography>
              </Stack>

              <Stack spacing={1} alignItems="flex-end">
                {patient.phone && (
                  <Typography variant="body2">
                    Phone: <b>{patient.phone}</b>
                  </Typography>
                )}
                {patient.email && (
                  <Typography variant="body2">
                    Email: <b>{patient.email}</b>
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/patients")}
                  sx={{ mt: 1 }}
                >
                  Back to patients
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* 🔹 Timeline card */}
          <PatientTimeline events={timelineEvents} />

          {/* Appointments + Labs in Grid layout */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Appointments
                </Typography>

                {patientAppointments.length === 0 ? (
                  <Alert severity="info">
                    No appointments recorded for this patient yet.
                  </Alert>
                ) : (
                  <List dense>
                    {patientAppointments.map((appt) => (
                      <ListItem key={appt.id} disablePadding>
                        <ListItemText
                          primary={appt.date}
                          secondary={appt.status || "Scheduled"}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  Lab History
                </Typography>

                {patientLabs.length === 0 ? (
                  <Alert severity="info">
                    No lab-related activity found for this patient.
                  </Alert>
                ) : (
                  <List dense>
                    {patientLabs.map((item) => (
                      <ListItem key={item.id} disablePadding>
                        <ListItemText
                          primary={item.text}
                          secondary="Lab update"
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Notes placeholder */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Clinical Notes (coming soon)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here you could add a notes system per patient (SOAP notes, visit
              summaries, etc.). For now this is a placeholder you can mention
              during interviews as the next planned feature.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
