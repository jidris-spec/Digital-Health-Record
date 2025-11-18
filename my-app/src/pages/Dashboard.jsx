// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState, useCallback } from "react";

import Navbar from "../components/Dashboard/Navbar.jsx";
import KpiRow from "../components/Dashboard/KpiRow.jsx";
import QuickAppointmentForm from "../components/Dashboard/QuickAppointmentForm.jsx";
import AppointmentsTable from "../components/Dashboard/AppointmentsTable.jsx";
import RecentActivity from "../components/Dashboard/RecentActivity.jsx";

import {
  listAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from "../utils/appointmentsStorage.jsx";

import {
  listActivity,
  addActivity,
  deleteActivity,
  clearActivity,
} from "../utils/activityStorage.jsx";

import { listPatients } from "../utils/patientsStorage.jsx";

import {
  Container,
  Collapse,
  Alert,
  Snackbar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Stack,
  Button,
  Typography,
  TextField,
  MenuItem,
  Breadcrumbs,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";

// Helper for KPIs / messages
function isSameDay(dateStr, todayISO) {
  if (!dateStr) return false;
  const normalized = dateStr.replace(" ", "T");
  return normalized.slice(0, 10) === todayISO;
}

export default function Dashboard({ isDarkMode = false, onToggleTheme }) {
  // --- App state ---
  const [loading, setLoading] = useState(true);
  const [unsaved, setUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [labPatientId, setLabPatientId] = useState("");

  // Form state (appointments)
  const [appt, setAppt] = useState({ patient: "", date: "", reason: "" });

  // Data
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);

  // --- Initial load (appointments + activity + patients) ---
  useEffect(() => {
    const existingAppts = listAppointments();
    const existingAct = listActivity();
    const existingPatients = listPatients();

    if (existingPatients.length) {
      setPatients(existingPatients);
    }

    setAppointments(existingAppts);
    setActivity(existingAct);
    setLoading(false);
  }, []);

  // Activity helper: single source of truth for logging
  const logActivity = useCallback((message, extra = {}) => {
    if (!message) return;
    const updated = addActivity({ message, ...extra });
    setActivity(updated);
  }, []);

  const handleDeleteActivity = useCallback((id) => {
    const updated = deleteActivity(id);
    setActivity(updated);
  }, []);

  const handleClearActivity = useCallback(() => {
    const updated = clearActivity();
    setActivity(updated);
  }, []);

  // KPIs (dynamic)
  const kpis = useMemo(() => {
    const todayISO = new Date().toISOString().slice(0, 10);

    const uniquePatients = new Set(
      patients
        .map((p) => (p.fullName || "").trim())
        .filter(Boolean)
    ).size;

    const todaysAppts = appointments.filter((a) => {
      const dateStr = a.dateTime || a.date;
      return isSameDay(dateStr, todayISO);
    }).length;

    const pendingLabs = activity.filter((x) => x.type === "lab").length;

    return { patients: uniquePatients, todaysAppts, pendingLabs };
  }, [patients, appointments, activity]);

  // Patient dropdown options (appointments form)
  const patientOptions = useMemo(() => {
    const names = Array.from(
      new Set(
        patients
          .map((p) => (p.fullName || "").trim())
          .filter(Boolean)
      )
    );
    return names;
  }, [patients]);

  const hasPatients = patients.length > 0;

  // Validation
  const errors = useMemo(
    () => ({
      patient: appt.patient === "" ? "Select a patient" : "",
      date: appt.date === "" ? "Pick a date & time" : "",
      reason: appt.reason.length < 5 ? "At least 5 characters" : "",
    }),
    [appt]
  );

  const hasErrors = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  // --- Handlers ---

  function saveAppointment(e) {
    e.preventDefault();
    if (hasErrors) {
      setSavedMsg("Please fix the errors before saving.");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const matchedPatient = patients.find(
        (p) => (p.fullName || "").trim() === appt.patient.trim()
      );

      const newAppt = createAppointment({
        patientId: matchedPatient ? matchedPatient.id : null,
        patientName: appt.patient,
        dateTime: appt.date, // "YYYY-MM-DDTHH:MM"
        reason: appt.reason,
      });

      setAppointments((prev) => [newAppt, ...prev]);

      const prettyDate = new Date(newAppt.dateTime).toLocaleString();
      logActivity(
        `Appointment created with ${
          newAppt.patientName || appt.patient
        } on ${prettyDate}`,
        {
          type: "APPOINTMENT_CREATED",
          entityType: "appointment",
          entityId: newAppt.id,
        }
      );

      setSaving(false);
      setUnsaved(false);
      setSavedMsg("Appointment saved successfully");
      setAppt({ patient: "", date: "", reason: "" });
    }, 800);
  }

  function onChange(field, value) {
    if (field === "__reset__") {
      setAppt({ patient: "", date: "", reason: "" });
      setUnsaved(false);
      return;
    }
    setAppt((a) => ({ ...a, [field]: value }));
    setUnsaved(true);
  }

  function requestDelete(id) {
    setToDeleteId(id);
    setConfirmOpen(true);
  }

  function confirmDelete() {
    const apptToDelete = appointments.find((a) => a.id === toDeleteId);

    const updatedList = deleteAppointment(toDeleteId);
    setAppointments(updatedList);

    if (apptToDelete) {
      const name =
        apptToDelete.patientName || apptToDelete.patient || "Unknown patient";
      const rawDate = apptToDelete.dateTime || apptToDelete.date || "";
      const normalized = rawDate ? rawDate.replace(" ", "T") : null;
      const prettyDate = normalized ? new Date(normalized).toLocaleString() : "";
      const msg = prettyDate
        ? `Appointment deleted for ${name} on ${prettyDate}`
        : `Appointment deleted for ${name}`;

      logActivity(msg, {
        type: "APPOINTMENT_DELETED",
        entityType: "appointment",
        entityId: apptToDelete.id,
      });
    } else {
      logActivity(`Appointment deleted (#${toDeleteId})`, {
        type: "APPOINTMENT_DELETED",
        entityType: "appointment",
        entityId: toDeleteId,
      });
    }

    setConfirmOpen(false);
    setToDeleteId(null);
  }

  // update appointment status (upcoming → completed / cancelled)
  function handleUpdateStatus(id, status) {
    const before = appointments.find((a) => a.id === id);

    const updatedList = updateAppointmentStatus(id, status);
    setAppointments(updatedList);

    const updated = updatedList.find((a) => a.id === id) || before;
    if (!updated) return;

    const name =
      updated.patientName || updated.patient || "Unknown patient";
    const rawDate = updated.dateTime || updated.date || "";
    const normalized = rawDate ? rawDate.replace(" ", "T") : null;
    const prettyDate = normalized ? new Date(normalized).toLocaleString() : "";

    let actionLabel = "";
    if (status === "completed") actionLabel = "marked as completed";
    if (status === "cancelled") actionLabel = "cancelled";

    const msg = prettyDate
      ? `Appointment for ${name} on ${prettyDate} ${actionLabel}.`
      : `Appointment for ${name} ${actionLabel}.`;

    logActivity(msg, {
      type: "APPOINTMENT_STATUS",
      entityType: "appointment",
      entityId: id,
      status,
    });
  }

  // Labs UX — linked via labPatientId
  function addLabResult() {
    if (!labPatientId) {
      setSavedMsg("Select a patient for the lab result first.");
      return;
    }

    const selectedPatient = patients.find((p) => p.id === labPatientId);
    if (!selectedPatient) {
      setSavedMsg("Selected patient not found. Try again.");
      return;
    }

    logActivity(
      `New lab result uploaded for ${
        selectedPatient.fullName || "Unnamed patient"
      }`,
      {
        type: "lab",
        entityType: "labResult",
        entityId: null,
      }
    );
  }

  return (
    <>
      {/* Top bar */}
      <Navbar isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />

      {/* Breadcrumb strip under navbar */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default",
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: 13 }}>
          <Typography
            color="text.secondary"
            sx={{ fontWeight: 500, letterSpacing: 0.3 }}
          >
            Dashboard
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Unsaved changes banner */}
      <Collapse in={unsaved}>
        <Alert
          severity="warning"
          sx={{ borderRadius: 0 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setUnsaved(false)}
            >
              Dismiss
            </Button>
          }
        >
          You have unsaved changes in the appointment form. Don’t forget to
          press <b>Save</b>.
        </Alert>
      </Collapse>

      {/* Linear progress while saving */}
      <Collapse in={saving}>
        <LinearProgress />
      </Collapse>

      <Container sx={{ py: 3 }}>
        <KpiRow loading={loading} kpis={kpis} />

        {/* Lab actions card with independent patient selector */}
        <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              select
              size="small"
              label="Lab patient"
              value={labPatientId}
              onChange={(e) => setLabPatientId(e.target.value)}
              sx={{ minWidth: 220 }}
              disabled={!hasPatients}
            >
              <MenuItem value="">Select patient</MenuItem>
              {patients.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.fullName || "Unnamed patient"}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              color="success"
              onClick={addLabResult}
              disabled={!hasPatients}
            >
              + Add Lab Result
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              Link lab results directly to a patient. These will appear in their
              <b> Lab History</b> on the profile page and count toward Pending
              Labs.
            </Typography>
          </Stack>
        </Paper>

        {/* Main layout */}
        <Grid container spacing={3} alignItems="flex-start">
          {/* LEFT COLUMN: Quick appointment */}
          <Grid xs={12} md={5}>
            {!hasPatients && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No patients in the system yet. Go to{" "}
                <b>Patients → Add Patient</b> before creating appointments or lab
                results.
              </Alert>
            )}

            <QuickAppointmentForm
              appt={appt}
              errors={errors}
              saving={saving}
              hasErrors={hasErrors}
              onChange={onChange}
              onSubmit={saveAppointment}
              patientOptions={patientOptions}
            />
          </Grid>

          {/* RIGHT COLUMN: Today’s appointments + Recent activity side by side */}
          <Grid xs={12} md={7}>
            <Grid container spacing={2} alignItems="stretch">
              <Grid xs={12} md={6}>
                <AppointmentsTable
                  loading={loading}
                  appointments={appointments}
                  requestDelete={requestDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <RecentActivity
                  activity={activity}
                  onDeleteItem={handleDeleteActivity}
                  onClearAll={handleClearActivity}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* “Saved!” microinteraction */}
      <Snackbar
        open={!!savedMsg}
        autoHideDuration={1800}
        onClose={() => setSavedMsg("")}
        message={savedMsg}
      />

      {/* Confirm delete dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete appointment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action can’t be undone. If this was a mistake, consider
            cancelling instead of deleting.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
