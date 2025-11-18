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

import { listPatients } from "../utils/patientsStorage.jsx";
import { listAppointments } from "../utils/appointmentsStorage.jsx";
import { listActivity } from "../utils/activityStorage.jsx";

function calcAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return age;
}

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const patients = listPatients();
  const appointments = listAppointments();
  const activity = listActivity();

  const patient = patients.find((p) => p.id === id) || null;

  // All this patient's appointments
  const patientAppointments = useMemo(() => {
    if (!patient) return [];

    const patientName = (patient.fullName || "").trim();

    return appointments.filter((a) => {
      const apptName = (a.patientName || a.patient || "").trim();
      return apptName === patientName;
    });
  }, [appointments, patient]);

  // All this patient's lab-related events
  const patientLabs = useMemo(() => {
    if (!patient) return [];
    const name = (patient.fullName || "").toLowerCase();

    return activity.filter((item) => {
      if (item.type !== "lab") return false;

      const text = (item.message || item.text || "").toLowerCase();
      const storedName = (item.patientName || "").toLowerCase();

      if (item.patientId && item.patientId === patient.id) return true;

      return storedName === name || text.includes(name);
    });
  }, [activity, patient]);

  // Unified timeline events (appointments + labs)
  const timelineEvents = useMemo(() => {
    if (!patient) return [];

    const parseDate = (raw) => {
      if (!raw) return null;

      if (typeof raw === "string" && raw.includes(" ") && !raw.includes("T")) {
        return new Date(raw.replace(" ", "T"));
      }

      return new Date(raw);
    };

    const apptEvents = patientAppointments
      .map((appt) => {
        const rawDate = appt.dateTime || appt.date;
        const d = parseDate(rawDate);
        if (!d || Number.isNaN(d.getTime())) return null;

        return {
          id: `appt-${appt.id}`,
          type: "appt",
          date: d,
          dateLabel: d.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          title: "Appointment",
          description: appt.reason
            ? `${appt.reason} (${appt.status || "upcoming"})`
            : appt.status || "Upcoming appointment",
        };
      })
      .filter(Boolean);

    const labEvents = patientLabs
      .map((lab) => {
        const rawDate = lab.createdAt || lab.date;
        const d = parseDate(rawDate);
        if (!d || Number.isNaN(d.getTime())) return null;

        const label = d.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const desc = lab.message || lab.text || "Lab update";

        return {
          id: `lab-${lab.id}`,
          type: "lab",
          date: d,
          dateLabel: label,
          title: "Lab result",
          description: desc,
        };
      })
      .filter(Boolean);

    const all = [...apptEvents, ...labEvents];

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
  const dob = patient.dob || patient.dateOfBirth || "";
  const age = calcAge(dob);

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
                  {dob && (
                    <Chip
                      label={`DOB: ${dob}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {age != null && (
                    <Chip
                      label={`${age} years`}
                      size="small"
                      color="secondary"
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

          {/* Timeline card */}
          <PatientTimeline events={timelineEvents} />

          {/* Appointments + Labs in Grid layout */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
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
                          primary={appt.dateTime || appt.date}
                          secondary={appt.status || "upcoming"}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
                          primary={item.message || item.text}
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
